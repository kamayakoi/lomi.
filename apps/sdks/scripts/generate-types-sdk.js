#!/usr/bin/env node
/**
 * Public merchant SDK generator
 *
 * Emits typed service classes from apps/docs/openapi.json filtered by the strict allowlist:
 * apps/docs/lib/scripts/manual-api/_expected-public-operations.json
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync,
} from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  HTTP_WITH_BODY,
  DEFAULT_OPENAPI_PATH,
  DEFAULT_ALLOWLIST_PATH,
  sdkPropertyName,
  pathIds,
  flattenParams,
  wantsBody,
  readSpecAndAllowlist,
  getNormalizedOperations,
} from './public-sdk-operations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apiTypesPath = join(__dirname, '../api-types.ts');
const openapiPath = DEFAULT_OPENAPI_PATH;
const allowlistPath = DEFAULT_ALLOWLIST_PATH;
const outputDir = join(__dirname, '../ts/src/generated');

function buildMethodSource(httpMethod, pathTpl, op, methodName, spec) {
  /** @type {Record<string, unknown>} */
  const pathItem = spec.paths[pathTpl];
  if (!pathItem || typeof pathItem !== 'object') {
    throw new Error(`OpenAPI paths missing "${pathTpl}"`);
  }

  const ids = pathIds(pathTpl);
  const qParams = flattenParams(spec, pathItem, op).filter(
    /** @param {any} q */
    (q) => q.in === 'query',
  );
  const useBody = wantsBody(httpMethod, op);

  const argParts = ids.map((id) => `${id}: string`);

  if (httpMethod === 'get' && qParams.length > 0) {
    argParts.push('options?: Record<string, unknown>');
  }
  if (useBody) {
    argParts.push('body?: unknown');
  }

  const args = argParts.join(', ');

  const reqLines = [
    `        return await request<any>({`,
    `            method: '${httpMethod.toUpperCase()}',`,
    `            url: '${pathTpl}',`,
  ];
  if (ids.length) {
    reqLines.push(
      `            path: { ${ids.map((id) => `${id}: ${id}`).join(', ')} },`,
    );
  }
  if (httpMethod === 'get' && qParams.length) {
    reqLines.push('            query: options,');
  }
  if (useBody) {
    reqLines.push('            body,');
  }
  reqLines.push(`        });`);

  const desc = [];
  desc.push('    /**');
  desc.push(`     * OpenAPI operationId: \`${String(op.operationId ?? methodName)}\`.`);
  if (op.summary) {
    desc.push(`     * ${String(op.summary).replace(/\*\//g, '')}`);
  }
  desc.push('     */');

  return [
    ...desc,
    `    public static async ${methodName}(${args}): Promise<any> {`,
    ...reqLines,
    `    }`,
  ].join('\n');
}

function generateTypesFile(apiTypesContent) {
  return `/**
 * API Types
 * AUTO-GENERATED - Do not edit manually
 *
 * Re-exports Database types copied from apps/api — used for optional typings in apps that need them.
 */

${apiTypesContent}
`;
}

function generateOpenAPIFile() {
  return `/**
 * OpenAPI Configuration
 * AUTO-GENERATED - Do not edit manually
 */

export type OpenAPIConfig = {
    BASE: string;
    VERSION: string;
    WITH_CREDENTIALS: boolean;
    CREDENTIALS: 'include' | 'omit' | 'same-origin';
    TOKEN?: string | ((options: { url: string; method: string }) => Promise<string>);
    USERNAME?: string;
    PASSWORD?: string;
    HEADERS?: Record<string, string>;
    ENCODE_PATH?: (path: string) => string;
};

export const OpenAPI: OpenAPIConfig = {
    BASE: 'https://api.lomi.africa',
    VERSION: '1',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'include',
    TOKEN: undefined,
    USERNAME: undefined,
    PASSWORD: undefined,
    HEADERS: undefined,
    ENCODE_PATH: undefined,
};
`;
}

