/* @proprietary license */

import { glob } from 'tinyglobby';
import { printErrors, scanURLs, validateFiles } from 'next-validate-link';
import { createGetUrl, getSlugs } from 'fumadocs-core/source';
import { TOCItemType } from 'fumadocs-core/toc';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { remarkInclude } from 'fumadocs-mdx/config';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';
import { remark } from 'remark';
import { remarkHeading } from 'fumadocs-core/mdx-plugins';

const HTTP_METHODS = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
] as const;

/** Guardrails for public REST docs tone (source: openapi.json from Nest @ApiOperation). */
const OPENAPI_DESCRIPTION_BANNED: { test: RegExp; hint: string }[] = [
  {
    test: /not removed from the database/i,
    hint: "Avoid storage implementation detail (e.g. say the resource no longer appears in list/get).",
  },
  {
    test: /pre-calculated and stored in the database/i,
    hint: "Describe the metrics returned, not how they are stored.",
  },
  {
    test: /only accessible if the .+ belongs to your organization/i,
    hint: "Prefer: “Responds with 404 if … not available for this API key.”",
  },
  {
    test: /soft deletes? a/i,
    hint: "Describe customer-visible behavior, not “soft delete” / DB details.",
  },
  {
    test: /marked as deleted but not removed/i,
    hint: "Same as soft-delete: describe API behavior, not row state.",
  },
];

type JsonObject = Record<string, unknown>;

function collectOpenApiTextErrors(
  spec: JsonObject,
  errors: string[],
): void {
  if (!spec.paths || typeof spec.paths !== 'object') return;

  for (const [p, item] of Object.entries(spec.paths as Record<string, unknown>)) {
    if (!item || typeof item !== 'object') continue;
    const pathItem = item as JsonObject;
    for (const method of HTTP_METHODS) {
      const op = pathItem[method];
      if (!op || typeof op !== 'object') continue;
      const operation = op as JsonObject;
      for (const field of ['summary', 'description'] as const) {
        const text = operation[field];
        if (typeof text !== 'string') continue;
        for (const { test, hint } of OPENAPI_DESCRIPTION_BANNED) {
          if (test.test(text)) {
            errors.push(
              `openapi.json ${method.toUpperCase()} ${p} ${field}: banned phrasing (${hint})`,
            );
          }
        }
      }
    }
  }
}

function collectOpenApiSecurityErrors(
  spec: JsonObject,
  errors: string[],
): void {
  const schemes = spec.components;
  if (
    schemes &&
    typeof schemes === 'object' &&
    'securitySchemes' in schemes &&
    schemes.securitySchemes &&
    typeof schemes.securitySchemes === 'object' &&
    'X-API-KEY' in (schemes.securitySchemes as object)
  ) {
    errors.push(
      "openapi.json: components.securitySchemes must use only the canonical name `api-key` (header `name` stays `X-API-KEY`), not a duplicate `X-API-KEY` scheme key. Run `pnpm run build:pre` in apps/docs or normalize security.",
    );
  }

  const checkReqs = (where: string, reqs: unknown) => {
    if (!Array.isArray(reqs)) return;
    for (const req of reqs) {
      if (req && typeof req === 'object' && 'X-API-KEY' in (req as object)) {
        errors.push(
          `${where}: security must reference "api-key", not "X-API-KEY" as a scheme name.`,
        );
      }
    }
  };

  checkReqs('openapi.json security', spec.security);
  if (!spec.paths || typeof spec.paths !== 'object') return;

  for (const [p, item] of Object.entries(spec.paths as Record<string, unknown>)) {
    if (!item || typeof item !== 'object') continue;
    const pathItem = item as JsonObject;
    checkReqs(`openapi.json path ${p}`, pathItem.security);
    for (const method of HTTP_METHODS) {
      const op = pathItem[method];
      if (!op || typeof op !== 'object') continue;
      const operation = op as JsonObject;
      checkReqs(
        `openapi.json ${method.toUpperCase()} ${p}`,
        operation.security,
      );
    }
  }
}

async function checkOpenApiDocs(): Promise<void> {
  const openApiPath = path.resolve(process.cwd(), 'openapi.json');
  const raw = await fs.readFile(openApiPath, 'utf-8');
  const spec = JSON.parse(raw) as JsonObject;
  const errors: string[] = [];
  collectOpenApiSecurityErrors(spec, errors);
  collectOpenApiTextErrors(spec, errors);
  if (errors.length > 0) {
    for (const e of errors) console.error(e);
    throw new Error(
      `OpenAPI docs checks failed (${errors.length} issue(s)). See ${openApiPath}`,
    );
  }
  console.log('OpenAPI docs checks passed.');
}

async function readFromPath(file: string) {
  const content = await fs
    .readFile(path.resolve(file))
    .then((res) => res.toString());
  const parsed = matter(content);

  return {
    path: file,
    data: parsed.data,
    content: parsed.content,
  };
}

function remarkIncludeId() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any, file: { data: Record<string, unknown> }) => {
    (file.data.ids as string[]) ??= [];
    visit(tree, 'mdxJsxFlowElement', (element) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const elem = element as any;
      if (!elem.name || !elem.attributes) return;

      const attributes = elem.attributes;
      const idAttr = attributes.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (attr: any) => attr.type === 'mdxJsxAttribute' && attr.name === 'id',
      );

      if (idAttr) {
        (file.data.ids as string[]).push(String(idAttr.value));
      }
    });
  };
}

const processor = remark()
  .use(remarkMdx)
  .use(remarkInclude)
  .use(remarkIncludeId)
  .use(remarkHeading);

async function getHeadings(path: string, content: string) {
  const ids: string[] = [];
  const result = await processor.process({
    path,
    value: content,
  });

  if ('toc' in result.data)
    ids.push(
      ...(result.data.toc as TOCItemType[]).map((item) => item.url.slice(1)),
    );

  if ('ids' in result.data) ids.push(...(result.data.ids as string[]));

  return ids;
}

async function checkLinks() {
  const docsFiles = await Promise.all(
    await glob('content/docs/**/*.mdx').then((files) =>
      files.map(readFromPath),
    ),
  );

  const docs = docsFiles.map(async (file) => {
    const relativePath = path.relative('content/docs', file.path);

    return {
      value: getSlugs(relativePath),
      hashes: await getHeadings(file.path, file.content),
    };
  });

  const scanned = await scanURLs({
    populate: {
      '(docs)/[[...slug]]': await Promise.all(docs),
    },
  });

  console.log(
    `collected ${scanned.urls.size} URLs, ${scanned.fallbackUrls.length} fallbacks`,
  );

  const getUrl = createGetUrl('/');
  printErrors(
    await validateFiles(docsFiles, {
      scanned,

      pathToUrl(value) {
        const relativePath = path.relative('content/docs', value);
        return getUrl(getSlugs(relativePath));
      },
      whitelist: (url) => url.startsWith('/api'),
    }),
    true,
  );
}

async function main() {
  await checkOpenApiDocs();
  await checkLinks();
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
