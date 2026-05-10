/**
 * Generates src/generated/tools-manifest.json from apps/docs/openapi.json
 * and the public merchant operation allowlist (same contract as SDKs).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  type OpenAPISpec,
  buildInputJsonSchema,
  toolNameFromOperation,
} from '../src/generator/openapi-helpers.ts';
import { validateManifestToolEntry } from './validate-manifest-entry.ts';
import {
  readSpecAndAllowlist,
  getNormalizedOperations,
  HTTP_WITH_BODY,
} from '../../sdks/scripts/public-sdk-operations.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mcpRoot = join(__dirname, '..');
const openapiPath = join(mcpRoot, '../docs/openapi.json');
const allowlistPath = join(
  mcpRoot,
  '../docs/lib/scripts/manual-api/_expected-public-operations.json',
);
const outDir = join(mcpRoot, 'src/generated');
const outFile = join(outDir, 'tools-manifest.json');

const WRITE_METHODS = new Set(['post', 'patch', 'put', 'delete']);

function assertUniqueToolNames(names: string[]): void {
  const seen = new Set<string>();
  for (const n of names) {
    if (seen.has(n)) throw new Error(`Duplicate MCP tool name: ${n}`);
    seen.add(n);
  }
}

function main(): void {
  const { spec, allowed } = readSpecAndAllowlist(openapiPath, allowlistPath);
  const apiSpec = spec as OpenAPISpec;
  const { operations } = getNormalizedOperations(spec, allowed);

  const tools = operations.map((op) => {
    const name = toolNameFromOperation(op.httpMethodLower, op.pathTemplate);

    const write = WRITE_METHODS.has(op.httpMethodLower);
    const wantsBody =
      HTTP_WITH_BODY.has(op.httpMethodLower) &&
      Boolean(op.openApiOp.requestBody);

    const inputSchema = buildInputJsonSchema({
      spec: apiSpec,
      operation: op.openApiOp,
      pathItem: op.pathItem,
      pathTemplate: op.pathTemplate,
      httpMethodLower: op.httpMethodLower,
      includeIdempotencyKey: write,
    });

    const descriptionParts = [
      op.summary?.trim(),
      op.openApiOp.description?.trim(),
      `REST: ${op.operationKey}`,
    ].filter(Boolean);

    return {
      name,
      operationKey: op.operationKey,
      method: op.httpMethodLower,
      pathTemplate: op.pathTemplate,
      pathParamNames: op.pathParamNames,
      queryParamNames: op.queryParams.map((q) => q.name),
      title: op.summary?.trim() ?? op.operationKey,
      description: descriptionParts.join('\n\n'),
      tags: op.openApiOp.tags ?? [],
      operationId: op.operationId,
      write,
      wantsBody,
      inputSchema,
    };
  });

  for (const t of tools) {
    validateManifestToolEntry(t);
  }

  tools.sort((a, b) => a.name.localeCompare(b.name));
  assertUniqueToolNames(tools.map((t) => t.name));

  const manifest = {
    manifestVersion: 1 as const,
    apiVersion: apiSpec.info?.version ?? 'unknown',
    apiTitle: apiSpec.info?.title ?? 'lomi. API',
    toolCount: tools.length,
    tools,
  };

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');
  console.log(`Wrote ${outFile} (${tools.length} tools)`);
}

main();
