import { Link } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import clsx from "clsx";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const GoBack = forwardRef<HTMLAnchorElement, Omit<RemixLinkProps, "to">>(
  function GoBack(props, ref) {
    return (
      <Link
        className={twMerge(
          clsx(
            "text-black dark:text-white text-3xl no-underline opacity-50 hover:opacity-75 hover:border-b border-b-black dark:border-b-white transition-opacity",
          ),
          props.className,
        )}
        ref={ref}
        relative="path"
        to=".."
      >
        cd ..
      </Link>
    );
  },
);

export default GoBack;
