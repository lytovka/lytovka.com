export interface PostAttributes {
  title: string;
  date: string;
  slug: string;
}

export interface Post extends PostAttributes {
  html: string;
}
