import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';

import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  hostHeaderValidation,
  localhostHostValidation,
} from '@modelcontextprotocol/sdk/server/middleware/hostHeaderValidation.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';

import manifestJson from './generated/tools-manifest.json' with { type: 'json' };
import type { ToolsManifest } from './manifest.js';
import { parseManifest } from './manifest-parse.js';
import { registerMerchantTools } from './register-tools.js';
import {
  getLomiApiBaseUrl,
  getMcpHttpBearerTokens,
  getMcpReadinessChecks,
  getOptionalMerchantApiKey,
  httpListenPort,
  listenHostOptions,
  mcpHttpBasePath,
  mcpMaxBodyBytes,
  mcpMaxSessions,
  mcpRateLimitRpm,
  mcpSessionTtlMs,
} from './env-config.js';
import { extractSessionMerchantApiKey } from './session-merchant-key.js';
import { McpSessionRegistry } from './session-registry.js';
import { mcpLog, mcpRequestAls } from './mcp-request-context.js';

type TransportEntry = StreamableHTTPServerTransport;

/** Rolling 60s window per IP for MCP routes */
type RateBucket = { count: number; windowStart: number };

function clientIp(req: Request): string {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string') {
    const first = xf.split(',')[0]?.trim();
    if (first) return first;
  }
  if (Array.isArray(xf) && xf[0]) return xf[0].trim();
  return req.socket.remoteAddress ?? 'unknown';
}

function checkMcpRateLimit(
  buckets: Map<string, RateBucket>,
  ip: string,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const rpm = mcpRateLimitRpm();
  if (rpm <= 0) return { ok: true };
  const now = Date.now();
  const windowMs = 60_000;
  let b = buckets.get(ip);
  if (!b || now - b.windowStart >= windowMs) {
    b = { count: 0, windowStart: now };
    buckets.set(ip, b);
  }
  b.count += 1;
  if (b.count > rpm) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((windowMs - (now - b.windowStart)) / 1000),
    );
    return { ok: false, retryAfterSec };
  }
  return { ok: true };
}

function createLomiMcpExpressApp(hostOpts: ReturnType<typeof listenHostOptions>): Express {
  const app = express();
  const limit = mcpMaxBodyBytes();
  app.use(express.json({ limit: limit }));

  const { host, allowedHosts } = hostOpts;
  if (allowedHosts) {
    app.use(hostHeaderValidation(allowedHosts));
  } else {
    const localhostHosts = ['127.0.0.1', 'localhost', '::1'];
    if (localhostHosts.includes(host)) {
      app.use(localhostHostValidation());
    } else if (host === '0.0.0.0' || host === '::') {
      console.warn(
        `[lomi-mcp] Binding to ${host} without LOMI_MCP_ALLOWED_HOSTS — ensure TLS and auth (LOMI_MCP_BEARER_TOKEN) in production.`,
      );
    }
  }
  return app;
}

function warnProductionWithoutBearer(): void {
  if (process.env.NODE_ENV === 'production' && getMcpHttpBearerTokens().length === 0) {
    console.warn(
      '[lomi-mcp] NODE_ENV=production but LOMI_MCP_BEARER_TOKEN is unset; MCP HTTP endpoints are world-readable.',
    );
  }
}

function bearerAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const tokens = getMcpHttpBearerTokens();
  if (tokens.length === 0) {
    next();
    return;
  }
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      error_code: 'missing_bearer',
      message:
        'Missing Authorization header. Send Authorization: Bearer <LOMI_MCP_BEARER_TOKEN>.',
    });
    return;
  }
  const presented = auth.slice('Bearer '.length).trim();
  if (!tokens.includes(presented)) {
    res.status(401).json({
      error: 'Unauthorized',
      error_code: 'invalid_bearer',
      message:
        'Invalid transport bearer token. Use a value from LOMI_MCP_BEARER_TOKEN (supports comma-separated rotation set).',
    });
    return;
  }
  next();
}

