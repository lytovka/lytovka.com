import type { ReactNode } from "react";
import { H1 } from "~/components/typography.tsx";

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={className}>
      <H1 className="font-bold text-3xl md:text-4xl">{title}</H1>
      {subtitle && (
        <p className="text-stone-600 dark:text-stone-400 text-base md:text-lg mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
