import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    terser({
      compress: {
        drop_console: true,
      },
      format: {
        comments: false,
      },
    }),
    visualizer({
      filename: 'bundle-analysis.html',
      open: true,
    }),
    obfuscatorPlugin({
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [/node_modules/, /\.d\.ts$/],
      apply: "build",
      debugger: true,
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.9,
        debugProtection: false,
        debugProtectionInterval: 0,
        disableConsoleOutput: true,
        domainLock: [],
        domainLockRedirectUrl: 'about:blank',
        forceTransformStrings: [],
        identifierNamesCache: null,
        identifierNamesGenerator: 'hexadecimal',
        identifiersDictionary: [],
        identifiersPrefix: '',
        ignoreImports: false,
        inputFileName: '',
        log: false,
        numbersToExpressions: false,
        optionsPreset: 'default',
        renameGlobals: true,
        renameProperties: false,
        renamePropertiesMode: 'safe',
        reservedNames: [],
        reservedStrings: [],
        seed: 0,
        selfDefending: true,
        simplify: true,
        sourceMap: false,
        sourceMapBaseUrl: '',
        sourceMapFileName: '',
        sourceMapMode: 'separate',
        sourceMapSourcesMode: 'sources-content',
        splitStrings: false,
        splitStringsChunkLength: 10,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 0.5,
        stringArrayEncoding: [],
        stringArrayIndexesType: [
          'hexadecimal-number'
        ],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 1,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 2,
        stringArrayWrappersType: 'variable',
        stringArrayThreshold: 1,
        target: 'browser',
        transformObjectKeys: false,
        unicodeEscapeSequence: false
      },
    }),
    // Add Brotli compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 512,
    }),
  ],
  base: '/',
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      mangle: {
        keep_fnames: /^[A-Z]|use[A-Z]|^on[A-Z]/,
      },
      compress: {
        drop_console: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
        sourcemap: false,
      },
    },
    assetsDir: 'assets',
    manifest: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4242",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    headers: {
      'Cache-Control': 'public, max-age=31536000', // 1 year for static assets
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
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
    esbuildOptions: {
      target: 'esnext',
    }
  },
});