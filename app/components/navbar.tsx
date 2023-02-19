import { useLocation } from "@remix-run/react";

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
        <h1 className="text-2xl font-medium text-zinc-200">
          {getNavbarTitle(pathname)}
        </h1>
      </nav>
    </div>
  );
}

export default Navbar;
