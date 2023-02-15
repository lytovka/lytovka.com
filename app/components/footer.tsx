import { ExternalLink } from "./external-link";
import { INSTAGRAM_LINK, TELEGRAM_LINK, GITHUB_LINK } from "~/constants";

function Footer() {
  return (
    <footer className="py-9 text-xl flex justify-center gap-4 z-30">
      <ExternalLink
        className="text-zinc-200 hover:opacity-75 transition-opacity"
        href={GITHUB_LINK}
        rel="noreferrer noopener"
        target="_blank"
      >
        GitHub
      </ExternalLink>
      <span className="text-white">/</span>
      <ExternalLink
        className="text-zinc-200 hover:opacity-75 transition-opacity"
        href={INSTAGRAM_LINK}
        rel="noreferrer noopener"
        target="_blank"
      >
        Instagram
      </ExternalLink>
      <span className="text-white">/</span>
      <ExternalLink
        className="text-zinc-200 hover:opacity-75 transition-opacity"
        href={TELEGRAM_LINK}
        rel="noreferrer noopener"
        target="_blank"
      >
        Telegram
      </ExternalLink>
    </footer>
  );
}

export default Footer;
