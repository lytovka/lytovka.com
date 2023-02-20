import { useLocation } from "@remix-run/react";
import { H1 } from "./typography";

const getNavbarTitle = (path: string) => {
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

  return (
    <div className="z-30 px-5 py-9">
      <nav className="flex justify-center">
        <H1>{getNavbarTitle(pathname)}</H1>
      </nav>
    </div>
  );
}

export default Navbar;
