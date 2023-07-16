export default {
  debug: process.env.NODE_ENV !== "production",
  fallbackLng: "en",
  supportedLngs: ["en", "ru"],
  defaultNS: "common",
  react: { useSuspense: false },
};
