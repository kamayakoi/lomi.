import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../utils/supabase/supabase.service';
import axios from 'axios';
import * as crypto from 'crypto';
import { WebhookEvent } from '../utils/types/api';
import { Queue } from 'bullmq';

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  organization_id: string;
}

export interface WebhookDeliveryContext {
  dispatchId?: string;
  outboxId?: string;
  /** 1-based Bull attempt (job.attemptsMade + 1) */
  attemptNumber?: number;
  merchantId?: string;
}

export interface WebhookSendResult {
  success: boolean;
  /** When false and shouldRetry is true, Bull should retry. */
  shouldRetry: boolean;
  lastResponseStatus?: number;
  lastResponseBody?: unknown;
  deadLetterReason?: string;
  /** Sync path: inactive / not subscribed without a dispatch row. */
  inactiveOrUnsubscribed?: boolean;
}

@Injectable()
export class WebhookSenderService {
  private readonly logger = new Logger(WebhookSenderService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Feature flag + optional canary list: WEBHOOK_OUTBOX_CANARY_ORG_IDS=uuid1,uuid2
   */
  isWebhookOutboxEnabled(organizationId: string): boolean {
    if (process.env.WEBHOOK_OUTBOX_ENABLED === 'true') {
      return true;
    }
    const raw = process.env.WEBHOOK_OUTBOX_CANARY_ORG_IDS;
    if (!raw?.trim()) {
      return false;
    }
    const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);
    return ids.includes(organizationId);
  }

  /**
   * Prepares the webhook payload based on the event type and data
   */
  prepareWebhookPayload(
    event: WebhookEvent,
    data: any,
    stablePayloadId?: string,
  ): any {
    const timestamp = new Date().toISOString();

    return {
      id: stablePayloadId ?? crypto.randomUUID(),
      event,
      timestamp,
      data,
      lomi_environment: process.env.NODE_ENV || 'development',
    };
  }

  /**
   * Generates a signature for the webhook payload using the webhook secret
   */
  generateSignature(payloadString: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');
  }

