import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { getThemeSession, isTheme } from "~/server/theme.server";

export const action = async ({ request }: ActionArgs) => {
  const themeSession = await getThemeSession(request);
  const requestText = await request.formData();
  const theme = requestText.get("theme");

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
    }
  );
};

export const loader = () => redirect("/", { status: 404 });
