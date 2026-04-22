import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WaveWebhookService } from './wave-webhook.service';
import type { Request } from 'express';

@ApiTags('Webhooks - Providers')
@Controller('webhooks/wave')
export class WaveWebhookController {
  private readonly logger = new Logger(WaveWebhookController.name);

  constructor(private readonly waveWebhookService: WaveWebhookService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive Wave webhook events',
    description:
      'Endpoint for Wave to send payment notifications. Verifies signature and processes events.',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook received and processed successfully',
    schema: {
      type: 'object',
      properties: {
        received: { type: 'boolean', example: true },
      },
      additionalProperties: true,
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid webhook signature',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error processing webhook',
  })
  async handleWebhook(
    @Headers() headers: Record<string, string>,
    @Body() body: any,
    @Req() request: RawBodyRequest<Request>,
  ) {
    this.logger.log('Received Wave webhook request');

    try {
      // Get raw body for signature verification
      // The raw body might be a Buffer from express.raw() middleware
      let rawBody: string;
      let parsedBody: any;

      const rawBodyData = (request as any).rawBody;

      if (rawBodyData) {
        // Convert Buffer to string if needed
        rawBody = Buffer.isBuffer(rawBodyData)
          ? rawBodyData.toString('utf8')
          : rawBodyData;

        // Parse the raw body to get the actual JSON
        try {
          parsedBody = JSON.parse(rawBody);
          this.logger.debug(
            `Parsed webhook body - type: ${parsedBody.type}, has data: ${!!parsedBody.data}`,
          );
        } catch (parseError) {
          this.logger.error(`Failed to parse raw body: ${parseError.message}`);
          this.logger.debug(
            `Raw body content (first 500 chars): ${rawBody.substring(0, 500)}`,
          );
          parsedBody = body; // Fallback to body if parsing fails
        }
      } else {
        // No raw body, use the body directly
        parsedBody = body;
        rawBody = JSON.stringify(body);
        this.logger.debug('No rawBody found, using body directly');
      }

      // Log body type and content for debugging
      this.logger.debug(
        `Body type: ${typeof parsedBody}, isEmpty: ${!parsedBody || Object.keys(parsedBody || {}).length === 0}`,
      );

      // Process the webhook with parsed body
      const result = await this.waveWebhookService.handleWebhook(
        headers,
        parsedBody,
        rawBody,
      );

      this.logger.log(
        `Webhook processed successfully: ${parsedBody?.type || 'unknown'}`,
      );

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
