/* @proprietary license */

type ReferenceObject = { $ref: string };

type ComponentsObject = {
  schemas?: Record<string, SchemaObject | ReferenceObject>;
};

type ParameterObject = {
  name?: string;
  in?: string;
  required?: boolean;
  description?: string;
  schema?: ReferenceObject | Record<string, unknown>;
};

type ResponseObject = {
  description?: string;
};

type OperationObject = {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: (ParameterObject | ReferenceObject)[];
  responses?: Record<string, ResponseObject | ReferenceObject>;
  requestBody?:
    | ReferenceObject
    | {
        description?: string;
        content?: Record<
          string,
          { schema?: ReferenceObject | Record<string, unknown> }
        >;
      };
};

type SchemaObject = {
  type?: string;
  description?: string;
  enum?: unknown[];
  properties?: Record<string, SchemaObject | ReferenceObject>;
  required?: string[];
  items?: SchemaObject | ReferenceObject;
  example?: unknown;
};

type PathItemObject = {
  parameters?: (ParameterObject | ReferenceObject)[];
} & Record<string, OperationObject | (ParameterObject | ReferenceObject)[] | undefined>;

const HTTP_OPS = ['get', 'post', 'put', 'patch', 'delete'] as const;

/** Avoid MDX `{}` JSX interpretation in free text. */
function escapeMdxText(s: string | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

function isRef(o: unknown): o is ReferenceObject {
  return Boolean(o && typeof o === 'object' && '$ref' in (o as object));
}

function isSchemaObject(
  schema: SchemaObject | ReferenceObject | undefined,
): schema is SchemaObject {
  return Boolean(schema && typeof schema === 'object' && !isRef(schema));
}

function getSchemaNameFromRef(ref: string): string {
  const parts = ref.split('/');
  return parts[parts.length - 1] ?? ref;
}

function resolveSchema(
  schema: SchemaObject | ReferenceObject | undefined,
  components: ComponentsObject | undefined,
): SchemaObject | undefined {
  if (!schema) return undefined;
  if (isSchemaObject(schema)) return schema;
  const name = getSchemaNameFromRef(schema.$ref);
  const fromComponents = components?.schemas?.[name];
  if (!fromComponents || isRef(fromComponents)) return undefined;
  return fromComponents;
}

function schemaTypeLabel(
  schema: SchemaObject | ReferenceObject | undefined,
  components: ComponentsObject | undefined,
): string {
  if (!schema) return 'object';
  if (isRef(schema)) return getSchemaNameFromRef(schema.$ref);
  if (schema.enum?.length) {
    const values = schema.enum.slice(0, 3).map((v) => JSON.stringify(v)).join(', ');
    return `enum (${values}${schema.enum.length > 3 ? ', ...' : ''})`;
  }
  if (schema.type === 'array') {
    return `array<${schemaTypeLabel(schema.items, components)}>`;
  }
  if (schema.type) return schema.type;
  const resolved = resolveSchema(schema, components);
  if (resolved?.type) return resolved.type;
  return 'object';
}

function toSampleValue(
  schema: SchemaObject | ReferenceObject | undefined,
  components: ComponentsObject | undefined,
  depth = 0,
): unknown {
  if (!schema) return 'value';
  if (depth > 3) return '...';
  if (isRef(schema)) {
    return toSampleValue(resolveSchema(schema, components), components, depth + 1);
  }
  if (schema.example !== undefined) return schema.example;
  if (schema.enum && schema.enum.length > 0) return schema.enum[0];
  if (schema.type === 'string') return 'string';
  if (schema.type === 'number' || schema.type === 'integer') return 0;
  if (schema.type === 'boolean') return true;
  if (schema.type === 'array') {
    return [toSampleValue(schema.items, components, depth + 1)];
  }
  if (schema.type === 'object' || schema.properties) {
    const out: Record<string, unknown> = {};
    const properties = schema.properties ?? {};
    const required = new Set(schema.required ?? []);
    const keys = Object.keys(properties);
    const chosen =
      required.size > 0 ? [...required].filter((k) => k in properties) : keys.slice(0, 3);
    for (const key of chosen) {
      out[key] = toSampleValue(properties[key], components, depth + 1);
    }
    return out;
  }
  return 'value';
}

function paramRow(p: ParameterObject | ReferenceObject): string {
  if ('$ref' in p || !('in' in p)) return '';
  const required = 'required' in p && p.required ? 'Yes' : 'No';
  const schema =
    'schema' in p && p.schema && typeof p.schema === 'object' && '$ref' in p.schema
      ? ((p.schema as ReferenceObject).$ref ?? '').split('/').pop() ?? ''
      : '';
  const desc = 'description' in p && typeof p.description === 'string'
    ? escapeMdxText(p.description)
    : '';
  const nameCell = '`' + (p.name ?? '') + '`';
  const schemaCell = schema ? `\`${schema}\`` : '—';
  return `| ${nameCell} | ${String(p.in)} | ${required} | ${schemaCell} | ${desc} |`;
}

function parameterSampleValue(p: ParameterObject): string {
  const schema = p.schema;
  if (schema && typeof schema === 'object' && !isRef(schema)) {
    if (Array.isArray(schema.enum) && schema.enum.length > 0) {
      return String(schema.enum[0]);
    }
    if (schema.type === 'number' || schema.type === 'integer') return '1';
    if (schema.type === 'boolean') return 'true';
  }
  return 'value';
}

function responseRows(
  responses: OperationObject['responses'] | undefined,
): string[] {
  if (!responses) return [];
  const rows: string[] = [];
  for (const [code, res] of Object.entries(responses)) {
    let desc = '';
    if (!isRef(res) && typeof res === 'object' && res !== null && 'description' in res) {
      desc = escapeMdxText((res as ResponseObject).description ?? '');
    }
    rows.push(`| \`${code}\` | ${desc || '—'} |`);
  }
  return rows;
}

function buildRequestBodySection(
  operation: OperationObject,
  components: ComponentsObject | undefined,
): { section: string; sampleBody: unknown | null } {
  const rb = operation.requestBody;
  if (!rb || isRef(rb)) {
    return {
      sampleBody: null,
      section: [
        '### Request body',
        '',
        '_No application/json body for this operation._',
        '',
      ].join('\n'),
    };
  }

  const desc =
    'description' in rb && typeof rb.description === 'string'
      ? escapeMdxText(rb.description)
      : '';
  const jsonContent = rb.content?.['application/json'];
  const rawSchema = jsonContent?.schema as
    | SchemaObject
    | ReferenceObject
    | undefined;
  const resolvedSchema = resolveSchema(rawSchema, components);

  const schemaLabel = rawSchema
    ? `\`${schemaTypeLabel(rawSchema, components)}\``
    : '`object`';

  const lines = ['### Request body', '', desc || 'JSON request payload.', '', `Schema: ${schemaLabel}`, ''];

  if (resolvedSchema?.properties) {
    lines.push('| Field | Required | Type | Description |');
    lines.push('| --- | --- | --- | --- |');
    const required = new Set(resolvedSchema.required ?? []);
    for (const [field, fieldSchema] of Object.entries(resolvedSchema.properties)) {
      const fieldType = schemaTypeLabel(fieldSchema, components);
      const fieldDesc = isSchemaObject(fieldSchema)
        ? escapeMdxText(fieldSchema.description)
        : '';
      lines.push(
        `| \`${field}\` | ${required.has(field) ? 'Yes' : 'No'} | \`${fieldType}\` | ${fieldDesc || '—'} |`,
      );
    }
    lines.push('');
  }

  const sampleBody = toSampleValue(rawSchema ?? resolvedSchema, components);
  if (sampleBody && typeof sampleBody === 'object') {
    lines.push('Example body:');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(sampleBody, null, 2));
    lines.push('```');
    lines.push('');
  }

  return { section: lines.join('\n'), sampleBody };
}

