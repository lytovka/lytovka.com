import type { PropsWithChildren } from "react";
import { forwardRef } from "react";

const MainLayout = forwardRef<
  PropsWithChildren<HTMLElement>,
  JSX.IntrinsicElements["main"]
>(function MainLayout(props, ref) {
  return (
    <div className="flex-1 fixed top-32 bottom-32 left-0 w-full overflow-y-auto">
      <main
        className="mx-auto px-8 sm:max-w-5xl md:max-w-7xl mb-10"
        ref={ref}
        {...props}
      >
        {props.children}
      </main>
    </div>
  );
});

export default MainLayout;
