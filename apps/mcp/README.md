# `@lomi./mcp`

Model Context Protocol server that exposes the **public merchant REST API** as MCP tools. Definitions are **generated** from:

- [`apps/docs/openapi.json`](../docs/openapi.json) (exported from `apps/api`)
- The official public surface allowlist [`apps/docs/lib/scripts/manual-api/_expected-public-operations.json`](../docs/lib/scripts/manual-api/_expected-public-operations.json)
- Shared normalization [`apps/sdks/scripts/public-sdk-operations.js`](../sdks/scripts/public-sdk-operations.js)

## Transports

| Mode | When to use | Entry |
|------|-------------|-------|
| **stdio** (default) | Cursor / Claude Desktop spawn a local process | `lomi-mcp` → `dist/index.js` (`LOMI_MCP_TRANSPORT` unset or `stdio`) |
| **HTTP (streamable)** | Hosted MCP behind HTTPS / reverse proxy | `lomi-mcp-http` → `dist/http-entry.js` or `LOMI_MCP_TRANSPORT=http node dist/index.js` |

## Environment variables

### Merchant REST API (tools → `api.lomi.africa`)

| Variable | Required | Description |
|----------|----------|-------------|
| `LOMI_API_KEY` / `X_API_KEY` | Optional fallback | Server-level fallback merchant secret. In hosted multi-user mode, prefer per-session client header (`x-lomi-api-key` or `x-api-key`) so each user brings their own key. |
| `LOMI_API_BASE_URL` | No | Default `https://api.lomi.africa`. Sandbox: `https://sandbox.api.lomi.africa`. |
| `LOMI_API_BASE_URL_ALLOWLIST` | Recommended in prod | Comma-separated hostnames allowed for outbound calls (e.g. `api.lomi.africa,sandbox.api.lomi.africa`). If set, other hosts throw at startup/tool registration time when base URL is resolved. |

### HTTP fetch behavior

| Variable | Default | Description |
|----------|---------|-------------|
| `LOMI_API_FETCH_TIMEOUT_MS` | `30000` | Per-request timeout (`AbortSignal`). |
| `LOMI_API_FETCH_RETRIES` | `2` | Extra attempts for **GET/HEAD** only on timeout / 429 / 502 / 503 (bounded backoff). |

### Hosted MCP HTTP server

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` / `LOMI_MCP_HTTP_PORT` | No | Listen port (default `3333`). |
| `LOMI_MCP_HTTP_HOST` | No | Bind address (default `0.0.0.0` when transport is HTTP). |
| `LOMI_MCP_ALLOWED_HOSTS` | Recommended behind reverse proxy | Comma-separated allowed `Host` header values (DNS rebinding protection via MCP Express helper). |
| `LOMI_MCP_HTTP_PATH` | No | MCP route base (default `/mcp`). |
| `LOMI_MCP_BEARER_TOKEN` | **Strongly recommended** in prod | If set, MCP HTTP endpoints require `Authorization: Bearer <token>`. `/health` stays unauthenticated for probes. |
| `NODE_ENV` | No | `production` logs a warning when `LOMI_MCP_BEARER_TOKEN` is unset. |

### Stdio vs HTTP selection

| Variable | Default | Description |
|----------|---------|-------------|
| `LOMI_MCP_TRANSPORT` | `stdio` | `stdio` or `http`. |

## Scripts

```bash
cd apps/mcp
pnpm install
pnpm run generate          # regenerate tools-manifest.json
pnpm run generate:check    # regenerate + git diff (CI-style)
pnpm test                  # vitest (generator + HTTP client helpers)
pnpm run smoke:http        # boots HTTP MCP locally + lists tools (needs bearer env below)

