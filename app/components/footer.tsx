import { ExternalLink } from "./external-link.tsx";
import {
  INSTAGRAM_LINK,
  TELEGRAM_LINK,
  GITHUB_LINK,
} from "~/constants/index.ts";

function Footer() {
  return (
    <footer className="flex flex-col items-center py-10 text-xl">
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
      <span className="text-stone-600 dark:text-stone-400 mt-6 z-30">
        <ExternalLink
          className="hover:opacity-75 transition-opacity underline text-stone-600 dark:text-stone-400"
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          rel="noreferrer"
          target="_blank"
        >
          CC BY-NC-SA 4.0
        </ExternalLink>{" "}
        2022-{new Date().getFullYear()} © Ivan Lytovka
      </span>
    </footer>
  );
}

export default Footer;
