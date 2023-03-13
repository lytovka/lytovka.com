import { forwardRef } from "react";

export const ExternalLink = forwardRef<
  HTMLAnchorElement,
  JSX.IntrinsicElements["a"]
>(function ExternalLink(props, ref) {
  return (
    <a className="text-white" ref={ref} {...props}>
      {props.children}
    </a>
  );
});
