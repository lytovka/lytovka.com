import { forwardRef } from "react";

const MainLayout = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function MainLayout(props, ref) {
    return (
      <div className="flex-1" ref={ref}>
        <main
          className="mx-auto px-8 sm:max-w-5xl md:max-w-7xl mb-10"
          {...props}
        >
          {props.children}
        </main>
      </div>
    );
  },
);

export default MainLayout;
