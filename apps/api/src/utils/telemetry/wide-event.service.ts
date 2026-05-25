import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

type WideEventCategory =
  | 'checkout'
  | 'payment'
  | 'auth'
  | 'api'
  | 'webhook'
  | 'catalog'
  | 'customer'
  | 'subscription'
  | 'onboarding'
  | 'system';

type WideEventSeverity = 'info' | 'warning' | 'error' | 'critical';

type LogWideEventParams = {
  eventName: string;
  category?: WideEventCategory;
  severity?: WideEventSeverity;
  organizationId?: string;
  correlationId?: string;
  attributes?: Record<string, unknown>;
  message?: string;
  source?: string;
};

const inferCategory = (eventName: string): WideEventCategory => {
  if (
    eventName.startsWith('checkout_') ||
    eventName === 'checkout_flow' ||
    eventName.startsWith('storefront_')
  ) {
    return 'checkout';
  }
  if (
    eventName.includes('wave_') ||
    eventName.includes('mtn_') ||
    eventName.includes('stripe_') ||
    eventName.includes('payment')
  ) {
    return 'payment';
  }
  return 'system';
};

const inferSeverity = (eventName: string): WideEventSeverity => {
  if (eventName.includes('_failed') || eventName.includes('_error')) {
    return 'error';
  }
  return 'info';
};

@Injectable()
export class WideEventService {
  private readonly logger = new Logger(WideEventService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /** Persists a wide event via Supabase RPC (fire-and-forget). */
  logEvent(params: LogWideEventParams): void {
    const {
      eventName,
      category = inferCategory(eventName),
      severity = inferSeverity(eventName),
      organizationId,
      correlationId,
      attributes = {},
      message,
      source = 'api:webhook',
    } = params;

    void this.supabase
      .rpc('log_wide_event' as never, {
        p_event_name: eventName,
        p_category: category,
        p_severity: severity,
        p_correlation_id: correlationId ?? undefined,
        p_organization_id: organizationId ?? undefined,
        p_attributes: attributes,
        p_message: message ?? undefined,
        p_source: source,
        p_environment: process.env.NODE_ENV || 'production',
      } as never)
      .then(({ error }) => {
        if (error) {
          this.logger.warn(`Failed to log wide event ${eventName}: ${error.message}`);
        }
      })
      .catch((error: unknown) => {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        this.logger.warn(`Failed to log wide event ${eventName}: ${msg}`);
      });
  }
}
