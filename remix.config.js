/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  future: {
    v2_routeConvention: true,
    v2_meta: true,
    v2_errorBoundary: true,
  },
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  devServerPort: 8002,
  ignoredRouteFiles: ["**/.*"],
  publicPath: "/build/",
  serverBuildPath: "api/index.js",
  serverDependenciesToBundle: [/^marked/],
  serverMainFields: ["main", "module"],
};
