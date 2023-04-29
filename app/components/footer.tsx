import { ExternalLink } from "./external-link";
import { INSTAGRAM_LINK, TELEGRAM_LINK, GITHUB_LINK } from "~/constants";
import { Paragraph } from "./typography";

function Footer() {
  return (
    <footer className="flex flex-col items-center py-9 text-xl">
      <div className="flex gap-4 text-zinc-200">
        <ExternalLink
          className="hover:opacity-75 transition-opacity z-30"
          href={GITHUB_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          GitHub
        </ExternalLink>
        <span className="text-black dark:text-white z-30">/</span>
        <ExternalLink
          className="hover:opacity-75 transition-opacity z-30"
          href={INSTAGRAM_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          Instagram
        </ExternalLink>
        <span className="text-black dark:text-white z-30">/</span>
        <ExternalLink
          className="hover:opacity-75 transition-opacity z-30"
          href={TELEGRAM_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          Telegram
        </ExternalLink>
      </div>
      <Paragraph className="text-stone-500 dark:text-stone-400 mt-2 z-30">
        MIT © Ivan Lytovka 2022-{new Date().getFullYear()}
      </Paragraph>
    </footer>
  );
}

export default Footer;
