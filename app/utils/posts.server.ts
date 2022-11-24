import { marked } from "marked";
import { prisma } from "~/db.server";

import type { Post } from "~/typings/Post";

export async function getPosts() {
  const allPosts = await prisma.posts.findMany();
  return allPosts;
}

export async function getPost(slug: string): Promise<Post | null> {
  const foundPost = await prisma.posts.findFirst({
    where: {
      slug,
    },
  });

  if (!foundPost) return null;

  const title = foundPost.title;
  const html = marked(foundPost.markdown);

  return { slug, title, html, date: foundPost.date };
}
