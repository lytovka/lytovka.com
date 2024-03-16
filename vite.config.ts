import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { installGlobals } from "@remix-run/node";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

installGlobals();

const filesNeedToExclude = ["app/routes/wishlist._index.tsx"];

const filesPathToExclude = filesNeedToExclude.map((src) => {
  return fileURLToPath(new URL(src, import.meta.url));
});

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
    }),
    // Custom plugin to load markdown files
    {
      name: "markdown-loader",
      transform(code, id) {
        if (id.endsWith(".md")) {
          // For .md files, get the raw content
          return `export default ${JSON.stringify(code)};`;
        }
      },
    },
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: [/^marked/],
  },
  build: {
    rollupOptions: {
      external: [...filesPathToExclude],
    },
  },
});
