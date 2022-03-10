export type Post = {
  html: string;
  slug: string;
  title: string;
  date?: Date;
};

export type PostMarkdownMetadata = {
  title: string;
  description: string;
  iconSrc: string;
  date: Date;
};
