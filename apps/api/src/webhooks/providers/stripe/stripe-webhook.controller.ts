import {
  Controller,
  Post,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StripeWebhookService } from './stripe-webhook.service';
import type { Request } from 'express';

@ApiTags('Webhooks - Fournisseurs')
@Controller('webhooks/stripe')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Réception des événements webhook Stripe',
    description:
      'Point de terminaison pour les notifications Stripe. Vérifie la signature et traite les événements.',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook reçu et traité avec succès',
    schema: {
      type: 'object',
      properties: {
        received: { type: 'boolean', example: true },
      },
      additionalProperties: true,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Signature webhook invalide',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne lors du traitement du webhook',
  })
  async handleWebhook(
    @Headers() headers: Record<string, string>,
    @Req() request: RawBodyRequest<Request>,
  ) {
    this.logger.log('Received Stripe webhook request');

    try {
      // Get raw body for signature verification (required by Stripe)
      const rawBody = (request as any).rawBody;

      if (!rawBody) {
        this.logger.error('No raw body found in request');
        throw new Error('Raw body required for signature verification');
      }

      // Get signature from headers
      const signature = headers['stripe-signature'];

      if (!signature) {
        this.logger.error('Missing Stripe signature header');
        throw new Error('Stripe signature required');
      }

      // Process the webhook
      const result = await this.stripeWebhookService.handleWebhook(
        signature,
        rawBody,
      );

      this.logger.log(`Webhook processed successfully: ${result.eventType}`);

      return { received: true, ...result };
    } catch (error) {
      this.logger.error(
        `Webhook processing error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
