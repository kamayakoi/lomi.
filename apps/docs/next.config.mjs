import { createMDX } from 'fumadocs-mdx/next';
import fs from 'node:fs';
import path from 'node:path';

const withMDX = createMDX();

/**
 * Legacy flat URLs `/api/:operationId` -> canonical grouped `/api/:section/:operationId`.
 */
async function legacyApiRedirects() {
  const apiDocsRoot = path.join(process.cwd(), 'content/docs/api');
  const redirects = [];

  try {
    for (const name of fs.readdirSync(apiDocsRoot, { withFileTypes: true })) {
      if (!name.isDirectory()) continue;
      const segment = name.name;
      if (segment.startsWith('.')) continue;

      const dirPath = path.join(apiDocsRoot, segment);
      for (const file of fs.readdirSync(dirPath)) {
        if (!file.endsWith('.mdx') || file.startsWith('_')) continue;
        const base = file.replace(/\.mdx$/, '');
        redirects.push({
          source: `/api/${encodeURI(base)}`,
          destination: `/api/${encodeURI(segment)}/${encodeURI(base)}`,
          permanent: false,
        });
      }
    }
  } catch {
    // noop if missing during tooling
  }

  return redirects;
}

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  devIndicators: false,
  serverExternalPackages: ['prettier'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  async redirects() {
    return legacyApiRedirects();
  },
};

export default withMDX(config);
