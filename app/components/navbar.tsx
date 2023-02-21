import { useLocation, useMatches } from "@remix-run/react";
import type { Note } from "~/server/markdown.server";
import { H1 } from "./typography";

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
    <div className="z-30 px-5 py-9">
      <nav className="flex justify-center">
        <H1>{getNavbarTitle(pathname, noteMatch?.data.attributes.title)}</H1>
      </nav>
    </div>
  );
}

export default Navbar;
