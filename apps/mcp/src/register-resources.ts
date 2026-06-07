import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { ToolsManifest } from './manifest.js';
import { buildServerInstructions } from './server-instructions.js';

const GETTING_STARTED = buildServerInstructions('http');

const ERRORS_DOC = `# lomi. MCP tool result format

Tool responses are JSON text with this envelope:

\`\`\`json
{
  "ok": true,
  "status": 200,
  "statusText": "OK",
  "contentType": "application/json",
  "body": { }
}
\`\`\`

When \`ok\` is false, an \`error\` object is included:

\`\`\`json
{
  "ok": false,
  "status": 404,
  "error": {
    "kind": "lomi_http_error",
    "status": 404,
    "body": { }
  }
}
\`\`\`

Use list endpoints with query filters before calling destructive tools.
`;

function buildToolsIndex(manifest: ToolsManifest): string {
  const byTag = new Map<string, Array<{ name: string; title: string; write: boolean }>>();
  for (const tool of manifest.tools) {
    const tag = tool.tags[0] ?? 'Other';
    const list = byTag.get(tag) ?? [];
    list.push({ name: tool.name, title: tool.title, write: tool.write });
    byTag.set(tag, list);
  }
  const tags = [...byTag.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([tag, tools]) => ({
      tag,
      tools: [...tools].sort((a, b) => a.name.localeCompare(b.name)),
    }));
  return JSON.stringify({ toolCount: manifest.toolCount, tags }, null, 2);
}

export function registerLomiResources(
  server: McpServer,
  manifest: ToolsManifest,
): void {
  server.registerResource(
    'getting-started',
    'lomi://docs/getting-started',
    {
      title: 'lomi. MCP getting started',
      description: 'Authentication, base URLs, and usage conventions.',
      mimeType: 'text/markdown',
    },
    async () => ({
      contents: [
        {
          uri: 'lomi://docs/getting-started',
          mimeType: 'text/markdown',
          text: GETTING_STARTED,
        },
      ],
    }),
  );

  server.registerResource(
    'errors',
    'lomi://docs/errors',
    {
      title: 'lomi. tool result format',
      description: 'How to interpret ok/status/body envelopes from tool calls.',
      mimeType: 'text/markdown',
    },
    async () => ({
      contents: [
        {
          uri: 'lomi://docs/errors',
          mimeType: 'text/markdown',
          text: ERRORS_DOC,
        },
      ],
    }),
  );

  const toolsIndexJson = buildToolsIndex(manifest);

  server.registerResource(
    'tools-index',
    'lomi://tools/index',
    {
      title: 'lomi. tools index',
      description: 'All MCP tools grouped by OpenAPI tag.',
      mimeType: 'application/json',
    },
    async () => ({
      contents: [
        {
          uri: 'lomi://tools/index',
          mimeType: 'application/json',
          text: toolsIndexJson,
        },
      ],
    }),
  );

}