/** Inline request helper (avoid temp file complexity) */
function requestHelperSource() {
  return `/**
 * HTTP Request Helper
 * AUTO-GENERATED - Do not edit manually
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { OpenAPI } from './OpenAPI.js';

export type ApiRequestOptions = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    path?: Record<string, string | number>;
    query?: Record<string, any>;
    body?: any;
    headers?: Record<string, string>;
};

export class ApiError extends Error {
    public readonly url: string;
    public readonly status: number;
    public readonly statusText: string;
    public readonly body: any;

    constructor(response: AxiosResponse, message: string) {
        super(message);
        this.url = response.config.url || '';
        this.status = response.status;
        this.statusText = response.statusText;
        this.body = response.data;
    }
}

function getUrl(options: ApiRequestOptions): string {
    let url = \`\${OpenAPI.BASE}\${options.url}\`;
    if (options.path) {
        for (const [key, value] of Object.entries(options.path)) {
            url = url.replace(\`{\${key}}\`, String(value));
        }
    }
    return url;
}

function getHeaders(options: ApiRequestOptions): Record<string, string> {
    return {
        'Content-Type': 'application/json',
        ...OpenAPI.HEADERS,
        ...options.headers,
    };
}

export async function request<T>(options: ApiRequestOptions): Promise<T> {
    const url = getUrl(options);
    const headers = getHeaders(options);

    const config: AxiosRequestConfig = {
        method: options.method,
        url,
        headers,
        params: options.query,
        data: options.body,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new ApiError(error.response, error.message);
        }
        throw error;
    }
}
`;
}

function generateServiceClass(serviceName, methods) {
  const sorted = [...methods].sort((a, b) =>
    a.methodName.localeCompare(b.methodName),
  );
  const blocks = sorted.map((m) => m.source).join('\n\n');
  return `/**
 * ${serviceName}
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import { request } from '../core/request.js';

export class ${serviceName} {
${blocks}
}
`;
}

function generateIndex(servicesSorted) {
  const lines = servicesSorted.map(
    (name) =>
      `export { ${name} } from './services/${name}.js';`,
  );
  return `/**
 * Generated SDK exports
 * AUTO-GENERATED — public merchant surface
 */

export { OpenAPI } from './core/OpenAPI.js';
export type { OpenAPIConfig } from './core/OpenAPI.js';
export { request, ApiError } from './core/request.js';
export type { ApiRequestOptions } from './core/request.js';

export * from './types.js';

${lines.join('\n')}
`;
}

function main() {
  console.log('OpenAPI-filtered merchant SDK generation…');

  const { spec, allowed } = readSpecAndAllowlist(openapiPath, allowlistPath);
  const apiTypesContent = readFileSync(apiTypesPath, 'utf-8');

  const { byService } = getNormalizedOperations(spec, allowed);

  /** @type {Map<string, { methodName: string; source: string }[]>} */
  const groups = new Map();

  for (const [serviceName, ops] of byService) {
    for (const nop of ops) {
      const source = buildMethodSource(
        nop.httpMethodLower,
        nop.pathTemplate,
        nop.openApiOp,
        nop.sdkMethodName,
        spec,
      );
      const list = groups.get(serviceName) ?? [];
      list.push({ methodName: nop.sdkMethodName, source });
      groups.set(serviceName, list);
    }
  }

  if (existsSync(outputDir)) {
    rmSync(outputDir, { recursive: true });
  }
  mkdirSync(join(outputDir, 'core'), { recursive: true });
  mkdirSync(join(outputDir, 'services'), { recursive: true });

  writeFileSync(join(outputDir, 'types.ts'), generateTypesFile(apiTypesContent));
  writeFileSync(join(outputDir, 'core/OpenAPI.ts'), generateOpenAPIFile());
  writeFileSync(join(outputDir, 'core/request.ts'), requestHelperSource());

  const manifest = {};

  const serviceNamesSorted = [...groups.keys()].sort((a, b) => a.localeCompare(b));

  for (const serviceName of serviceNamesSorted) {
    const cls = generateServiceClass(serviceName, groups.get(serviceName));
    writeFileSync(join(outputDir, `services/${serviceName}.ts`), cls);
    const propKey = sdkPropertyName(serviceName);
    manifest[propKey] = [...groups.get(serviceName)]
      .map((m) => m.methodName)
      .sort();
    console.log(`   ${serviceName}`);
  }

  writeFileSync(
    join(outputDir, 'index.ts'),
    generateIndex(serviceNamesSorted),
  );

  writeFileSync(
    join(outputDir, 'sdk-public-methods.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), sdk: manifest }, null, 2)}\n`,
  );

  console.log(`\nMerchant SDK OK — ${allowed.length} operations, ${serviceNamesSorted.length} services.`);
}

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}

export { main as generateTypesSDK };
