#!/usr/bin/env bash
# Smoke-test a deployed API (same flow as apps/mcp/scripts/smoke-http.ts).
# Usage: ./scripts/render-smoke-test.sh https://your-service.onrender.com

set -euo pipefail

BASE_URL="${1:?Usage: $0 <base-url>}"
BASE_URL="${BASE_URL%/}"

echo "==> GET /health"
curl -fsS "${BASE_URL}/health" | tee /dev/stderr
echo ""

echo "==> GET /ready"
HTTP_CODE=$(curl -fsS -o /tmp/lomi-api-ready.json -w "%{http_code}" "${BASE_URL}/ready" || true)
cat /tmp/lomi-api-ready.json
echo ""
if [[ "${HTTP_CODE}" != "200" ]]; then
  echo "FAIL: /ready returned HTTP ${HTTP_CODE}" >&2
  exit 1
fi

echo "==> GET / (root)"
curl -fsS "${BASE_URL}/" >/dev/null && echo "ok"

echo "==> GET /api (Swagger)"
curl -fsS -o /dev/null -w "HTTP %{http_code}\n" "${BASE_URL}/api"

echo "Smoke checks passed for ${BASE_URL}"
