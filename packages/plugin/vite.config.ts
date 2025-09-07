import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        ui: "src/ui/index.html",
        code: "src/code.ts"
      },
      output: {
        entryFileNames: (chunk) => (chunk.name === "code" ? "code.js" : "assets/[name].js"),
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
});
