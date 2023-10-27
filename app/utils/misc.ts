export function getHostUrl(request: Request) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("No host header found");
  }
  const schema = host.includes("localhost") ? "http" : "https";

  return `${schema}://${host}`;
}

export function formatPlural(
  value: number,
  singularForm: string,
  pluralForm: string,
) {
  const pluralRules = new Intl.PluralRules();

  // Determine the plural category based on the value
  const pluralCategory = pluralRules.select(value);

  // Format the value with the appropriate plural form
  const formattedValue = new Intl.NumberFormat().format(value);

  // Return the formatted plural string
  if (pluralCategory === "one") {
    return `${formattedValue} ${singularForm}`;
  } else {
    return `${formattedValue} ${pluralForm}`;
  }
}

export function invariantResponse(
  condition: boolean,
  message: string | (() => string),
  responseConfig?: ResponseInit,
): asserts condition {
  if (!condition) {
    throw new Response(typeof message === "function" ? message() : message, {
      status: 400,
      ...responseConfig,
    });
  }
}