type PathParamsInput = {
  parameters?: (ParameterObject | ReferenceObject)[];
};

export function renderOperationPageMdx(input: {
  method: string;
  path: string;
  operationId: string;
  operation: OperationObject;
  pathItem?: PathParamsInput;
  components?: ComponentsObject;
}): string {
  const { method, path, operationId, operation, pathItem, components } = input;
  const mLower = method.toLowerCase();
  const titleSource = operation.summary ?? operationId;
  const description = operation.description
    ? `\n\n${escapeMdxText(operation.description)}\n`
    : '';

  const servers = ['https://sandbox.api.lomi.africa', 'https://api.lomi.africa'];
  const endpointLine = `\`${method.toUpperCase()} ${path}\``;

  const pathLevelParams =
    pathItem?.parameters?.filter((p): p is ParameterObject => !isRef(p) && 'in' in p) ??
    [];

  const opParams = [...pathLevelParams];
  if (Array.isArray(operation.parameters)) {
    for (const p of operation.parameters) {
      if (!isRef(p) && 'in' in p) opParams.push(p);
    }
  }

  const pathParams = opParams.filter((p) => p.in === 'path');
  const queryParams = opParams.filter((p) => p.in === 'query');
  const headerParams = opParams.filter((p) => p.in === 'header');

  const pathTable =
    pathParams.length === 0
      ? '_No path parameters beyond the URL pattern._\n'
      : ['| Name | Required | Schema | Description |', '| --- | --- | --- | --- |']
          .concat(
            pathParams.map((p) => {
              const req = p.required ? 'Yes' : 'No';
              const schema =
                'schema' in p && p.schema && typeof p.schema === 'object' && '$ref' in p.schema
                  ? ((p.schema as ReferenceObject).$ref ?? '').split('/').pop() ?? ''
                  : '';
              const desc =
                'description' in p && typeof p.description === 'string'
                  ? escapeMdxText(p.description)
                  : '';
              return `| \`${p.name}\` | ${req} | ${schema ? `\`${schema}\`` : '—'} | ${desc} |`;
            }),
          )
          .join('\n');

  const queryTable =
    queryParams.length === 0
      ? '_No query parameters._\n'
      : ['| Name | In | Required | Schema | Description |', '| --- | --- | --- | --- | --- |']
          .concat(queryParams.map((p) => paramRow(p)).filter(Boolean))
          .join('\n');

  const headerTable =
    headerParams.length === 0
      ? ''
      : [
          '### Headers',
          '',
          '| Name | In | Required | Schema | Description |',
          '| --- | --- | --- | --- | --- |',
          ...headerParams.map((p) => paramRow(p)).filter(Boolean),
          '',
        ].join('\n');

  const shouldHaveBody = mLower === 'post' || mLower === 'put' || mLower === 'patch';
  const requestBody = shouldHaveBody
    ? buildRequestBodySection(operation, components)
    : { section: '', sampleBody: null };
  const bodySection = requestBody.section;

  const responseTable =
    responseRows(operation.responses).length === 0
      ? '_See OpenAPI responses for this operation._\n'
      : ['| Status | Description |', '| --- | --- |', ...responseRows(operation.responses)].join(
          '\n',
        );

  const yamlTitle = JSON.stringify(operation.summary ?? operationId);
  const yamlDescription = JSON.stringify(
    operation.summary ??
      `${method.toUpperCase()} ${path} — see REST API reference`,
  );

  const pathSample = new Map(
    pathParams.map((p) => [p.name ?? '', parameterSampleValue(p)]),
  );
  const urlPath = path.replace(
    /\{([^}]+)\}/g,
    (_all, name: string) => pathSample.get(name) ?? `${name}_value`,
  );
  const queryExample = queryParams
    .slice(0, 2)
    .map((p) => `${encodeURIComponent(p.name ?? 'param')}=${parameterSampleValue(p)}`)
    .join('&');
  const fullPath = queryExample ? `${urlPath}?${queryExample}` : urlPath;

  const curlLines = [
    `curl -sS -X ${method.toUpperCase()} "${servers[0]}${fullPath}"`,
    `  -H "X-API-KEY: $LOMI_API_KEY"`,
    shouldHaveBody ? `  -H "Content-Type: application/json"` : '',
    shouldHaveBody
      ? `  -d '${JSON.stringify(
          requestBody.sampleBody && typeof requestBody.sampleBody === 'object'
            ? requestBody.sampleBody
            : {},
        )}'`
      : '',
  ].filter(Boolean);

  const curlExample = [
    '```bash',
    ...curlLines.map((line, idx) =>
      idx < curlLines.length - 1 ? `${line} \\` : line,
    ),
    '```',
  ]
    .filter(Boolean)
    .join('\n');

  return `---
title: ${yamlTitle}
description: ${yamlDescription}
full: true
method: ${method.toLowerCase()}
path: ${path}
operationId: ${operationId}
---

## Overview

${escapeMdxText(operation.summary ?? titleSource)}${description}

## Authentication

Merchant routes require an API key in the \`X-API-KEY\` header (see [Integration overview](/reference/setup/overview)). Use a **test** key against \`${servers[0]}\` and a **live** key against \`${servers[1]}\`.

## Endpoint

${endpointLine}

Base URLs:

${servers.map((u) => `- \`${u}\``).join('\n')}

