import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    terser({
      compress: {
        drop_console: true,
      },
    }),
    visualizer({
      filename: 'bundle-analysis.html',
      open: true,
    }),
  ],
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      mangle: true,
      compress: {
        drop_console: true,
      },
    },
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
  },
});