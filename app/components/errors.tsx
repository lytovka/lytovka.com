import { useMatches } from "@remix-run/react";
import { H1, Paragraph } from "./typography.tsx";

type ErrorPageProps = {
  title: string;
  subtitle: string;
};

function ErrorPage({ title, subtitle }: ErrorPageProps) {
  return (
    <main className="h-full flex items-center justify-center">
      <div className="flex items-center justify-center flex-col gap-3">
        <H1 className="text-center">{title}</H1>
        <Paragraph className="text-center">{subtitle}</Paragraph>
      </div>
    </main>
  );
}

export function FourOhFour() {
  const matches = useMatches();
  const last = matches[matches.length - 1].pathname;

  return (
    <ErrorPage
      subtitle={`"${last}" doesn't exist here. Maybe it's hiding, or maybe you typo'd 🤔`}
      title="This is awkward..."
    />
  );
}

export function ServerError({
  title = "500. No bueno.",
  subtitle = "Please try refreshing the page.",
}: Partial<ErrorPageProps>) {
  return <ErrorPage subtitle={subtitle} title={title} />;
}
