import { useLocation, useMatches } from "@remix-run/react";
import type { Note } from "~/server/markdown.server";
import { H1 } from "./typography";
import { useTheme } from "~/providers/theme";

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
  const [_, setTheme] = useTheme();
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
        <div className="justify-self-center">
          <button
            onClick={() => {
              setTheme((previousTheme) =>
                previousTheme == "dark" ? "light" : "dark"
              );
            }}
          >
            switch
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
