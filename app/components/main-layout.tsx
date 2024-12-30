import clsx from "clsx";
import type { JSX } from "react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const MainLayout = forwardRef<HTMLElement, JSX.IntrinsicElements["main"]>(
  function MainLayout({ className, ...rest }, ref) {
    return (
      <div className="flex-1">
        <main
          className={twMerge(
            clsx("mx-auto px-8 sm:max-w-5xl md:max-w-7xl mb-10", className),
          )}
          ref={ref}
          {...rest}
        >
          {rest.children}
        </main>
      </div>
    );
  },
);

export default MainLayout;
