export type Post = {
  html: string;
  slug: string;
  metadata: PostMarkdownMetadata;
};

export type PostMarkdownMetadata = {
  title: string;
  description: string;
  iconSrc: string;
  date: Date;
};
