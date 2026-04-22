/* @proprietary license */

import { execSync } from 'node:child_process';
import path from 'node:path';
import { buildRegistry } from '@/lib/scripts/build-registry';
import * as OpenAPI from 'fumadocs-openapi';
import { rimraf } from 'rimraf';
import { openapi } from '@/lib/openapi';

const OPENAPI_OUTPUT = './content/docs/openapi/generated';

function exportOpenApiFromNest(): void {
  const apiRoot = path.resolve(process.cwd(), '..', 'api');
  execSync('pnpm run openapi:export', { cwd: apiRoot, stdio: 'inherit' });
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
