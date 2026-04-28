/* @proprietary license */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildRegistry } from '@/lib/scripts/build-registry';
import * as OpenAPI from 'fumadocs-openapi';
import { rimraf } from 'rimraf';
import { openapi } from '@/lib/openapi';
import { normalizeOpenApiSecurity } from '@/lib/openapi/security-normalize';
import type { Document } from 'fumadocs-openapi';

const OPENAPI_OUTPUT = './content/docs/api';
const LEGACY_OPENAPI_OUTPUT = './content/docs/openapi';
const API_SECTION_TITLE = 'REST API';
const API_SECTION_DESCRIPTION = 'Payment and commerce endpoints.';

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

async function normalizeOpenApiSecurityFile(): Promise<void> {
  const openApiPath = path.resolve(process.cwd(), 'openapi.json');
  if (!existsSync(openApiPath)) return;

  const raw = await readFile(openApiPath, 'utf-8');
  const spec = JSON.parse(raw) as Document;
  const normalized = normalizeOpenApiSecurity(spec);
  await writeFile(openApiPath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf-8');
}

function toSectionTitle(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function generateDocs() {
  exportOpenApiFromNest();
  await normalizeOpenApiSecurityFile();
  await rimraf(LEGACY_OPENAPI_OUTPUT);
  await rimraf(OPENAPI_OUTPUT);

  await OpenAPI.generateFiles({
    input: openapi,
    output: OPENAPI_OUTPUT,
    per: 'operation',
    groupBy: (entry) => {
      const parts = entry.item.path.split('/').filter(Boolean);
      return parts[0] ?? 'general';
    },
    includeDescription: true,
    beforeWrite(files) {
      const isAgentEntry = (entry: string): boolean => {
        const parts = entry.split('/').filter(Boolean);
        if (parts.length === 0) return false;

        const leaf = parts.at(-1) ?? '';
        return parts[0] === 'agent' || leaf.startsWith('Agent');
      };

      const nonAgentFiles = files.filter((file) => {
        if (!file.path.endsWith('.mdx')) return true;
        const entry = file.path.replace(/\.mdx$/, '');
        return !isAgentEntry(entry);
      });
      files.splice(0, files.length, ...nonAgentFiles);

      const withoutIndex = files.filter((file) => file.path !== 'index.mdx');
      files.splice(0, files.length, ...withoutIndex);

      const operationPaths = files
        .filter((f) => f.path.endsWith('.mdx'))
        .map((f) => f.path.replace(/\.mdx$/, ''))
        .filter((name) => !isAgentEntry(name));
      const fileByPath = new Map(files.map((file) => [file.path, file.content]));

      const sections = new Map<string, string[]>();
      const rootPages: string[] = [];

      for (const entry of operationPaths) {
        const [folder, ...rest] = entry.split('/');
        const hasFolder = Boolean(folder && rest.length > 0);

        if (!hasFolder) {
          rootPages.push(entry);
          continue;
        }

        const pages = sections.get(folder) ?? [];
        pages.push(rest.join('/'));
        sections.set(folder, pages);
      }

      const sortedSections = [...sections.entries()]
        .map(([section, pages]) => [section, pages.sort()] as const)
        .sort(([a], [b]) => a.localeCompare(b));

      for (const [section, pages] of sortedSections) {
        files.push({
          path: `${section}/meta.json`,
          content: `${JSON.stringify(
            {
              title: toSectionTitle(section),
              pages,
            },
            null,
            2,
          )}\n`,
        });
        rootPages.push(section);
      }

      // Keep backward-compatible flat operation routes (legacy bookmarks/links):
      // /api/PaymentLinksController_create
      // -> aliases /api/payment-links/PaymentLinksController_create
      const aliasNames = new Set<string>();
      for (const entry of operationPaths) {
        const [folder, ...rest] = entry.split('/');
        if (!folder || rest.length === 0) continue;

        const aliasName = rest.join('/');
        if (!aliasName || aliasName === 'index' || aliasNames.has(aliasName)) {
          continue;
        }

        const sourcePath = `${entry}.mdx`;
        const aliasPath = `${aliasName}.mdx`;
        const sourceContent = fileByPath.get(sourcePath);

        if (!sourceContent || fileByPath.has(aliasPath)) continue;

        files.push({
          path: aliasPath,
          content: sourceContent,
        });
        aliasNames.add(aliasName);
      }

      const uniqueRootPages = [...new Set(rootPages)];
      const sortedRootPages = uniqueRootPages.sort();

      files.push({
        path: 'meta.json',
        content: `${JSON.stringify(
          {
            title: API_SECTION_TITLE,
            description: API_SECTION_DESCRIPTION,
            root: true,
            icon: 'BookOpen',
            pages: sortedRootPages,
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
