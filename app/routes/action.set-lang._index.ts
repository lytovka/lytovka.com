import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { getLanguageSession } from "~/server/language.server";

export const action = async ({ request }: ActionArgs) => {
  const [languageSession, formData] = await Promise.all([
    getLanguageSession(request),
    request.formData(),
  ]);

  const lang = formData.get("lang");

  if (!lang) {
    return json({ success: false, message: `Invalid lang value: ${lang}` });
  }

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await languageSession.commitSession(),
      },
    },
  );
};
