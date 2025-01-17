import { parse } from 'yaml';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const OPENAPI_PATH = join(process.cwd(), 'openapi', 'spec.yaml');
const OUTPUT_DIR = join(process.cwd(), 'src', 'client');

interface PathItem {
  get?: OperationObject;
  post?: OperationObject;
  put?: OperationObject;
  delete?: OperationObject;
  patch?: OperationObject;
}

interface OperationObject {
  summary?: string;
  description?: string;
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses: { [key: string]: ResponseObject };
  security?: SecurityRequirementObject[];
}

interface ParameterObject {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required?: boolean;
  schema?: SchemaObject;
}

interface RequestBodyObject {
  content: {
    [key: string]: {
      schema: SchemaObject;
    };
  };
}

interface ResponseObject {
  description: string;
  content?: {
    [key: string]: {
      schema: SchemaObject;
    };
  };
}

interface SchemaObject {
  $ref?: string;
  type?: string;
  items?: SchemaObject;
  properties?: { [key: string]: SchemaObject };
  required?: string[];
}

interface SecurityRequirementObject {
  [key: string]: string[];
}

interface OpenAPISpec {
  paths: { [key: string]: PathItem };
  components?: {
    schemas?: { [key: string]: SchemaObject };
  };
}

async function generateClient(): Promise<void> {
  try {
    // Create output directory if it doesn't exist
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Create core directory
    const coreDir = join(OUTPUT_DIR, 'core');
    if (!existsSync(coreDir)) {
      mkdirSync(coreDir, { recursive: true });
    }

    // Read and parse OpenAPI spec
    const yamlContent = readFileSync(OPENAPI_PATH, 'utf8');
    const spec = parse(yamlContent) as OpenAPISpec;

    // Generate core files
    generateBaseClient();
    generateApiError();

    // Generate API client classes
    generateApiClients(spec.paths);

    // Generate request/response types
    generateTypes();

    console.log('✅ Successfully generated API client');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error generating client:', error.message);
    } else {
      console.error('❌ Error generating client:', String(error));
    }
    process.exit(1);
  }
}

function generateBaseClient(): void {
  const content = `import { ApiError } from './core/ApiError';
import { ApiRequestOptions } from './core/ApiRequestOptions';
import { ApiResult } from './core/ApiResult';

export class BaseClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  protected async request<T>(options: ApiRequestOptions): Promise<ApiResult<T>> {
    const { method, path, params, data } = options;
    
    // First replace path parameters
    let resolvedPath = path;
    const queryParams: Record<string, string> = {};
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          const placeholder = \`{\${key}}\`;
          if (resolvedPath.includes(placeholder)) {
            resolvedPath = resolvedPath.replace(placeholder, String(value));
          } else {
            queryParams[key] = String(value);
          }
        }
      });
    }

    const url = new URL(resolvedPath, this.baseUrl);
    
    // Add remaining params as query parameters
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['X-API-KEY'] = this.apiKey;
    }

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new ApiError(response.status, await response.json());
      }

      if (response.status === 204) {
        return new ApiResult<T>(response.status, undefined as T);
      }

      const responseData = await response.json() as T;
      return new ApiResult(response.status, responseData);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, { message: 'Network error' });
    }
  }
}`;

  writeFileSync(join(OUTPUT_DIR, 'BaseClient.ts'), content);
}

function generateApiError(): void {
  // Generate ErrorBody interface
  const errorBodyContent = `export interface ErrorBody {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}`;
  writeFileSync(join(OUTPUT_DIR, 'core', 'ErrorBody.ts'), errorBodyContent);

  // Generate ApiError class with import
  const apiErrorContent = `import { ErrorBody } from './ErrorBody';

export class ApiError extends Error {
  constructor(public status: number, public body: ErrorBody) {
    super(\`API Error \${status}: \${JSON.stringify(body)}\`);
    this.name = 'ApiError';
  }
}`;

  writeFileSync(join(OUTPUT_DIR, 'core', 'ApiError.ts'), apiErrorContent);
}

function generateApiClients(paths: { [key: string]: PathItem }): void {
  // Group endpoints by tag/resource
  const resources = new Map<string, { path: string; method: string; operation: OperationObject }[]>();

  Object.entries(paths).forEach(([path, pathItem]) => {
    Object.entries(pathItem as Record<string, unknown>).forEach(([method, operation]) => {
      if (method === 'parameters') return;
      if (!isOperationObject(operation)) return;

      const resourceName = getResourceFromPath(path);
      if (!resources.has(resourceName)) {
        resources.set(resourceName, []);
      }
      resources.get(resourceName)?.push({ path, method, operation });
    });
  });

  // Generate a client class for each resource
  resources.forEach((endpoints, resourceName) => {
    const className = getClientClassName(resourceName);
    const content = generateResourceClient(className, endpoints);
    writeFileSync(join(OUTPUT_DIR, `${className}.ts`), content);
  });

  // Generate index file
  generateIndex(Array.from(resources.keys()));
}

function isOperationObject(obj: unknown): obj is OperationObject {
  return typeof obj === 'object' && obj !== null && 'responses' in obj;
}

function getClientClassName(resource: string): string {
  // Already in PascalCase, just append Client
  return `${resource}Client`;
}

