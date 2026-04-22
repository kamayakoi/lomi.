/* @proprietary license */

import { createOpenAPI } from 'fumadocs-openapi/server';

/** Relative to `apps/docs` cwd so generated MDX `document=` keys stay portable. */
export const openapi = createOpenAPI({
  input: ['./openapi.json'],
  proxyUrl: '/api/proxy',
});
