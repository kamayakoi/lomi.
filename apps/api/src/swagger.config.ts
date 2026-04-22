/* @proprietary license */

import { DocumentBuilder } from '@nestjs/swagger';

/**
 * Shared OpenAPI / Swagger document config for runtime (`main.ts`) and
 * static export (`scripts/export-openapi.ts`).
 */
export function buildSwaggerDocumentBase() {
  return new DocumentBuilder()
    .setTitle('lomi. API')
    .setDescription(
      'Payment processing API for francophone West African businesses.',
    )
    .setVersion('1.1.0')
    .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' }, 'X-API-KEY')
    .build();
}