function generateResourceClient(
  className: string,
  endpoints: { path: string; method: string; operation: OperationObject }[]
): string {
  // Track used method names to avoid duplicates
  const usedMethodNames = new Set<string>();

  const methods = endpoints.map(({ path, method, operation }) => {
    let methodName = getMethodName(path, method);
    
    // If method name is already used, make it unique
    if (usedMethodNames.has(methodName)) {
      const resourcePart = path.split('/').filter(Boolean)[1] || '';
      methodName = `${methodName}${capitalize(resourcePart)}`;
    }
    usedMethodNames.add(methodName);

    const params = getMethodParameters(path, operation);
    const returnType = getReturnType(operation);
    const documentation = generateMethodDocumentation(operation);

    return `
  ${documentation}
  public async ${methodName}(${params}): Promise<ApiResult<${returnType}>> {
    return this.request({
      method: '${method.toUpperCase()}',
      path: '${path}',
      ${getRequestOptions(path, operation)}
    });
  }`;
  });

  // Check if any endpoint uses Types
  const usesTypes = endpoints.some(({ operation }) => {
    const returnType = getReturnType(operation);
    return returnType.startsWith('Types.');
  });

  return `import { BaseClient } from './BaseClient';
import { ApiResult } from './core/ApiResult';${usesTypes ? '\nimport * as Types from \'../types/api\';' : ''}

export class ${className} extends BaseClient {
${methods.join('\n')}
}`;
}

function generateIndex(resources: string[]): string {
  const content = `${resources
    .map((resource) => {
      // Convert kebab-case to PascalCase for the client class name
      const clientName = getClientClassName(resource);
      return `export * from './${clientName}';`;
    })
    .join('\n')}
export * from './BaseClient';
export * from './core/ApiError';
export * from './core/ApiResult';
export * from './core/ApiRequestOptions';`;

  writeFileSync(join(OUTPUT_DIR, 'index.ts'), content);
  return content;
}

function generateTypes(): void {
  // Generate core types
  const types: Record<string, string> = {
    ApiError: `import { ErrorBody } from './ErrorBody';

export class ApiError extends Error {
  constructor(public status: number, public body: ErrorBody) {
    super(\`API Error \${status}: \${JSON.stringify(body)}\`);
    this.name = 'ApiError';
  }
}`,
    ApiResult: `export class ApiResult<T> {
  constructor(public status: number, public data: T) {}
}`,
    ApiRequestOptions: `export interface ApiRequestOptions {
  method: string;
  path: string;
  params?: Record<string, string | number | boolean>;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
}`,
  };

  // Create core directory
  const coreDir = join(OUTPUT_DIR, 'core');
  if (!existsSync(coreDir)) {
    mkdirSync(coreDir, { recursive: true });
  }

  // Write core type files
  Object.entries(types).forEach(([name, content]) => {
    writeFileSync(join(coreDir, `${name}.ts`), content);
  });
}

function getResourceFromPath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  // Convert kebab-case to PascalCase
  return parts[0].split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getMethodName(path: string, method: string): string {
  const parts = path.split('/').filter(Boolean);
  
  if (method === 'get') {
    // If the path has a query parameter for ID, use 'get'
    if (parts.length === 1) return 'list';
    if (parts[parts.length - 1].includes('{')) return 'get';
    return 'list';
  }
  if (method === 'post') return 'create';
  if (method === 'put') return 'update';
  if (method === 'delete') return 'delete';
  if (method === 'patch') return 'patch';
  
  return method;
}

function getMethodParameters(path: string, operation: OperationObject): string {
  const params: string[] = [];
  
  // Path parameters
  const pathParams = operation.parameters?.filter(p => p.in === 'path') || [];
  pathParams.forEach(param => {
    params.push(`${param.name}: string`);
  });

  // Query parameters
  const queryParams = operation.parameters?.filter(p => p.in === 'query') || [];
  if (queryParams.length > 0) {
    params.push(`params?: { ${queryParams.map(p => `${p.name}${p.required ? '' : '?'}: string`).join(', ')} }`);
  }

  // Request body
  if (operation.requestBody) {
    const schema = operation.requestBody.content['application/json'].schema;
    const type = getSchemaType(schema);
    params.push(`data: ${type}`);
  }

  return params.join(', ');
}

function getReturnType(operation: OperationObject): string {
  const successResponse = operation.responses['200'] || operation.responses['201'];
  if (!successResponse?.content) return 'void';

  const schema = successResponse.content['application/json'].schema;
  return getSchemaType(schema);
}

function getSchemaType(schema: SchemaObject): string {
  if (schema.$ref) {
    return `Types.${schema.$ref.split('/').pop() || 'unknown'}`;
  }

  if (schema.type === 'array' && schema.items) {
    return `${getSchemaType(schema.items)}[]`;
  }

  return 'Record<string, unknown>';
}

function getRequestOptions(path: string, operation: OperationObject): string {
  const options: string[] = [];

  // Path parameters
  const pathParams = operation.parameters?.filter(p => p.in === 'path') || [];
  if (pathParams.length > 0) {
    const replacements = pathParams
      .map(p => `${p.name}: ${p.name}`)
      .join(', ');
    options.push(`params: { ${replacements} }`);
  }

  // Query parameters
  const queryParams = operation.parameters?.filter(p => p.in === 'query') || [];
  if (queryParams.length > 0) {
    options.push('params');
  }

  // Request body
  if (operation.requestBody) {
    options.push('data');
  }

  return options.join(',\n      ');
}

function generateMethodDocumentation(operation: OperationObject): string {
  const lines = ['/**'];
  if (operation.summary) lines.push(` * ${operation.summary}`);
  if (operation.description) lines.push(` * ${operation.description}`);
  lines.push(' */');
  return lines.join('\n');
}

generateClient(); 