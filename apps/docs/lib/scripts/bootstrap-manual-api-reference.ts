/* @proprietary license */

/**
 * One-shot / maintenance: (re)writes manual REST API MDX pages from apps/docs/openapi.json
 * and refreshes per-section meta.json under content/docs/api. Run from apps/docs:
 * `pnpm exec tsx lib/scripts/bootstrap-manual-api-reference.ts`
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  REST_API_SECTION_ORDER,
  isAgentRoute,
  pathToFolder,
} from '@/lib/scripts/manual-api/constants';
import {
  collectPublicOperations,
  renderOperationPageMdx,
} from '@/lib/scripts/manual-api/render-operation-mdx';

const DOCS_API_ROOT = join(process.cwd(), 'content/docs/api');

function toSectionTitle(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function main(): Promise<void> {
  const specPath = join(process.cwd(), 'openapi.json');
  const raw = readFileSync(specPath, 'utf-8');
  const spec = JSON.parse(raw) as unknown as Parameters<
    typeof collectPublicOperations
  >[0];

  const all = collectPublicOperations(spec);
  const merchant = all.filter((o) => !isAgentRoute(o.path));
  const schemaComponents = (spec as { components?: { schemas?: Record<string, unknown> } })
    .components?.schemas;

  const byFolder = new Map<string, typeof merchant>();
  for (const entry of merchant) {
    const folder = pathToFolder(entry.path);
    const list = byFolder.get(folder) ?? [];
    list.push(entry);
    byFolder.set(folder, list);
  }

  for (const [folder, entries] of byFolder) {
    const dir = join(DOCS_API_ROOT, folder);
    mkdirSync(dir, { recursive: true });

    entries.sort((a, b) => a.operationId.localeCompare(b.operationId));

    for (const { method, path: routePath, operationId, operation } of entries) {
      const rawPathItem = spec.paths?.[routePath] as
        | { parameters?: unknown[] }
        | undefined;

      const mdx = renderOperationPageMdx({
        method,
        path: routePath,
        operationId,
        operation,
        pathItem: rawPathItem as Parameters<
          typeof renderOperationPageMdx
        >[0]['pathItem'],
        components: {
          schemas: schemaComponents as Parameters<
            typeof renderOperationPageMdx
          >[0]['components'] extends { schemas?: infer TSchemas }
            ? TSchemas
            : never,
        },
      });

      const filePath = join(dir, `${operationId}.mdx`);
      writeFileSync(filePath, `${mdx.trim()}\n`, 'utf-8');
    }

    const pageNames = entries
      .map((e) => e.operationId)
      .sort((a, b) => a.localeCompare(b));

    const metaTitle = toSectionTitle(folder);

    const metaPath = join(dir, 'meta.json');
    writeFileSync(
      metaPath,
      `${JSON.stringify(
        {
          title: metaTitle,
          pages: pageNames,
        },
        null,
        2,
      )}\n`,
      'utf-8',
    );
  }

  const rootPages = [...REST_API_SECTION_ORDER].filter((name) =>
    byFolder.has(name),
  );

  const rootMeta = {
    title: 'REST API',
    description:
      'Payment and commerce endpoints. Reference pages are hand-written; the OpenAPI JSON export remains the schema contract.',
    root: true,
    icon: 'BookOpen',
    pages: rootPages,
  };

  writeFileSync(
    join(DOCS_API_ROOT, 'meta.json'),
    `${JSON.stringify(rootMeta, null, 2)}\n`,
    'utf-8',
  );

  console.log(
    `Manual API docs: wrote ${merchant.length} operations across ${byFolder.size} folders.`,
  );

  const openapiOnly = merchant.map((o) => `${o.method.toUpperCase()} ${o.path}`).sort();
  writeFileSync(
    join(process.cwd(), 'lib/scripts/manual-api/_expected-public-operations.json'),
    `${JSON.stringify(openapiOnly, null, 2)}\n`,
    'utf-8',
  );
}

void main();
