import { themes, useTheme } from "~/providers/theme.tsx";
import { DarkModeIcon, LightModeIcon } from "~/components/icons.tsx";
import { Link } from "@remix-run/react";

const ThemeToggle = () => {
  const [, setTheme] = useTheme();

  return (
    <button
      className="group p-2 z-30 border rounded-full border-gray-600 dark:border-gray-300 hover:opacity-75 transition-opacity overflow-hidden"
      onClick={() => {
        setTheme((previousTheme) =>
          previousTheme == "dark" ? themes.LIGHT : themes.DARK,
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

function Navbar() {
  return (
    <div className="py-9">
      <nav className="flex justify-between items-center sm:max-w-5xl md:max-w-7xl mx-auto px-8">
        <div className="flex justify-start h-10 w-10 md:h-8 md:w-8" />
        <Link
          className="justify-self-center z-30 text-black dark:text-white text-2xl hover:opacity-75 hover:transition-opacity"
          to="/"
        >
          Ivan Lytovka
        </Link>
        <ThemeToggle />
      </nav>
    </div>
  );
}

export default Navbar;
