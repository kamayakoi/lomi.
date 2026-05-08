/**
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
    let url = `${OpenAPI.BASE}${options.url}`;
    if (options.path) {
        for (const [key, value] of Object.entries(options.path)) {
            url = url.replace(`{${key}}`, String(value));
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
