import { ApiError } from './core/ApiError';
import { ApiRequestOptions } from './core/ApiRequestOptions';
import { ApiResult } from './core/ApiResult';

export class BaseClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly environment: 'test' | 'live';
  private readonly version: string = 'v1';

  constructor(baseUrl: string, apiKey?: string) {
    // Handle environment-specific base URLs
    if (baseUrl === 'auto') {
      this.baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://api.lomi.africa'
        : process.env.NODE_ENV === 'development'
          ? 'https://sandbox.api.lomi.africa'
          : 'http://localhost:4242';
    } else {
      this.baseUrl = baseUrl;
    }

    this.apiKey = apiKey;
    // Determine environment from API key prefix or NODE_ENV
    this.environment = apiKey?.includes('_test_') 
      ? 'test'
      : process.env.NODE_ENV === 'development' ? 'test' : 'live';
  }

  protected async request<T>(options: ApiRequestOptions): Promise<ApiResult<T>> {
    const { method, path, params, data } = options;
    
    // First replace path parameters
    let resolvedPath = path;
    const queryParams: Record<string, string> = {};
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          const placeholder = `{${key}}`;
          if (resolvedPath.includes(placeholder)) {
            resolvedPath = resolvedPath.replace(placeholder, String(value));
          } else {
            queryParams[key] = String(value);
          }
        }
      });
    }

    // Add API version to the path
    const versionedPath = `/${this.version}${resolvedPath}`;
    const url = new URL(versionedPath, this.baseUrl);
    
    // Add remaining params as query parameters
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['X-API-KEY'] = this.apiKey;
      headers['X-Environment'] = this.environment;
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
}