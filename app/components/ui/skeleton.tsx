import type { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-zink-100 dark:bg-gray-600",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
