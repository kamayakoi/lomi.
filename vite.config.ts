import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    }),
    terser({
      compress: {
        drop_console: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
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
        controlFlowFlatteningThreshold: 0.3,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.3,
        debugProtection: true,
        debugProtectionInterval: 4000,
        disableConsoleOutput: true,
        domainLock: [],
        domainLockRedirectUrl: 'about:blank',
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        optionsPreset: 'default',
        renameGlobals: true,
        renameProperties: false,
        renamePropertiesMode: 'safe',
        reservedNames: [],
        reservedStrings: [],
        seed: 0,
        selfDefending: true,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 5,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 0.3,
        stringArrayEncoding: ['rc4'],
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
        stringArrayThreshold: 0.5,
        transformObjectKeys: false,
        unicodeEscapeSequence: false
      },
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
        pure_funcs: ['console.log'],
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            '@radix-ui/react-icons',
            'framer-motion',
            'lucide-react'
          ],
          'auth': [
            './src/pages/auth/sign-in.tsx',
            './src/pages/auth/sign-up.tsx',
            './src/pages/auth/forgot-password.tsx',
            './src/pages/auth/reset-password.tsx',
            './src/pages/auth/otp.tsx'
          ],
          'landing': [
            './src/pages/Home.tsx',
            './src/pages/Privacy.tsx'
          ]
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, deps) => deps,
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-icons',
      'framer-motion',
      'lucide-react'
    ],
    exclude: [],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4242",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});