  /**
   * Single HTTP attempt. BullMQ is the sole retry authority when dispatchId is set.
   */
  async sendWebhookWithContext(
    webhook: Webhook,
    event: WebhookEvent,
    data: any,
    context?: WebhookDeliveryContext,
  ): Promise<WebhookSendResult> {
    this.logger.log({
      message: 'Attempting to send webhook',
      webhookId: webhook.id,
      event,
      url: webhook.url,
      dispatchId: context?.dispatchId,
      attempt: context?.attemptNumber,
    });

    const stablePayloadId = context?.outboxId;

    if (!webhook.active || !webhook.events.includes(event)) {
      this.logger.log(
        `Webhook ${webhook.id} inactive or not subscribed to ${event}`,
      );
      if (context?.dispatchId) {
        await this.supabase.rpc('mark_webhook_dispatch_dead_letter', {
          p_dispatch_id: context.dispatchId,
          p_reason: 'webhook_inactive_or_unsubscribed',
        });
        return {
          success: true,
          shouldRetry: false,
        };
      }
      return {
        success: false,
        shouldRetry: false,
        inactiveOrUnsubscribed: true,
      };
    }

    const payload = this.prepareWebhookPayload(event, data, stablePayloadId);
    const payloadString = JSON.stringify(payload);
    const signature = this.generateSignature(payloadString, webhook.secret);

    const started = Date.now();

    try {
      const response = await axios.post(webhook.url, payloadString, {
        headers: {
          'Content-Type': 'application/json',
          'X-Lomi-Signature': signature,
          'X-Lomi-Event': event,
          'User-Agent': 'Lomi-Webhook/1.0',
        },
        timeout: 4000,
      });

      const durationMs = Date.now() - started;

      if (context?.dispatchId && context.attemptNumber != null) {
        await this.supabase.rpc('record_webhook_delivery_attempt', {
          p_dispatch_id: context.dispatchId,
          p_attempt_number: context.attemptNumber,
          p_response_status: response.status,
          p_response_body:
            typeof response.data === 'string'
              ? response.data
              : JSON.stringify(response.data),
          p_error_message: null,
          p_request_duration_ms: durationMs,
        });
      }

      if (response.status >= 200 && response.status < 300) {
        await this.logDelivery(
          webhook.id,
          response.status,
          response.data,
          payload,
          context?.attemptNumber ?? 1,
          context?.merchantId,
        );

        if (context?.dispatchId) {
          await this.supabase.rpc('mark_webhook_dispatch_delivered', {
            p_dispatch_id: context.dispatchId,
          });
        }

        this.logger.log(`Webhook ${webhook.id} delivered successfully`);
        return {
          success: true,
          shouldRetry: false,
          lastResponseStatus: response.status,
          lastResponseBody: response.data,
        };
      }

      const bodyPreview =
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data);

      if (context?.dispatchId && context.attemptNumber != null) {
        await this.supabase.rpc('record_webhook_delivery_attempt', {
          p_dispatch_id: context.dispatchId,
          p_attempt_number: context.attemptNumber,
          p_response_status: response.status,
          p_response_body: bodyPreview,
          p_error_message: `non_success_status_${response.status}`,
          p_request_duration_ms: durationMs,
        });
      }

      const clientErr = response.status >= 400 && response.status < 500;
      return {
        success: false,
        shouldRetry: !clientErr,
        lastResponseStatus: response.status,
        lastResponseBody: response.data,
        deadLetterReason: clientErr ? 'client_error_http' : 'server_error_http',
      };
    } catch (error: any) {
      const durationMs = Date.now() - started;
      const status = error.response?.status as number | undefined;
      const respBody = error.response?.data ?? error.message;

      if (context?.dispatchId && context.attemptNumber != null) {
        await this.supabase.rpc('record_webhook_delivery_attempt', {
          p_dispatch_id: context.dispatchId,
          p_attempt_number: context.attemptNumber,
          p_response_status: status ?? null,
          p_response_body:
            typeof respBody === 'string' ? respBody : JSON.stringify(respBody),
          p_error_message: error.message ?? 'request_failed',
          p_request_duration_ms: durationMs,
        });
      }

      this.logger.warn(
        `Webhook delivery failed (single attempt): ${error.message}`,
      );

      const clientErr = status != null && status >= 400 && status < 500;
      return {
        success: false,
        shouldRetry: !clientErr,
        lastResponseStatus: status,
        lastResponseBody: respBody,
        deadLetterReason: clientErr ? 'client_error_http' : 'network_or_server',
      };
    }
  }

  /**
   * Backwards-compatible: one or more internal attempts (no outbox / no Bull).
   */
  async sendWebhook(
    webhook: Webhook,
    event: WebhookEvent,
    data: any,
    maxRetries = 3,
    retryDelay = 3000,
  ): Promise<boolean> {
    let retries = 0;
    let last: WebhookSendResult | undefined;
    while (retries <= maxRetries) {
      const r = await this.sendWebhookWithContext(webhook, event, data);
      last = r;
      if (r.success) {
        return true;
      }
      if (r.inactiveOrUnsubscribed) {
        return false;
      }
      if (!r.shouldRetry) {
        await this.logDelivery(
          webhook.id,
          r.lastResponseStatus ?? 0,
          r.lastResponseBody,
          this.prepareWebhookPayload(event, data),
          retries + 1,
        );
        return false;
      }
      retries++;
      if (retries <= maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * Math.pow(2, retries - 1)),
        );
      }
    }

    await this.logDelivery(
      webhook.id,
      last?.lastResponseStatus ?? 0,
      last?.lastResponseBody ?? 'exhausted_local_retries',
      this.prepareWebhookPayload(event, data),
      maxRetries + 1,
    );

    this.logger.error(
      `Webhook ${webhook.id} delivery failed after ${maxRetries} local retries`,
    );
    return false;
  }

  private async logDelivery(
    webhookId: string,
    status: number,
    responseBody: any,
    payload: any,
    attemptNumber: number,
    merchantId?: string,
  ) {
    try {
      const { error } = await this.supabase.rpc('log_webhook_delivery', {
        p_webhook_id: webhookId,
        p_merchant_id:
          merchantId ??
          payload.data?.merchant_id ??
          payload.data?.organization_id,
        p_organization_id: payload.data?.organization_id,
        p_event_type: payload.event,
        p_payload: payload,
        p_response_status: status,
        p_response_body:
          typeof responseBody === 'string'
            ? responseBody
            : JSON.stringify(responseBody),
        p_attempt_number: attemptNumber,
        p_headers: null,
        p_request_duration_ms: undefined,
      });

      if (error) {
        this.logger.error(`Failed to log webhook delivery: ${error.message}`);
      }
    } catch (err: any) {
      this.logger.error(`Failed to log webhook delivery: ${err.message}`);
    }
  }

  async queueWebhooksForOrganization(
    organizationId: string,
    event: WebhookEvent,
    data: any,
    queue: Queue,
  ) {
    const { data: merchantId, error: merchantError } = await this.supabase.rpc(
      'get_merchant_from_organization',
      {
        p_organization_id: organizationId,
      },
    );

    if (merchantError || !merchantId) {
      this.logger.error(
        `Failed to get merchant for org ${organizationId}: ${merchantError?.message || 'No merchant found'}`,
      );
      return;
    }

    const { data: webhooks, error } = await this.supabase.rpc(
      'fetch_organization_webhooks',
      {
        p_merchant_id: merchantId,
        p_organization_id: organizationId,
        p_event: event,
        p_is_active: true,
        p_search_term: null,
        p_environment: 'live',
      },
    );

    if (error) {
      this.logger.error(
        `Failed to fetch webhooks for org ${organizationId}: ${error.message}`,
      );
      return;
    }

    const webhooksArray = (webhooks as any[]) || [];
    if (webhooksArray.length === 0) {
      this.logger.log(
        `No webhooks found for org ${organizationId} subscribed to event ${event}`,
      );
      return;
    }

    const relevantWebhooks = webhooksArray
      .map((w: any) => ({
        id: w.webhook_id,
        url: w.url,
        events: w.authorized_events as WebhookEvent[],
        secret: w.verification_token,
        active: w.is_active,
        organization_id: w.organization_id,
      }))
      .filter((w) => w.events.includes(event));

    if (relevantWebhooks.length === 0) {
      return;
    }

    const useOutbox = this.isWebhookOutboxEnabled(organizationId);
    const idempotencyKey =
      data?.id != null && String(data.id).length > 0
        ? `${event}:${String(data.id)}`
        : `${event}:${crypto.randomUUID()}`;

    let outboxId: string | undefined;

    if (useOutbox) {
      const { data: oid, error: obErr } = await this.supabase.rpc(
        'webhook_outbox_upsert_event',
        {
          p_organization_id: organizationId,
          p_event_type: event,
          p_idempotency_key: idempotencyKey,
          p_payload: data,
        },
      );
      if (obErr) {
        this.logger.error(
          `webhook_outbox_upsert_event failed: ${obErr.message}`,
        );
      } else if (oid) {
        outboxId = oid as string;
      }
    }

    for (const webhook of relevantWebhooks) {
      let dispatchId: string | undefined;

      if (useOutbox && outboxId) {
        const { data: did, error: dErr } = await this.supabase.rpc(
          'webhook_dispatch_ensure',
          {
            p_outbox_id: outboxId,
            p_webhook_id: webhook.id,
          },
        );
        if (dErr) {
          this.logger.error(`webhook_dispatch_ensure failed: ${dErr.message}`);
          continue;
        }
        dispatchId = did as string;
      }

      const jobId =
        dispatchId != null
          ? `wh-dispatch:${dispatchId}`
          : `wh-fallback:${webhook.id}:${idempotencyKey}:${crypto.randomUUID()}`;

      try {
        await queue.add(
          'send-webhook',
          {
            webhook,
            event,
            data,
            dispatchId,
            outboxId,
            merchantId,
          },
          {
            jobId,
            attempts: 5,
            backoff: {
              type: 'exponential',
              delay: 5000,
            },
          },
        );
      } catch (e: any) {
        this.logger.warn(
          `Queue add skipped or duplicate jobId ${jobId}: ${e.message}`,
        );
      }
    }

    this.logger.log(
      `Queued ${relevantWebhooks.length} webhook jobs for org ${organizationId} (outbox=${useOutbox})`,
    );
  }

  async notifyOrganization(
    organizationId: string,
    event: WebhookEvent,
    data: any,
  ) {
    const { data: merchantId, error: merchantError } = await this.supabase.rpc(
      'get_merchant_from_organization',
      {
        p_organization_id: organizationId,
      },
    );

    if (merchantError || !merchantId) {
      this.logger.error(
        `Failed to get merchant for org ${organizationId}: ${merchantError?.message || 'No merchant found'}`,
      );
      return;
    }

    const { data: webhooks, error } = await this.supabase.rpc(
      'fetch_organization_webhooks',
      {
        p_merchant_id: merchantId,
        p_organization_id: organizationId,
        p_event: event,
        p_is_active: true,
        p_search_term: null,
        p_environment: 'live',
      },
    );

    if (error) {
      this.logger.error(
        `Failed to fetch webhooks for org ${organizationId}: ${error.message}`,
      );
      return;
    }

    const webhooksArray = (webhooks as any[]) || [];
    if (webhooksArray.length === 0) {
      this.logger.log(
        `No webhooks found for org ${organizationId} subscribed to event ${event}`,
      );
      return;
    }

    const relevantWebhooks = webhooksArray
      .map((w: any) => ({
        id: w.webhook_id,
        url: w.url,
        events: w.authorized_events as WebhookEvent[],
        secret: w.verification_token,
        active: w.is_active,
        organization_id: w.organization_id,
      }))
      .filter((w) => w.events.includes(event));

    await Promise.allSettled(
      relevantWebhooks.map((w) => this.sendWebhook(w, event, data)),
    );
  }
}
