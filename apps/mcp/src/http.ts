import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';

import type { Express } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';

import manifestJson from './generated/tools-manifest.json' with { type: 'json' };
import type { ToolsManifest } from './manifest.js';
import { parseManifest } from './manifest-parse.js';
import { registerMerchantTools } from './register-tools.js';
import {
  getOptionalMerchantApiKey,
  getMcpHttpBearerToken,
  httpListenPort,
  listenHostOptions,
  mcpHttpBasePath,
} from './env-config.js';
import { extractSessionMerchantApiKey } from './session-merchant-key.js';

function warnProductionWithoutBearer(): void {
  if (
    process.env.NODE_ENV === 'production' &&
    !getMcpHttpBearerToken()
  ) {
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
  const expected = getMcpHttpBearerToken();
  if (!expected) {
    next();
    return;
  }
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${expected}`) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Provide Authorization: Bearer <LOMI_MCP_BEARER_TOKEN>.',
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
        'Client auth for MCP transport can use LOMI_MCP_BEARER_TOKEN when configured.',
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
  const app = createMcpExpressApp(hostOpts);

  app.get('/health', (_req, res) => {
    res.status(200).json({
      ok: true,
      service: 'lomi-mcp',
      manifestVersion: manifest.manifestVersion,
      apiVersion: manifest.apiVersion,
      toolCount: manifest.toolCount,
    });
  });

  const basePath = mcpHttpBasePath();

  type TransportEntry = StreamableHTTPServerTransport;
  const transports = new Map<string, TransportEntry>();

  const mcpPostHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionHeader = req.headers['mcp-session-id'];
      const sessionId = Array.isArray(sessionHeader)
        ? sessionHeader[0]
        : sessionHeader;

      let transport: TransportEntry | undefined;

      if (sessionId && transports.has(sessionId)) {
        transport = transports.get(sessionId);
      } else if (!sessionId && isInitializeRequest(req.body)) {
        const sessionMerchantApiKey = extractSessionMerchantApiKey(req);
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sid) => {
            transports.set(sid, transport!);
          },
        });

        transport.onclose = () => {
          const sid = transport?.sessionId;
          if (sid && transports.has(sid)) transports.delete(sid);
        };

        const server = createSessionMcpServer(manifest, sessionMerchantApiKey);
        await server.connect(transport);
        await transport.handleRequest(req as IncomingMessage, res as ServerResponse, req.body);
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

      await transport!.handleRequest(req as IncomingMessage, res as ServerResponse, req.body);
    } catch (error) {
      console.error('[lomi-mcp] MCP POST error:', error);
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
  };

  const mcpGetHandler = async (req: Request, res: Response): Promise<void> => {
    const sessionHeader = req.headers['mcp-session-id'];
    const sessionId = Array.isArray(sessionHeader)
      ? sessionHeader[0]
      : sessionHeader;
    if (!sessionId || !transports.has(sessionId)) {
      res.status(400).send('Invalid or missing MCP session ID');
      return;
    }
    const transport = transports.get(sessionId)!;
    try {
      await transport.handleRequest(req as IncomingMessage, res as ServerResponse);
    } catch (error) {
      console.error('[lomi-mcp] MCP GET error:', error);
      if (!res.headersSent) {
        res.status(500).send('Internal server error');
      }
    }
  };

  app.post(basePath, bearerAuthMiddleware, mcpPostHandler);
  app.get(basePath, bearerAuthMiddleware, mcpGetHandler);

  return app;
}

export async function startHttpServer(): Promise<void> {
  const manifest = parseManifest(manifestJson);
  const app = createHttpApplication(manifest);
  const port = httpListenPort();
  const hostOpts = listenHostOptions();

  await new Promise<void>((resolve, reject) => {
    const srv = app.listen(port, hostOpts.host, () => resolve());
    srv.on('error', reject);
  });

  console.log(
    `[lomi-mcp] HTTP MCP listening on http://${hostOpts.host}:${port}${mcpHttpBasePath()} (health: /health)`,
  );
}
