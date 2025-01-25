import type { JSX } from "react";
import { forwardRef } from "react";

const DEFAULT_STYLES = "text-black dark:text-white";

export const ExternalLink = forwardRef<
  HTMLAnchorElement,
  JSX.IntrinsicElements["a"]
>(function ExternalLink(props, ref) {
  const { className, ...rest } = props;

  return (
    <a className={className ? className : DEFAULT_STYLES} ref={ref} {...rest}>
      {props.children}
    </a>
  );
});
