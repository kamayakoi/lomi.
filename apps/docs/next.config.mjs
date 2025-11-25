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
  // // Performance optimizations for better navigation
  experimental: {
    optimizeServerReact: true,
    optimizeCss: process.env.NODE_ENV === 'production',
  },
  // Configure server external packages for Sanity and build tools
  serverExternalPackages: ['sanity', 'prettier'],
  // Optimize prefetching for better navigation
  async headers() {
    // In development, don't set aggressive cache headers
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
          ],
        },
      ];
    }

    // Production cache headers
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, immutable',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mdswvokxrnfggrujsfjd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'mdswvokxrnfggrujsfjd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable source maps for production builds for debugging and Lighthouse
  productionBrowserSourceMaps: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Output configuration for Vercel
  outputFileTracingIncludes: {
    '/studio/[[...tool]]': ['./node_modules/sanity/**/*'],
  },
};

export default withMDX(config);
