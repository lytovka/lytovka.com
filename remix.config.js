const { createRoutesFromFolders } = require("@remix-run/v1-route-convention");

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  future: {
    v2_meta: true,
    v2_errorBoundary: true,
  },
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  serverBuildPath: "build/index.js",
  publicPath: "/build/",
  devServerPort: 8002,
  serverDependenciesToBundle: [/^marked/],
  serverMainFields: ["main", "module"],
  routes(defineRoutes) {
    return createRoutesFromFolders(defineRoutes);
  },
};
