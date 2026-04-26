/* @proprietary license */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createOpenAPI } from 'fumadocs-openapi/server';
import type {
  Document,
  OperationObject,
  ParameterObject,
  PathItemObject,
  ReferenceObject,
} from 'fumadocs-openapi';

const OPENAPI_DOCUMENT_ID = './openapi.json';
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

function getPathParamNames(route: string): string[] {
  const names = new Set<string>();
  const matcher = /\{([^}]+)\}/g;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(route)) !== null) {
    const name = match[1]?.trim();
    if (name) names.add(name);
  }

  return [...names];
}

function matchesPathParam(
  parameter: ParameterObject | ReferenceObject,
  name: string,
): boolean {
  if (!parameter || '$ref' in parameter) return false;
  return parameter.in === 'path' && parameter.name === name;
}

function ensurePathParameters(document: Document): Document {
  if (!document.paths) return document;

  for (const [route, pathItem] of Object.entries(document.paths)) {
    if (!pathItem) continue;

    const pathParamNames = getPathParamNames(route);
    if (pathParamNames.length === 0) continue;

    const item = pathItem as PathItemObject;

    for (const method of HTTP_METHODS) {
      const operation = item[method] as OperationObject | undefined;
      if (!operation) continue;

      const operationParameters = Array.isArray(operation.parameters)
        ? operation.parameters
        : [];

      for (const pathParamName of pathParamNames) {
        const exists = operationParameters.some((parameter) =>
          matchesPathParam(parameter, pathParamName),
        );

        if (exists) continue;

        operationParameters.push({
          in: 'path',
          name: pathParamName,
          required: true,
          schema: { type: 'string' },
          description: `Path parameter: ${pathParamName}`,
        } satisfies ParameterObject);
      }

      operation.parameters = operationParameters;
    }
  }

  return document;
}

function normalizeSecuritySchemes(document: Document): Document {
  const schemes = document.components?.securitySchemes;
  if (!schemes) return document;

  if (schemes['X-API-KEY'] && !schemes['api-key']) {
    schemes['api-key'] = schemes['X-API-KEY'];
  }

  return document;
}

async function loadOpenApiDocument(): Promise<Document> {
  const absolutePath = path.resolve(process.cwd(), 'openapi.json');
  const raw = await readFile(absolutePath, 'utf-8');
  return JSON.parse(raw) as Document;
}

/** Relative to `apps/docs` cwd so generated MDX `document=` keys stay portable. */
export const openapi = createOpenAPI({
  input: async () => {
    const document = await loadOpenApiDocument();
    return {
      [OPENAPI_DOCUMENT_ID]: normalizeSecuritySchemes(
        ensurePathParameters(document),
      ),
    };
  },
  proxyUrl: '/api/proxy',
});
