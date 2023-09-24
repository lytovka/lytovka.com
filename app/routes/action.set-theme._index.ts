import { json, redirect } from "@vercel/remix";
import type { ActionFunctionArgs } from "@vercel/remix";
import { getThemeSession, isTheme } from "~/server/theme.server.ts";

export const action = async ({ request }: ActionFunctionArgs) => {
  const [themeSession, formData] = await Promise.all([
    getThemeSession(request),
    request.formData(),
  ]);

  const theme = formData.get("theme");

  if (!isTheme(theme)) {
    return json({ success: false, message: `Invalid theme value: ${theme}` });
  }

  themeSession.setTheme(theme);

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await themeSession.commitSession(),
      },
    },
  );
};

export const loader = () => redirect("/", { status: 404 });
