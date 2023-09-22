/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  tailwind: true,
  postcss: true,
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  serverBuildPath: "build/index.js",
  publicPath: "/build/",
  serverDependenciesToBundle: [/^marked/],
};
