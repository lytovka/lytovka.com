import { PrismaClient } from "@prisma/client";
import { marked } from "marked";

import type { Post, PostUpdate, UpdatePost } from "~/typings/Post";

declare global {
  // eslint-disable-next-line
  var prismaRead: ReturnType<typeof getClient> | undefined;
  // eslint-disable-next-line
  var prismaWrite: ReturnType<typeof getClient> | undefined;
}

const prismaRead = global.prismaRead ?? (global.prismaRead = getClient());
const prismaWrite = global.prismaWrite ?? (global.prismaWrite = getClient());

function getClient(): PrismaClient {
  const client = new PrismaClient();
  void client.$connect();

  return client;
}

/**
 * @deprecated 
 */
export async function getPosts() {
  const allPosts = await prismaRead.posts.findMany();

  return allPosts;
}

/**
 * @deprecated 
 */
export async function getPost(slug: string): Promise<Post> {
  const foundPost = await prismaRead.posts.findFirst({
    where: {
      slug,
    },
  });

  if (!foundPost) throw new Response("Not found", { status: 404 });

  const title = foundPost.title;
  const html = marked(foundPost.markdown);

  return { slug, title, html, date: foundPost.date };
}

/**
 * @deprecated 
 */
export async function getPostRaw(slug: string): Promise<PostUpdate | null> {
  const foundPost = await prismaRead.posts.findFirst({
    where: {
      slug,
    },
  });

  if (!foundPost) return null;

  return foundPost;
}

/**
 * @deprecated 
 */
export async function editPost(postId: string, post: UpdatePost) {
  await prismaWrite.posts.update({ where: { id: postId }, data: post });
}
