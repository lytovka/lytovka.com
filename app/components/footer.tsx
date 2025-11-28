import { ExternalLink } from "./external-link.tsx";
import {
  INSTAGRAM_LINK,
  TELEGRAM_LINK,
  GITHUB_LINK,
} from "~/constants/index.ts";

const footerLinkClasses =
  "hover:opacity-75 transition-opacity z-30 text-black dark:text-white text-base md:text-xl";

function Footer() {
  return (
    <footer className="flex flex-col items-center py-10 px-8 text-xl border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-zinc-200">
        <ExternalLink
          className={footerLinkClasses}
          href={GITHUB_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          GitHub
        </ExternalLink>
        <span className="text-zinc-300 dark:text-zinc-500 z-30">/</span>
        <ExternalLink
          className={footerLinkClasses}
          href={INSTAGRAM_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          Instagram
        </ExternalLink>
        <span className="text-zinc-300 dark:text-zinc-500 z-30">/</span>
        <ExternalLink
          className={footerLinkClasses}
          href={TELEGRAM_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          Telegram
        </ExternalLink>
      </div>
      <span className="text-stone-600 dark:text-stone-400 mt-6 z-30 text-center text-base md:text-xl">
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
