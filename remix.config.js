/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverBuildTarget: "vercel",
  ignoredRouteFiles: [".*"],
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  serverBuildPath: "api/_build",
  publicPath: "/build/",
  serverDependenciesToBundle: ["parse-md"],
};

