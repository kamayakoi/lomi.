/* @proprietary license */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { buildRegistry } from '@/lib/scripts/build-registry';
import * as OpenAPI from 'fumadocs-openapi';
import { rimraf } from 'rimraf';
import { openapi } from '@/lib/openapi';

const OPENAPI_OUTPUT = './content/docs/openapi/generated';

function resolveApiRoot(): string | null {
  const candidates = [
    process.env.DOCS_API_ROOT,
    path.resolve(process.cwd(), '..', 'api'),
    path.resolve(process.cwd(), '..', '..', 'apps', 'api'),
    path.resolve(process.cwd(), 'apps', 'api'),
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    if (existsSync(path.join(candidate, 'package.json'))) {
      return candidate;
    }
  }

  return null;
}

function exportOpenApiFromNest(): void {
  const apiRoot = resolveApiRoot();
  if (!apiRoot) {
    console.warn(
      'Could not locate apps/api; skipping OpenAPI export and using checked-in apps/docs/openapi.json.',
    );
    return;
  }

  try {
    execSync('pnpm run openapi:export', { cwd: apiRoot, stdio: 'inherit' });
  } catch (error) {
    console.warn(
      'OpenAPI export from apps/api failed; continuing with checked-in apps/docs/openapi.json:',
      error instanceof Error ? error.message : String(error),
    );
  }
}

export async function generateDocs() {
  exportOpenApiFromNest();
  await rimraf(OPENAPI_OUTPUT);

  await OpenAPI.generateFiles({
    input: openapi,
    output: OPENAPI_OUTPUT,
    per: 'operation',
    includeDescription: true,
    index: {
      url: {
        baseUrl: '/',
        contentDir: path.resolve('./content/docs'),
      },
      items: [
        {
          path: 'index',
          title: 'API operations',
          description:
            'All endpoints from the OpenAPI document exported from the Nest API.',
        },
      ],
    },
    beforeWrite(files) {
      const pages = files
        .filter((f) => f.path.endsWith('.mdx'))
        .map((f) => f.path.replace(/\.mdx$/, ''))
        .filter((name) => name !== 'index')
        .sort();
      files.push({
        path: 'meta.json',
        content: `${JSON.stringify(
          {
            title: 'Operations',
            pages: ['index', ...pages],
          },
          null,
          2,
        )}\n`,
      });
    },
  });
}

async function main() {
  // Run registry build with error handling
  try {
    await buildRegistry();
  } catch (error) {
    console.warn(
      'Registry build failed, but continuing with docs generation:',
      error instanceof Error ? error.message : String(error),
    );
  }

  // Generate docs
  await generateDocs();
}

await main().catch((e) => {
  console.error('Failed to run pre build script', e);
  process.exit(1);
});
