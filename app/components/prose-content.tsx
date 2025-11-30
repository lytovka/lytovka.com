import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

interface ProseContentProps extends ComponentPropsWithoutRef<"article"> {
  as?: "article" | "div";
}

export const ProseContent = forwardRef<HTMLDivElement, ProseContentProps>(
  function ProseContent({ as = "article", className, ...props }, ref) {
    const Component = as;
    
    return (
      <Component
        className={clsx("prose max-w-none text-xl/[2.5rem] md:text-2xl/[2.5rem]", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
