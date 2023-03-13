import clsx from "clsx";
import { forwardRef } from "react";
import Draggable from "react-draggable";
import { Link } from "@remix-run/react";
import type { PropsWithChildren } from "react";
import type { DraggableProps } from "react-draggable";
import type { Position } from "~/typings/Coordinates";
import { Paragraph } from "./typography";

type DraggableItemExtra = {
  defaultPosition: Position;
};

export const DraggableItem = forwardRef<
  HTMLDivElement,
  PropsWithChildren<
    DraggableItemExtra & Omit<Partial<DraggableProps>, "defaultPosition">
  >
>(function DraggableItem(props, _ref) {
  const {
    onDrag,
    onStart,
    onStop,
    defaultPosition,
    children,
    bounds,
    ...rest
  } = props;

  return (
    <Draggable
      bounds="body"
      defaultPosition={{ x: defaultPosition[0], y: defaultPosition[1] }}
      onDrag={onDrag}
      onStart={onStart}
      onStop={onStop}
      {...rest}
    >
      {children}
    </Draggable>
  );
});

type CustomProps = {
  isDraggable: boolean;
  imgSrc: string;
  href: string;
  title: string;
};

export const HomepageLink = forwardRef<
  HTMLDivElement,
  CustomProps & JSX.IntrinsicElements["div"]
>(function HomepageLink(props, ref) {
  const { isDraggable, imgSrc, href, title, ...rest } = props;

  return (
    <div
      {...rest}
      className={clsx("w-36 h-36 touch-none relative", {
        "pointer-events-none": isDraggable,
      })}
      ref={ref}
    >
      <Link
        className="flex flex-col items-center no-underline active:outline-dashed outline-1 outline-gray-500"
        prefetch="intent"
        to={href}
      >
        <img aria-label="folder" className="decoration-none" src={imgSrc} />
        <Paragraph className="text-center">{title}</Paragraph>
      </Link>
    </div>
  );
});
