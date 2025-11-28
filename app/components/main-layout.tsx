import clsx from "clsx";
import type { JSX } from "react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Breadcrumb } from "~/components/breadcrumb.tsx";

interface MainLayoutProps extends JSX.IntrinsicElements["main"] {
  showBreadcrumb?: boolean;
}

const MainLayout = forwardRef<HTMLElement, MainLayoutProps>(
  function MainLayout({ className, showBreadcrumb = true, ...rest }, ref) {
    return (
      <div className="flex-1">
        <main
          id="main-content"
          className={twMerge(
            clsx("mx-auto px-8 sm:max-w-5xl md:max-w-7xl mb-10 mt-8", className),
          )}
          ref={ref}
          {...rest}
        >
          {showBreadcrumb && <Breadcrumb />}
          {rest.children}
        </main>
      </div>
    );
  },
);

export default MainLayout;
