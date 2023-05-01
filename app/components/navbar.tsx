import { useLocation, useMatches } from "@remix-run/react";
import type { Note } from "~/server/markdown.server";
import { H1 } from "./typography";
import { themes, useTheme } from "~/providers/theme";
import { DarkModeIcon, LightModeIcon } from "~/components/icons";

const ThemeToggle = () => {
  const [, setTheme] = useTheme();

  return (
    <button
      className="group p-2 z-30 border rounded-full border-gray-600 dark:border-gray-300 hover:opacity-75 transition-opacity overflow-hidden"
      onClick={() => {
        setTheme((previousTheme) =>
          previousTheme == "dark" ? themes.LIGHT : themes.DARK
        );
      }}
    >
      <div className="relative h-6 w-6 md:h-8 md:w-8">
        <span
          className="absolute inset-0 rotate-45 transform text-black transition duration-1000 dark:rotate-0 dark:text-white"
          style={{ transformOrigin: "50% 50px" }}
        >
          <DarkModeIcon />
        </span>
        <span
          className="absolute inset-0 rotate-0 transform text-black transition duration-1000 dark:-rotate-45 dark:text-white"
          style={{ transformOrigin: "50% 50px" }}
        >
          <LightModeIcon />
        </span>
      </div>
    </button>
  );
};

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
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
