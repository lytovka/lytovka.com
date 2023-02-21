import { ExternalLink } from "./external-link";
import { INSTAGRAM_LINK, TELEGRAM_LINK, GITHUB_LINK } from "~/constants";

function Footer() {
  return (
    <footer className="flex flex-col items-center py-9 text-xl z-30">
      <div className="flex gap-4 text-zinc-200">
        <ExternalLink
          className="hover:opacity-75 transition-opacity"
          href={GITHUB_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          GitHub
        </ExternalLink>
        <span>/</span>
        <ExternalLink
          className="hover:opacity-75 transition-opacity"
          href={INSTAGRAM_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          Instagram
        </ExternalLink>
        <span>/</span>
        <ExternalLink
          className="hover:opacity-75 transition-opacity"
          href={TELEGRAM_LINK}
          rel="noreferrer noopener"
          target="_blank"
        >
          Telegram
        </ExternalLink>
      </div>
      <div className="mt-2 text-zinc-400">
        MIT © Ivan Lytovka 2022-{new Date().getFullYear()}
      </div>
    </footer>
  );
}

export default Footer;
