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
  pluralForm: string
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