pnpm run build             # generate + tsc → dist/
pnpm start                 # node dist/index.js (stdio by default)
pnpm run start:http        # node dist/http-entry.js (HTTP only)
pnpm run dev               # tsx src/index.ts
pnpm run dev:http          # tsx HTTP entry with transport=http
```

Smoke:

```bash
LOMI_MCP_BEARER_TOKEN=local-dev-secret pnpm run smoke:http
```

## Hosted deployment runbook

**Recommended platforms:** Fly.io, Railway, Render, ECS/Fargate, or any VM running Node 22+ with reverse-proxy TLS (not serverless-only).

**Why not plain Vercel functions:** MCP streamable HTTP uses ongoing SSE/session semantics; short-lived lambdas are a poor fit unless you use a dedicated long-lived runtime.

### Minimal rollout checklist

1. Build image or deploy Node artifact (`pnpm run build`).
2. Set **`LOMI_MCP_BEARER_TOKEN`** (rotate periodically).
3. Decide key model:
   - Preferred: clients send `x-lomi-api-key` (or `x-api-key`) on MCP initialization request.
   - Optional fallback: set server-side `LOMI_API_KEY`.
4. Set **`LOMI_API_BASE_URL`** + **`LOMI_API_BASE_URL_ALLOWLIST`** matching prod/sandbox.
5. Configure reverse proxy: TLS termination, rate limits, optional IP allowlist.
6. Health checks: `GET /health` (JSON `{ ok: true, ... }`).
7. MCP URL: `https://<host><LOMI_MCP_HTTP_PATH>` (default `/mcp`).
8. Rollback: redeploy previous image/tag; manifest drift is prevented by CI on PRs touching API/docs/SDKs/MCP.

### Railway (recommended managed deploy)

1. Create a new Railway service from this repo.
2. Set **Root Directory** to `apps/mcp`.
3. Railway picks up `railway.json` (`pnpm run start:http`, health `/health`).
4. Configure environment variables:
   - required: `LOMI_MCP_BEARER_TOKEN`
   - recommended: `LOMI_API_BASE_URL`, `LOMI_API_BASE_URL_ALLOWLIST`
   - optional fallback: `LOMI_API_KEY`
5. Deploy, then verify:
   - `GET /health` returns `{ ok: true, ... }`
   - MCP endpoint is reachable at `/mcp` (or custom `LOMI_MCP_HTTP_PATH`)

### Docker

```bash
docker build -t lomi-mcp ./apps/mcp
docker run --rm -p 3333:3333 \
  -e LOMI_MCP_BEARER_TOKEN=change-me \
  -e LOMI_API_KEY=merchant-secret \
  -e LOMI_API_BASE_URL=https://api.lomi.africa \
  -e LOMI_API_BASE_URL_ALLOWLIST=api.lomi.africa \
  lomi-mcp
```

### Observability

- Structured logs go to stdout/stderr (`console`); plug into your log aggregator.
- Optional correlation: declare OpenAPI header params → emitted as `header_<Name>` input fields → forwarded **only** when listed on the tool schema (never arbitrary `header_*`).

### Local Cursor (stdio)

```json
{
  "mcpServers": {
    "lomi": {
      "command": "node",
      "args": ["/absolute/path/to/repo/apps/mcp/dist/index.js"],
      "env": {
        "LOMI_API_KEY": "your-key",
        "LOMI_API_BASE_URL": "https://api.lomi.africa"
      }
    }
  }
}
```

### Remote MCP client setup (hosted HTTP)

For shared hosted MCP, each user should provide:

- `Authorization: Bearer <LOMI_MCP_BEARER_TOKEN>` to access the MCP server
- `x-lomi-api-key: <their_merchant_key>` (or `x-api-key`) to execute tools under their own merchant account

This avoids hardcoding one merchant key server-side.

### Better auth UX (next step)

Best UX is dashboard-backed OAuth/login and token exchange (instead of manually pasting API keys). That is feasible, but requires a separate auth flow:

1. user signs in on `apps/dashboard`
2. user approves MCP access + scopes
3. MCP receives an access token / merchant context
4. tools execute with that merchant context

Current implementation supports header-based per-user keys now, which is the quickest secure path before full OAuth UX.

### Regenerating after API changes

1. Export OpenAPI from Nest (`apps/api`: `pnpm run openapi:export`), commit `apps/docs/openapi.json`.
2. Update allowlist / SDK maps when the public surface changes.
3. Run `pnpm run generate` in `apps/mcp` and commit `src/generated/tools-manifest.json`.

CI `verify-mcp-manifest` runs generation + diff + `tsc` + tests + `smoke:http`.

## Tool naming

Tools are `lomi_<method>_<path>` with `{param}` segments replaced by the parameter name. JSON bodies use a nested `body` object when OpenAPI defines `application/json`.
