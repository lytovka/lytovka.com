import type { Post } from "@prisma/client";

export interface ParsedPost extends Post {
  html: string;
};

export type PostUpdate = Post;

export type UpdatePost = {
  title: string;
  slug: string;
  markdown: string;
};
