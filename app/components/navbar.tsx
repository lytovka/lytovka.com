import { useLocation, useMatches } from "@remix-run/react";
import type { Note } from "~/server/markdown.server";
import { H1 } from "./typography";
import { useTheme } from "~/providers/theme";
import { DarkModeIcon, LightModeIcon } from "~/components/icons";

const getNavbarTitle = (path: string, noteTitle?: string) => {
  if (noteTitle) {
    return noteTitle;
  }

  switch (path) {
    case "/":
      return "Ivan's docs";
    case "/notes":
      return "Notes";
    case "/intro":
      return "Introduction";
    case "/collectibles":
      return "Collectibles";
    default:
      return "Ivan's docs";
  }
};

function Navbar() {
  const [theme, setTheme] = useTheme();
  const { pathname } = useLocation();
  const matches = useMatches();
  //TODO: figure out if I want to have a dynamic title for the nabvar.
  const noteMatch = matches.find((m) => m.id === "routes/notes/$slug") as
    | {
        data: Note;
      }
    | undefined;

  return (
    <div className="px-5 py-9">
      <nav className="grid grid-cols-3 items-center">
        <div />
        <H1 className="justify-self-center z-30" size="sm">
          {getNavbarTitle(pathname, noteMatch?.data.attributes.title)}
        </H1>
        <div className="flex justify-center">
          <button
            className="group p-2 z-30 border rounded-full border-gray-600 dark:border-gray-300 hover:opacity-75 transition-opacity"
            onClick={() => {
              setTheme((previousTheme) =>
                previousTheme == "dark" ? "light" : "dark"
              );
            }}
          >
            <div className="group-hover:opacity-75">
              {theme === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
