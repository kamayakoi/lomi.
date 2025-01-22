import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react({
      // Optimize React refresh for Bun
      babel: {
        compact: true,
        minified: true,
      }
    }),
    terser({
      compress: {
        drop_console: true,
        passes: 2,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
      format: {
        comments: false,
      },
      module: true,
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
    target: 'esnext', // Optimize for modern browsers
    modulePreload: {
      polyfill: false, // Modern browsers support module preload
    },
    terserOptions: {
      mangle: {
        keep_fnames: /^[A-Z]|use[A-Z]|^on[A-Z]/,
        module: true,
      },
      compress: {
        drop_console: true,
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        passes: 2,
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
        compact: true,
        freeze: false, // Optimize property access
        hoistTransitiveImports: true,
      },
    },
    assetsDir: 'assets',
    manifest: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false, // Speed up build
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
    include: ['react', 'react-dom'], // Pre-bundle major dependencies
    esbuildOptions: {
      target: 'esnext',
    }
  },
});