import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { fromJSONSchema } from 'zod';

import type { ManifestTool, ToolsManifest } from './manifest.js';
import { callLomiRest, formatHttpResult } from './lomi-http.js';
import { getLomiApiBaseUrl, getOptionalMerchantApiKey } from './env-config.js';

export type ToolRegistrationContext = {
  baseUrl: string;
  getApiKey: () => string | null;
};

function registerOneTool(
  server: McpServer,
  tool: ManifestTool,
  ctx: ToolRegistrationContext,
): void {
  const inputSchema = fromJSONSchema(tool.inputSchema, {
    defaultTarget: 'openapi-3.0',
  });

  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema,
    },
    async (args: unknown) => {
      const input = args as Record<string, unknown>;
      const apiKey = ctx.getApiKey();
      if (!apiKey) {
        return {
          content: [
            {
              type: 'text',
              text:
                'Missing merchant API key: provide x-lomi-api-key (or x-api-key) when creating MCP session, or set server-side LOMI_API_KEY fallback.',
            },
          ],
          isError: true,
        };
      }
      try {
        const result = await callLomiRest(tool, input, {
          baseUrl: ctx.baseUrl,
          apiKey,
        });
        const text = formatHttpResult(result);
        const ok = result.status >= 200 && result.status < 300;
        return {
          content: [{ type: 'text', text }],
          ...(ok ? {} : { isError: true }),
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: 'text', text: message }],
          isError: true,
        };
      }
    },
  );
}

export function registerMerchantTools(
  server: McpServer,
  manifest: ToolsManifest,
  ctx?: Partial<ToolRegistrationContext>,
): void {
  const baseUrl = ctx?.baseUrl ?? getLomiApiBaseUrl();
  const getApiKey = ctx?.getApiKey ?? getOptionalMerchantApiKey;
  const fullCtx: ToolRegistrationContext = { baseUrl, getApiKey };
  for (const tool of manifest.tools) {
    registerOneTool(server, tool, fullCtx);
  }
}
