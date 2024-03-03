<<<<<<< HEAD
<<<<<<< HEAD
import { vitePlugin as remix } from "@remix-run/dev";
=======
import { unstable_vitePlugin as remix } from "@remix-run/dev";
>>>>>>> fa782b7 (feat: migrate to vite compiler)
=======
import { vitePlugin as remix } from "@remix-run/dev";
>>>>>>> a5a020f (update remix)
import { defineConfig } from "vite";
import { installGlobals } from "@remix-run/node";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
    }),
<<<<<<< HEAD
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
=======
>>>>>>> fa782b7 (feat: migrate to vite compiler)
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: [/^marked/],
  },
});
