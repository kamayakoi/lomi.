# lomi. API

RESTful API service for the lomi. payment platform.

## Overview

NestJS API for payments, subscriptions, webhooks, and metering. Runs as a **long-running process** on [Render](https://render.com). Deployment conventions match [`apps/mcp`](../mcp): `/health`, `/ready`, [`Dockerfile`](Dockerfile), [`render.json`](render.json).

Frontends (dashboard, checkout, docs, storefront) stay on Vercel.

## Quick start (local)

```bash
cd apps/api
pnpm install
cp .env.example .env.local
pnpm run start:dev
```

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Liveness |
| `GET /ready` | Readiness (Render health check) |
| `GET /health/redis` | Redis + queue snapshot |
| `GET /api` | Swagger UI |

## Deployment (Render)

| Setting | Value |
|---------|--------|
| Root directory | `apps/api` |
| Build command | `pnpm install --frozen-lockfile && pnpm run build` |
| Start command | `pnpm run start:prod` |
| Health check path | `/ready` |
| Health check timeout | 120s |
| Node version | 22 |

Blueprint: [`render.yaml`](render.yaml). Env vars: [`.env.example`](.env.example).

### Smoke test

```bash
pnpm run smoke:http https://your-service.onrender.com
```

## Documentation

- [API reference](https://docs.lomi.africa/api)
- [Getting started](https://docs.lomi.africa/docs/core/fundamentals/)

## Support

[hello@lomi.africa](mailto:hello@lomi.africa)
