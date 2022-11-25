export interface PostAttributes {
  title: string;
  date: Date;
  slug: string;
}

export interface Post extends PostAttributes {
  html: string;
}
