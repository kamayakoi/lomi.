/* @proprietary license */

/**
 * OpenAPI Try-it proxy: forwards browser playground requests to the sandbox API only,
 * with optional server-side injection of the merchant's test secret key.
 *
 * Fumadocs' built-in `createProxy` does not await async `overrides.request`, so this
 * module duplicates its handler shape with an awaited injection step.
 */

const METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'HEAD',
] as const;

export function getSandboxAllowedOrigins(): string[] {
  const defaults = ['https://sandbox.api.lomi.africa'];
  const extra =
    process.env.LOMI_DOCS_SANDBOX_ALLOWED_ORIGINS?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  return [...defaults, ...extra];
}

/** Exported for unit tests (same rules as the proxy handler). */
export function isOriginAllowedForProxy(
  targetUrl: string,
  allowedOrigins = getSandboxAllowedOrigins(),
): boolean {
  const parsed = URL.parse(targetUrl);
  if (!parsed) return false;
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return false;
  }
  return allowedOrigins.includes(parsed.origin);
}

export type SecureProxyOptions = {
  getInjectionContext: () => Promise<{
    shouldInjectTestKey: boolean;
    activeOrganizationId: string | null;
  }>;
  resolveTestKey: (ctx: {
    activeOrganizationId: string | null;
  }) => Promise<string | null>;
};

export function createSecureOpenApiProxyHandlers(options: SecureProxyOptions) {
  const allowedOrigins = getSandboxAllowedOrigins();

  async function handler(incomingRequest: Request): Promise<Response> {
    const urlParam = new URL(incomingRequest.url).searchParams.get('url');
    if (!urlParam) {
      return Response.json(
        '[Proxy] A `url` query parameter is required for proxy url',
        { status: 400 },
      );
    }

    const parsedUrl = URL.parse(urlParam);
    if (!parsedUrl) {
      return Response.json('[Proxy] Invalid `url` parameter value.', { status: 400 });
    }

    if (!allowedOrigins.includes(parsedUrl.origin)) {
      return Response.json(
        `[Proxy] The origin "${parsedUrl.origin}" is not allowed.`,
        { status: 400 },
      );
    }

    const contentLength = incomingRequest.headers.get('content-length');
    const hasBody = contentLength && parseInt(contentLength, 10) > 0;
    const method = incomingRequest.method.toUpperCase();

    const body =
      hasBody && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
        ? await incomingRequest.arrayBuffer()
        : undefined;

    let proxied = new Request(parsedUrl.toString(), {
      method: incomingRequest.method,
      cache: 'no-cache',
      headers: incomingRequest.headers,
      body,
    });

    const { shouldInjectTestKey, activeOrganizationId } =
      await options.getInjectionContext();

    if (shouldInjectTestKey) {
      const key = await options.resolveTestKey({ activeOrganizationId });
      if (key) {
        const headers = new Headers(proxied.headers);
        const existing =
          headers.get('X-API-Key') ?? headers.get('x-api-key');
        if (!existing) {
          headers.set('X-API-Key', key);
        }
        proxied = new Request(proxied, { headers });
      }
    }

    proxied.headers.forEach((_value, originalKey) => {
      if (originalKey.toLowerCase() === 'origin') {
        proxied.headers.delete(originalKey);
      }
    });

    let res = await fetch(proxied).catch((e) => new Error(String(e)));
    if (res instanceof Error) {
      return Response.json(`[Proxy] Failed to proxy request: ${res.message}`, {
        status: 500,
      });
    }

    const headers = new Headers(res.headers);
    headers.forEach((_value, originalKey) => {
      if (originalKey.toLowerCase().startsWith('access-control-')) {
        headers.delete(originalKey);
      }
    });
    headers.set('X-Forwarded-Host', res.url);

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  }

  const out: Record<string, typeof handler> = {};
  for (const m of METHODS) {
    out[m] = handler;
  }
  return out;
}
