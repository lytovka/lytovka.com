import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { createElement } from "react";

type FontScale = "lg" | "md" | "sm";
type TypographyTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

const fontSizes: Record<TypographyTag, Record<FontScale, string>> = {
  h1: {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  },
  h2: {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  },
  h3: {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  },
  h4: {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  },
  h5: {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  },
  h6: {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  },
  p: {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  },
};

const fontColors = {
  primary: "text-zinc-200",
  secondary: "text-stone-300",
};

type TypographyProps = HTMLAttributes<HTMLElement> & {
  tag: TypographyTag;
  variant?: keyof typeof fontColors;
  size?: FontScale;
  as?: string;
  className?: string;
};

function Typography({
  variant = "primary",
  as,
  size,
  tag,
  className,
  ...rest
}: TypographyProps) {
  const elementTag = as ?? tag;
  const actualSize = size ?? "md";

  return createElement(elementTag, {
    className: clsx(fontSizes[tag][actualSize], fontColors[variant], className),
    ...rest,
  });
}

type HeadingProps = Omit<TypographyProps, "tag">;
type ParagraphProps = Omit<TypographyProps, "tag">;

function H1(props: HeadingProps) {
  return <Typography {...props} tag="h1" />;
}

function H2(props: HeadingProps) {
  return <Typography {...props} tag="h2" />;
}

function H3(props: HeadingProps) {
  return <Typography {...props} tag="h3" />;
}

function H4(props: HeadingProps) {
  return <Typography {...props} tag="h4" />;
}

function H5(props: HeadingProps) {
  return <Typography {...props} tag="h5" />;
}

function H6(props: HeadingProps) {
  return <Typography {...props} tag="h6" />;
}

function Paragraph(props: ParagraphProps) {
  return <Typography {...props} tag="p" />;
}

export { H1, H2, H3, H4, H5, H6, Paragraph };
