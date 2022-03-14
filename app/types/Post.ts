import { posts } from "@prisma/client";

export type Post = {
  html: string;
  slug: string;
  title: string;
  date: Date;
};

export type PostUpdate = posts;

export type UpdatePost = {
  title: string;
  slug: string;
  markdown: string;
};

// Markdown post

export type MarkdownPost = {
  html: string;
  slug: string;
  title: string;
  date: string;
};
