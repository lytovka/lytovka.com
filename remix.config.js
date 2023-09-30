/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  // tailwind: true,
  // postcss: true,
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  serverDependenciesToBundle: [/^marked/],
  // serverModuleFormat: "esm",
};
