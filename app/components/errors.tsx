import { useMatches } from "@remix-run/react";
import { H1, Paragraph } from "./typography.tsx";

type ErrorPageProps = {
  title: string;
  subtitle: string;
};

function ErrorPage({ title, subtitle }: ErrorPageProps) {
  return (
    <main className="h-screen">
      <div className="h-full flex items-center justify-center flex-col gap-3">
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
      subtitle={`"${last}" is not a page on lytovka.com.`}
      title="Yikes, you hit that 404."
    />
  );
}

export function ServerError({
  title = "500. No bueno.",
  subtitle = "Please try refreshing the page.",
}: Partial<ErrorPageProps>) {
  return <ErrorPage subtitle={subtitle} title={title} />;
}