/** One MCP server instance per Streamable HTTP session (SDK pattern). */
function createSessionMcpServer(
  manifest: ToolsManifest,
  sessionMerchantApiKey: string | null,
): McpServer {
  const server = new McpServer(
    { name: 'lomi.', version: manifest.apiVersion },
    {
      instructions: [
        'Hosted MCP server for the lomi. merchant REST API.',
        'Client auth for MCP transport can use LOMI_MCP_BEARER_TOKEN when configured (comma-separated for rotation).',
        'Merchant REST auth: prefer x-lomi-api-key / x-api-key (e.g. lomi_mcp_* from dashboard connect).',
        'When LOMI_MCP_BEARER_TOKEN is unset, Authorization: Bearer <lomi_* merchant key> is accepted.',
        'Server-side LOMI_API_KEY is a fallback for single-tenant deployments only.',
      ].join('\n'),
    },
  );
  registerMerchantTools(server, manifest, {
    getApiKey: () => sessionMerchantApiKey ?? getOptionalMerchantApiKey(),
  });
  return server;
}

export function createHttpApplication(manifest: ToolsManifest): Express {
  warnProductionWithoutBearer();

  const hostOpts = listenHostOptions();
  const app = createLomiMcpExpressApp(hostOpts);
  const registry = new McpSessionRegistry(mcpMaxSessions(), mcpSessionTtlMs());
  const rateBuckets = new Map<string, RateBucket>();

  function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const ip = clientIp(req);
    const rl = checkMcpRateLimit(rateBuckets, ip);
    if (rl.ok) {
      next();
      return;
    }
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    res.status(429).json({
      error: 'Too Many Requests',
      error_code: 'rate_limited',
      message: `MCP request rate limit exceeded (${mcpRateLimitRpm()} req/min per client).`,
      retry_after_sec: rl.retryAfterSec,
    });
  }

  app.get('/health', (_req, res) => {
    res.status(200).json({
      ok: true,
      service: 'lomi-mcp',
      manifestVersion: manifest.manifestVersion,
      apiVersion: manifest.apiVersion,
      toolCount: manifest.toolCount,
    });
  });

  app.get('/ready', (_req, res) => {
    const envResult = getMcpReadinessChecks();
    const manifestOk =
      Boolean(manifest.manifestVersion) &&
      Array.isArray(manifest.tools) &&
      manifest.tools.length > 0;

    const checks = [
      ...envResult.checks,
      {
        name: 'tools_manifest',
        ok: manifestOk,
        detail: manifestOk ? undefined : 'manifest missing tools or version',
      },
    ];
    const ok = envResult.ok && manifestOk;
    if (!ok) {
      res.status(503).json({
        ready: false,
        service: 'lomi-mcp',
        checks,
      });
      return;
    }
    res.status(200).json({
      ready: true,
      service: 'lomi-mcp',
      checks,
    });
  });

  const basePath = mcpHttpBasePath();

  const mcpPostHandler = async (req: Request, res: Response): Promise<void> => {
    const headerRequestId = req.headers['x-request-id'];
    const requestId =
      (typeof headerRequestId === 'string' && headerRequestId.trim()) ||
      randomUUID();

    const store: { requestId: string; sessionId?: string } = { requestId };

    await mcpRequestAls.run(store, async () => {
      try {
        const sessionHeader = req.headers['mcp-session-id'];
        const sessionId = Array.isArray(sessionHeader)
          ? sessionHeader[0]
          : sessionHeader;

        let transport: TransportEntry | undefined;

        if (sessionId && registry.has(sessionId)) {
          transport = registry.get(sessionId)!.transport;
          registry.touch(sessionId);
          if (store.sessionId === undefined) store.sessionId = sessionId;
        } else if (!sessionId && isInitializeRequest(req.body)) {
          if (!registry.canAcceptNewSession()) {
            mcpLog('mcp_session_rejected', {
              reason: 'max_sessions',
              activeSessions: registry.size,
              maxSessions: mcpMaxSessions(),
            });
            res.status(503).json({
              jsonrpc: '2.0',
              error: {
                code: -32000,
                message: `MCP server at session capacity (${mcpMaxSessions()}). Try again later.`,
              },
              id: null,
            });
            return;
          }

          const sessionMerchantApiKey = extractSessionMerchantApiKey(req);
          transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (sid) => {
              registry.attachSession(sid, transport!);
              store.sessionId = sid;
            },
          });

          const server = createSessionMcpServer(manifest, sessionMerchantApiKey);
          await server.connect(transport);
          await transport.handleRequest(
            req as IncomingMessage,
            res as ServerResponse,
            req.body,
          );
          return;
        } else {
          res.status(400).json({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Bad Request: No valid MCP session ID provided',
            },
            id: null,
          });
          return;
        }

        await transport!.handleRequest(
          req as IncomingMessage,
          res as ServerResponse,
          req.body,
        );
      } catch (error) {
        mcpLog('mcp_post_error', {
          error: error instanceof Error ? error.message : String(error),
        });
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Internal server error',
            },
            id: null,
          });
        }
      }
    });
  };

  const mcpGetHandler = async (req: Request, res: Response): Promise<void> => {
    const headerRequestIdGet = req.headers['x-request-id'];
    const requestId =
      (typeof headerRequestIdGet === 'string' && headerRequestIdGet.trim()) ||
      randomUUID();
    const store: { requestId: string; sessionId?: string } = { requestId };

    await mcpRequestAls.run(store, async () => {
      try {
        const sessionHeader = req.headers['mcp-session-id'];
        const sessionId = Array.isArray(sessionHeader)
          ? sessionHeader[0]
          : sessionHeader;
        if (!sessionId || !registry.has(sessionId)) {
          res.status(400).send('Invalid or missing MCP session ID');
          return;
        }
        store.sessionId = sessionId;
        registry.touch(sessionId);
        const transport = registry.get(sessionId)!.transport;
        await transport.handleRequest(
          req as IncomingMessage,
          res as ServerResponse,
        );
      } catch (error) {
        mcpLog('mcp_get_error', {
          error: error instanceof Error ? error.message : String(error),
        });
        if (!res.headersSent) {
          res.status(500).send('Internal server error');
        }
      }
    });
  };

  app.post(basePath, rateLimitMiddleware, bearerAuthMiddleware, mcpPostHandler);
  app.get(basePath, rateLimitMiddleware, bearerAuthMiddleware, mcpGetHandler);

  app.use(
    (err: unknown, _req: Request, res: Response, next: NextFunction) => {
      if (
        err &&
        typeof err === 'object' &&
        'type' in err &&
        (err as { type: string }).type === 'entity.too.large'
      ) {
        res.status(413).json({
          error: 'Payload Too Large',
          error_code: 'payload_too_large',
          message: `JSON body exceeds LOMI_MCP_MAX_BODY_BYTES (${mcpMaxBodyBytes()}).`,
        });
        return;
      }
      next(err);
    },
  );

  return app;
}

