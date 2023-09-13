import { forwardRef } from "react";

const MainLayout = forwardRef<HTMLElement, JSX.IntrinsicElements["main"]>(
  function MainLayout(props, ref) {
    return (
      <div className="flex-1">
        <main
          className="mx-auto px-8 sm:max-w-5xl md:max-w-7xl mb-10"
          ref={ref}
          {...props}
        >
          {props.children}
        </main>
      </div>
    );
  },
);

export default MainLayout;
