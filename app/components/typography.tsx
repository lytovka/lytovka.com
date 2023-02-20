import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { createElement } from "react";

const fontSizes = {
  h1: "text-2xl font-medium",
  h2: "text-2xl font-medium",
  h3: "text-xl",
  h4: "text-lg",
  h5: "text-lg",
  h6: "text-lg",
  p: "text-2xl",
};

const fontColors = {
  primary: "text-zinc-200",
  secondary: "text-stone-300",
};

type TextProps = HTMLAttributes<HTMLElement> & {
  size: keyof typeof fontSizes;
  variant?: keyof typeof fontColors;
  as?: string;
  className?: string;
};

function Text({
  variant = "primary",
  as,
  size,
  className,
  ...rest
}: TextProps) {
  const tag = as ?? size;

  return createElement(tag, {
    className: clsx(fontSizes[size], fontColors[variant], className),
    ...rest,
  });
}

type HeadingProps = Omit<TextProps, "size">;

function H1(props: HeadingProps) {
  return <Text {...props} size="h1" />;
}

function H2(props: HeadingProps) {
  return <Text {...props} size="h2" />;
}

function H3(props: HeadingProps) {
  return <Text {...props} size="h3" />;
}

function H4(props: HeadingProps) {
  return <Text {...props} size="h4" />;
}

function H5(props: HeadingProps) {
  return <Text {...props} size="h5" />;
}

function H6(props: HeadingProps) {
  return <Text {...props} size="h6" />;
}

function Paragraph(props: HeadingProps) {
  return <Text {...props} size="p" />;
}

export { H1, H2, H3, H4, H5, H6, Paragraph };
