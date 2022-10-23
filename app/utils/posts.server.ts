import { PrismaClient } from "@prisma/client";
import { marked } from "marked";
import type { Post, PostUpdate, UpdatePost } from "~/typings/Post";

declare global {
  var prismaRead: ReturnType<typeof getClient> | undefined;
  var prismaWrite: ReturnType<typeof getClient> | undefined;
}

const prismaRead = global.prismaRead ?? (global.prismaRead = getClient());
const prismaWrite = global.prismaWrite ?? (global.prismaWrite = getClient());

function getClient(): PrismaClient {
  const client = new PrismaClient();
  void client.$connect();
  return client;
}

export async function getPosts() {
  const allPosts = await prismaRead.posts.findMany();
  return allPosts;
}

export async function getPost(slug: string): Promise<Post | null> {
  const foundPost = await prismaRead.posts.findFirst({
    where: {
      slug,
    },
  });

  if (!foundPost) return null;

  const title = foundPost.title;
  const html = marked(foundPost.markdown);

  return { slug, title, html, date: foundPost.date };
}

export async function getPostRaw(slug: string): Promise<PostUpdate | null> {
  const foundPost = await prismaRead.posts.findFirst({
    where: {
      slug,
    },
  });

  if (!foundPost) return null;

  return foundPost;
}

export async function editPost(postId: string, post: UpdatePost) {
  await prismaWrite.posts.update({ where: { id: postId }, data: post });
}
