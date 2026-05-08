/* @proprietary license */

/**
 * Public webhook HTTP surface for OpenAPI export only (no BullMQ queue / workers).
 * Provider ingress routes are intentionally excluded from public merchant docs.
 */

import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksOpenApiModule {}
