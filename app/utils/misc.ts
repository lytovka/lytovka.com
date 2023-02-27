export function getHostUrl(request: Request) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("No host header found");
  }
  const schema = host.includes("localhost") ? "http" : "https";

  return `${schema}://${host}`;
}
