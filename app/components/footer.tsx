import clsx from "clsx";
import { ExternalLink } from "./external-link";
import { INSTAGRAM_LINK, TELEGRAM_LINK, GITHUB_LINK } from "~/constants";

interface Props {
  isHomepage?: boolean;
}

function Footer({ isHomepage }: Props) {
  return (
    <footer
      className={clsx("flex flex-col items-center py-9 text-xl", {
        "fixed bottom-0 left-7 right-7": true,
      })}
    >
      <div className="flex gap-4 text-zinc-200">
        <ExternalLink
          className="hover:opacity-75 transition-opacity z-30"
          href={GITHUB_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          GitHub
        </ExternalLink>
        <span className="text-zinc-300 dark:text-zinc-500 z-30">/</span>
        <ExternalLink
          className="hover:opacity-75 transition-opacity z-30"
          href={INSTAGRAM_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          Instagram
        </ExternalLink>
        <span className="text-zinc-300 dark:text-zinc-500 z-30">/</span>
        <ExternalLink
          className="hover:opacity-75 transition-opacity z-30"
          href={TELEGRAM_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          Telegram
        </ExternalLink>
      </div>
      <span className="text-stone-600 dark:text-stone-400 mt-2 z-30">
        MIT © Ivan Lytovka 2022-{new Date().getFullYear()}
      </span>
    </footer>
  );
}

export default Footer;
