/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  tailwind: true,
  postcss: true,
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  assetsBuildDirectory: "public/build",
  ignoredRouteFiles: ["**/.*"],
  publicPath: "/build/",
  serverBuildPath: "build/index.js",
  serverDependenciesToBundle: [/^marked/],
  serverModuleFormat: "cjs",
};
