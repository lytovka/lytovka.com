import { APP_BASE_URL, CLOUDINARY_BASE_URL } from "~/constants";

type SocialMeta = {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  url: string;
};

const featureImageKeys = {
  homepage: "l_folder-documents",
  intro: "l_file-text",
  collectibles: "l_folder-music",
  notes: "l_folder-documents",
  note: "l_file-text",
} as const;

// cloudinary needs double-encoding
function doubleEncode(s: string) {
  return encodeURIComponent(encodeURIComponent(s));
}

export function getMetadataUrl(requestInfo?: { origin: string; path: string }) {
  const rawUrl = `${requestInfo?.origin ?? APP_BASE_URL}${
    requestInfo?.path ?? ""
  }`;
  const final = rawUrl.replace(/\/$/, ""); // remove trailing slash, if exists

  return final;
}

export function getPreviewUrl(url: string) {
  return url.replace(/^https:\/\//, "");
}

export function getSocialImagePreview({
  title,
  url,
  featuredImage: imgKey,
}: {
  title?: string;
  url: string;
  featuredImage?: keyof typeof featureImageKeys;
}) {
  const encodedTitle = title ? doubleEncode(title) : null;
  const encodedUrl = doubleEncode(url);
  const encodedImage = doubleEncode(featureImageKeys[imgKey ?? "homepage"]);

  const imageSection = `${encodedImage}/c_scale,h_350,w_350/fl_layer_apply,g_center`;

  const titleSection = encodedTitle
    ? `co_rgb:FFFFFF,l_text:arial_64_normal_left:${encodedTitle}/fl_layer_apply,g_center,y_220`
    : null;

  const ivanNameSection =
    "co_rgb:A1A1AA,l_text:arial_88_normal_left:Ivan%20Lytovka/fl_layer_apply,g_south_west,x_100,y_250";

  const urlSection = `co_rgb:A1A1AA,l_text:arial_64_normal_left:${encodedUrl}/fl_layer_apply,g_south_west,x_100,y_180`;

  return [
    CLOUDINARY_BASE_URL,
    "image/upload",
    imageSection,
    titleSection,
    ivanNameSection,
    urlSection,
    "background.jpg", // background that's uploaded to cloudinary
  ]
    .filter(Boolean)
    .join("/");
}

export function getSocialMetas({
  title = "The Ivan Lytovka Site",
  description = "A public corner where I meditatively build stuff using trendy solutions.",
  keywords = "",
  url,
  image = getSocialImagePreview({ title, url }),
}: SocialMeta) {
  return [
    { title },
    { name: "description", content: description },
    { name: "image", content: image },
    { name: "keywords", content: keywords },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image:alt", content: title },
  ];
}
