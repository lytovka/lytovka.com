import { createCookie } from "@remix-run/node";

export const langCookie = createCookie("lytovka-com-lang", {
  sameSite: "lax",
  path: "/",
});
