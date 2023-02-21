import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { forwardRef } from "react";

type ExtraProps = {
  homepage?: boolean;
};

const MainLayout = forwardRef<
  PropsWithChildren<HTMLElement>,
  ExtraProps & JSX.IntrinsicElements["main"]
>(function MainLayout(props, ref) {
  const { homepage = false, ...rest } = props;

  return (
    <div className="flex-1">
      <main
        className={clsx({
          "mx-auto px-8 sm:max-w-5xl md:max-w-7xl mb-10": !homepage,
        })}
        ref={ref}
        {...rest}
      >
        {props.children}
      </main>
    </div>
  );
});

export default MainLayout;