## Request

### Path parameters

${pathTable}

### Query parameters

${queryTable}
${headerTable ? '\n' + headerTable : ''}
${bodySection}

## Responses

${responseTable}

## Errors

Errors follow the standard JSON error format (status code and machine-readable message). Validate inputs before calling; **401** indicates a missing/invalid key, **404** a missing resource for this organization, **429** rate limiting. For safe retries on create-style calls, send an idempotency key when your flow supports it.

## Example

${curlExample}

## OpenAPI

Manual reference pages are authored in \`apps/docs/content/docs/api/\`. After API changes, run **OpenAPI export** (\`apps/api\`) and regenerate pages with \`pnpm exec tsx lib/scripts/bootstrap-manual-api-reference.ts\` from \`apps/docs\`. The machine-readable contract stays in \`apps/docs/openapi.json\`. Operation id: \`${operationId}\`.
`;
}

export function collectPublicOperations(spec: {
  paths?: Record<string, PathItemObject>;
}): { method: string; path: string; operationId: string; operation: OperationObject }[] {
  const out: {
    method: string;
    path: string;
    operationId: string;
    operation: OperationObject;
  }[] = [];
  if (!spec.paths) return out;

  for (const [p, item] of Object.entries(spec.paths)) {
    if (!item) continue;
    for (const m of HTTP_OPS) {
      const op = item[m] as OperationObject | undefined;
      if (!op?.operationId) continue;
      out.push({ method: m, path: p, operationId: op.operationId, operation: op });
    }
  }
  return out;
}
