import { Link, useLocation } from "@remix-run/react";
import clsx from "clsx";

interface BreadcrumbProps {
  className?: string;
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  if (pathSegments.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx("flex items-center gap-2 text-lg mb-6", className)}
    >
      <Link
        className="text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white transition-colors"
        to="/"
      >
        ~
      </Link>
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <div className="flex items-center gap-2" key={path}>
            <span className="text-stone-400 dark:text-stone-600">/</span>
            {isLast ? (
              <span className="font-semibold text-black dark:text-white">
                {segment}
              </span>
            ) : (
              <Link
                className="text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white transition-colors"
                to={path}
              >
                {segment}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