export async function startHttpServer(): Promise<void> {
  const manifest = parseManifest(manifestJson);
  const app = createHttpApplication(manifest);
  const port = httpListenPort();
  const hostOpts = listenHostOptions();
  const basePath = mcpHttpBasePath();

  await new Promise<void>((resolve, reject) => {
    const srv = app.listen(port, hostOpts.host, () => resolve());
    srv.on('error', reject);
  });

  const bearerMode =
    getMcpHttpBearerTokens().length > 0 ? 'required' : 'off';
  mcpLog('mcp_http_startup', {
    host: hostOpts.host,
    port,
    mcpPath: basePath,
    healthPath: '/health',
    readyPath: '/ready',
    allowedHostsCount: hostOpts.allowedHosts?.length ?? 0,
    transportBearerMode: bearerMode,
    transportBearerCount: getMcpHttpBearerTokens().length,
    apiBaseUrlHost: (() => {
      try {
        return new URL(getLomiApiBaseUrl()).hostname;
      } catch {
        return 'invalid';
      }
    })(),
    maxSessions: mcpMaxSessions(),
    sessionTtlMs: mcpSessionTtlMs(),
    maxBodyBytes: mcpMaxBodyBytes(),
    rateLimitRpm: mcpRateLimitRpm(),
    toolCount: manifest.toolCount,
    apiVersion: manifest.apiVersion,
  });
}
