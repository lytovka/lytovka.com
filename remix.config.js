const { createRoutesFromFolders } = require("@remix-run/v1-route-convention");

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  future: {
    v2_meta: true,
    v2_errorBoundary: true,
  },
  serverBuildTarget: "vercel",
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  // eslint-disable-next-line no-undef
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: [".*"],
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  devServerPort: 8002,
  publicPath: "/build/",
  serverBuildPath: "api/index.js",
  serverDependenciesToBundle: [/^marked/],
  serverMainFields: ["main", "module"],
  routes(defineRoutes) {
    return createRoutesFromFolders(defineRoutes);
  },
};
