import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/notes", label: "notes" },
  { href: "/vinyl", label: "vinyl" },
  { href: "/about", label: "about.txt" },
  { href: "/wishlist", label: "wishlist" },
];

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string): boolean => {
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        aria-label="Toggle menu"
        className="md:hidden p-2 z-30 border rounded border-gray-600 dark:border-gray-300 hover:opacity-75 transition-opacity"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span
            className={clsx(
              "block h-0.5 w-full bg-black dark:bg-white transition-transform",
              isOpen && "rotate-45 translate-y-2",
            )}
          />
          <span
            className={clsx(
              "block h-0.5 w-full bg-black dark:bg-white transition-opacity",
              isOpen && "opacity-0",
            )}
          />
          <span
            className={clsx(
              "block h-0.5 w-full bg-black dark:bg-white transition-transform",
              isOpen && "-rotate-45 -translate-y-2",
            )}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen ? (
        <button
          aria-label="Close menu"
          className="fixed inset-0 bg-black/50 z-40 md:hidden border-0 p-0 cursor-default"
          onClick={() => {
            setIsOpen(false);
          }}
        />
      ) : null}

      {/* Mobile Menu */}
      <nav
        className={clsx(
          "fixed top-0 right-0 h-full w-64 bg-main dark:bg-main-dark z-50 transform transition-transform duration-300 md:hidden border-l border-gray-300 dark:border-gray-700",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col p-8 gap-6 mt-20">
          {NAV_LINKS.map((link) => (
            <Link
              className={clsx(
                "text-2xl transition-opacity hover:opacity-75",
                isActive(link.href)
                  ? "text-black dark:text-white font-bold underline"
                  : "text-stone-600 dark:text-stone-400",
              )}
              key={link.href}
              to={link.href}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-6 items-center">
        {NAV_LINKS.map((link) => (
          <Link
            className={clsx(
              "text-xl transition-opacity hover:opacity-75",
              isActive(link.href)
                ? "text-black dark:text-white font-bold underline underline-offset-4"
                : "text-stone-600 dark:text-stone-400",
            )}
            key={link.href}
            to={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
