/* eslint-env node */
/**
 * Verifies machine-readable agent assets for CI (Silicon-friendly / L5 runbook).
 * Run from repo root: node apps/docs/lib/scripts/verify-agent-contracts.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsRoot = join(__dirname, '..', '..');
const monorepoRoot = join(__dirname, '..', '..', '..', '..');

const paths = {
  agentCard: join(monorepoRoot, 'apps/website/public/.well-known/agent.json'),
  openApi: join(docsRoot, 'openapi.json'),
};

function mustParseJson(label, filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath} (${label})`);
  }
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

const agent = mustParseJson('agent card', paths.agentCard);
if (typeof agent.name !== 'string' || !agent.endpoints?.openapi) {
  throw new Error('agent.json: expected name and endpoints.openapi');
}

const spec = mustParseJson('OpenAPI', paths.openApi);
if (!spec.openapi || !spec.paths || typeof spec.paths !== 'object') {
  throw new Error('openapi.json: invalid OpenAPI document');
}

const requiredPaths = [
  '/agent/capabilities',
  '/agent/events',
  '/agent/subscriptions',
  '/agent/workflows',
  '/agent/handoff',
];
for (const p of requiredPaths) {
  if (!spec.paths[p]) {
    throw new Error(`OpenAPI must include path ${p} (re-run apps/api: pnpm run openapi:export)`);
  }
}

globalThis.console.log('verify-agent-contracts: ok');
