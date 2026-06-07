import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Lomi",
      fileName: () => "lomi.js",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
    emptyOutDir: false,
  },
});
