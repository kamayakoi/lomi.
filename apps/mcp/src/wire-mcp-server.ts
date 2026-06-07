import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { ToolsManifest } from './manifest.js';
import { registerLomiPrompts } from './register-prompts.js';
import { registerLomiResources } from './register-resources.js';
import { registerMerchantTools } from './register-tools.js';
import { buildServerInstructions, type InstructionMode } from './server-instructions.js';

export type WireMcpServerOptions = {
  manifest: ToolsManifest;
  mode: InstructionMode;
  getApiKey: () => string | null;
};

/** Create and wire tools, resources, and prompts on an MCP server instance. */
export function wireMcpServer(options: WireMcpServerOptions): McpServer {
  const { manifest, mode, getApiKey } = options;
  const server = new McpServer(
    { name: 'lomi.', version: manifest.apiVersion },
    {
      instructions: buildServerInstructions(mode),
    },
  );
  registerMerchantTools(server, manifest, { getApiKey });
  registerLomiResources(server, manifest);
  registerLomiPrompts(server, manifest);
  return server;
}
