import { forwardRef } from "react";

const DEFAULT_STYLES = "text-black dark:text-white";

export const ExternalLink = forwardRef<
  HTMLAnchorElement,
  JSX.IntrinsicElements["a"]
>(function ExternalLink(props, ref) {
  const { className, ...rest } = props;

  return (
    <a
      className={[className, DEFAULT_STYLES].filter(Boolean).join(" ")}
      ref={ref}
      {...rest}
    >
      {props.children}
    </a>
  );
});
