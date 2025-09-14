import { defineConfig } from "vite";

export default defineConfig(({ command, mode }) => {
  const isCodeBuild = process.env.BUILD_TARGET === 'code';
  
  if (isCodeBuild) {
    return {
      build: {
        target: "es2017",
        lib: {
          entry: "src/code.ts",
          name: "FigmaPlugin",
          fileName: "code",
          formats: ["iife"]
        },
        rollupOptions: {
          output: {
            extend: true
          }
        },
        minify: false,
        emptyOutDir: false
      }
    };
  }
  
  return {
    build: {
      target: "es2017",
      rollupOptions: {
        input: "src/ui/index.html",
        output: {
          entryFileNames: "assets/[name].js",
          assetFileNames: "assets/[name][extname]",
          format: "iife",
          name: "FigmaUI"
        }
      },
      emptyOutDir: false
    },
    base: "./",
    publicDir: "public"
  };
});
