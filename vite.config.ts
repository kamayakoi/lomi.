import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";
import compression from 'vite-plugin-compression';

// Separate configs for dev and prod
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    ...(command === 'build' ? [
      terser({
        compress: {
          drop_console: true,
          pure_funcs: ['console.log'],
          passes: 2,
        },
        format: {
          comments: false,
        },
        mangle: true,
      }),
      obfuscatorPlugin({
        include: ["src/**/*.ts", "src/**/*.tsx"],
        exclude: [/node_modules/, /\.d\.ts$/],
        apply: "build",
        debugger: true,
        options: {
          compact: true,
          controlFlowFlattening: false,
          deadCodeInjection: false,
          debugProtection: false,
          disableConsoleOutput: true,
          stringArray: true,
          stringArrayEncoding: [],
          stringArrayThreshold: 0.75,
          target: 'browser',
          identifierNamesGenerator: 'hexadecimal',
          renameGlobals: false,
        },
      }),
      // Only run visualizer in build
      visualizer({
      filename: 'bundle-analysis.html',
        open: false, // Don't open automatically
        gzipSize: true,
        brotliSize: true,
      }),
      // Optimize compression only in production
      compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024 // Increased threshold
      }),
    ] : []),
  ],
  base: '/',
  build: {
    sourcemap: false,
    minify: 'terser',
    outDir: 'dist',
    emptyOutDir: true,
    target: ['es2015', 'safari12'],
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'framer-motion',
          ],
          'ui': [
            '@radix-ui',
            '@shadcn',
          ],
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2000,
    assetsInlineLimit: 4096, // 4kb
    modulePreload: {
      polyfill: false, // Disable polyfill to reduce size
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./src")
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 24678,
      timeout: 5000,
    },
    proxy: {
      "/api": {
        target: "http://localhost:4242",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    headers: {
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    },
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'framer-motion',
    ],
    exclude: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip'
    ],
  },
}));