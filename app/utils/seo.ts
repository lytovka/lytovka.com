import { APP_BASE_URL, CLOUDINARY_BASE_URL } from "~/constants";

type SocialMeta = {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  url: string;
};

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

export function getSocialImagePreview({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const encodedTitle = doubleEncode(title);
  const encodedUrl = doubleEncode(url);

  const imageSection =
    "l_notes_folder/c_scale,h_400,w_400/fl_layer_apply,g_center";

  const titleSection = `co_rgb:FFFFFF,l_text:arial_64_normal_left:${encodedTitle}/fl_layer_apply,g_center,y_220`;

  const ivanNameSection =
    "co_rgb:A1A1AA,l_text:arial_64_normal_left:Ivan%20Lytovka/fl_layer_apply,g_south_west,x_100,y_220";

  const urlSection = `co_rgb:A1A1AA,l_text:arial_42_normal_left:${encodedUrl}/fl_layer_apply,g_south_west,x_100,y_170`;

  return [
    CLOUDINARY_BASE_URL,
    "image/upload",
    imageSection,
    titleSection,
    ivanNameSection,
    urlSection,
    "background.jpg", // background that's uploaded to cloudinary
  ].join("/");
}

export function getSocialMetas({
  title = "The Ivan Lytovka Site",
  description = "A public corner where I meditatively build stuff using trendy solutions.",
  keywords = "",
  url,
  image = getSocialImagePreview({ title, url }),
}: SocialMeta) {
  return {
    title,
    description,
    image,
    keywords,
    url,
    "og:title": title,
    "og:description": description,
    "og:image": image,
    "og:url": url,
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": image,
    "twitter:card": "summary_large_image",
    "twitter:image:alt": title,
  };
}
