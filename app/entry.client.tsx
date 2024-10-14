import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import HelloWorld from "~/components/hello-world";

// initialize all web components
startTransition(() => {
  customElements.define("image-carousel", HelloWorld);
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
