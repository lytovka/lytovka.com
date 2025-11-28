import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Breadcrumb } from "~/components/breadcrumb.tsx";

interface MainLayoutProps extends ComponentPropsWithoutRef<"main"> {
  showBreadcrumb?: boolean;
}

const MainLayout = forwardRef<HTMLElement, MainLayoutProps>(function MainLayout(
  { className, showBreadcrumb = true, ...rest },
  ref,
) {
  return (
    <div className="flex-1">
      <main
        className={twMerge(
          clsx("mx-auto px-8 sm:max-w-5xl md:max-w-7xl mb-10 mt-8", className),
        )}
        id="main-content"
        ref={ref}
        {...rest}
      >
        {showBreadcrumb ? <Breadcrumb /> : null}
        {rest.children}
      </main>
    </div>
  );
});

export default MainLayout;
