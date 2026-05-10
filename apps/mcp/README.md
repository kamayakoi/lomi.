# `@lomi./mcp`

lomi.’s **Model Context Protocol** server: your AI client (Cursor, Claude, etc.) calls the **same public merchant API** as our REST docs, exposed as MCP tools.

## Use the hosted MCP (HTTP)

Your organization gives you a base URL (for example `https://mcp.example.com`). Point your MCP client at:

- **MCP:** `https://<host>/mcp` (unless they use a custom path)

**Headers on every MCP request:**

| What | Header |
|------|--------|
| Access to the MCP server (if they set a transport secret) | `Authorization: Bearer <secret they gave you>` |
| Your merchant API key (required for tool calls) | `x-lomi-api-key: <key>` or `x-api-key: <key>` |

If the host does **not** use a transport secret, some clients can send `Authorization: Bearer <lomi_* merchant key>` instead—but when a transport secret exists, put the merchant key in **`x-lomi-api-key`**.

**Checks (optional):** `GET /health`, `GET /ready` on the same host.

## Use it locally (Cursor, stdio)

Build once from this package (`pnpm install && pnpm run build`), then add something like:

```json
{
  "mcpServers": {
    "lomi": {
      "command": "node",
      "args": ["/absolute/path/to/repo/apps/mcp/dist/index.js"],
      "env": {
        "LOMI_API_KEY": "your-merchant-secret-key",
        "LOMI_API_BASE_URL": "https://api.lomi.africa"
      }
    }
  }
}
```

Use `https://sandbox.api.lomi.africa` for sandbox. Set `LOMI_MCP_TRANSPORT=http` only if you run the HTTP entry yourself.

## Get a merchant key for HTTP MCP

1. **Dashboard device flow (recommended):** call `POST https://<project>.supabase.co/functions/v1/mcp-auth/device-auth` (no body). Open the returned `verification_uri`, sign in, enter `user_code`, authorize. Poll `POST …/mcp-auth/token` with `{ "device_code": "…" }` until you get `"api_key": "lomi_mcp_…"`. Use that value as **`x-lomi-api-key`**.
2. **Manual:** create or copy a secret API key from **Developers → API keys** in the dashboard and use it as **`x-lomi-api-key`**.

## If you run or deploy this package

Environment variables are listed in [`.env.example`](./.env.example). Operators: root directory `apps/mcp`, start HTTP with `pnpm run start:http` (see [`railway.json`](./railway.json) for Railway).

## Contributing (regenerate tools)

After public API or allowlist changes: from `apps/mcp`, run `pnpm run generate`, commit `src/generated/tools-manifest.json`.
