/* @proprietary license */

/**
 * Bootstraps the Nest app (same Express middleware stack as production),
 * emits OpenAPI JSON for Fumadocs, then exits.
 *
 * Run from `apps/api`: `pnpm run openapi:export`
 * Writes to `apps/docs/openapi.json`.
 */

import { writeFileSync } from 'node:fs';
import * as path from 'node:path';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { OpenApiExportModule } from '../open-api-export.module';
import { buildSwaggerDocumentBase } from '../swagger.config';

function resolveDocsOpenApiPath(): string {
  // Run with cwd `apps/api` (see package.json script).
  return path.resolve(process.cwd(), '../docs/openapi.json');
}

/** Paths registered for infra / smoke tests, not merchant HTTP API surface. */
const OPENAPI_NOISE_PATHS = new Set([
  '/',
  '/robots.txt',
  '/favicon.ico',
  '/favicon.png',
  '/test/webhook-event',
]);

function stripNoiseOpenApiPaths<T extends { paths?: Record<string, unknown> }>(
  document: T,
): T {
  if (!document.paths) return document;
  const paths = { ...document.paths };
  for (const p of OPENAPI_NOISE_PATHS) {
    delete paths[p];
  }
  return { ...document, paths };
}

function attachExpressMiddleware(expressApp: express.Express) {
  expressApp.use(
    '/webhooks',
    express.raw({ type: 'application/json', limit: '10mb' }),
    (req, res, next) => {
      (req as express.Request & { rawBody?: unknown }).rawBody = req.body;
      next();
    },
  );
  expressApp.use(express.json({ limit: '10mb' }));
}

async function exportOpenApi(): Promise<void> {
  const expressApp = express();
  attachExpressMiddleware(expressApp);

  const app = await NestFactory.create(
    OpenApiExportModule,
    new ExpressAdapter(expressApp),
    {
      logger: ['error', 'warn'],
      bodyParser: false,
    },
  );

  const builderResult = buildSwaggerDocumentBase();
  const document = stripNoiseOpenApiPaths(
    SwaggerModule.createDocument(app, builderResult),
  );

  document.servers = [
    { url: 'https://api.lomi.africa', description: 'Live' },
    { url: 'https://sandbox.api.lomi.africa', description: 'Test' },
  ];

  const outPath = resolveDocsOpenApiPath();
  writeFileSync(outPath, `${JSON.stringify(document, null, 2)}\n`, 'utf-8');
  console.log(`OpenAPI written to ${outPath}`);

  await app.close();
}

void exportOpenApi().catch((err) => {
  console.error(err);
  process.exit(1);
});
