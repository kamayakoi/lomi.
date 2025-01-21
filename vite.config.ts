import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";
import compressPlugin from 'vite-plugin-compression';

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
      gzipSize: true,
      brotliSize: true,
    }),
    compressPlugin({ algorithm: 'gzip', ext: '.gz' }),
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
  ],
  base: '/',
  build: {
    target: 'esnext',
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
          // Specific vendor bundles for core dependencies
          if (id.includes('react/') || id.includes('react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('react-router-dom/')) {
            return 'vendor-router';
          }
          if (id.includes('react-query')) {
            return 'vendor-query';
          }
          if (id.includes('@radix-ui/') || id.includes('@shadcn/')) {
            return 'vendor-ui';
          }
          // Dynamic chunking for remaining node_modules
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
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
});