import { PrismaClient } from "@prisma/client";
import { marked } from "marked";
import { Post } from "~/types/Post";

declare global {
  var prismaRead: ReturnType<typeof getClient> | undefined;
}

const prismaRead = global.prismaRead ?? (global.prismaRead = getClient());

function getClient(): PrismaClient {
  const client = new PrismaClient();
  void client.$connect();
  return client;
}

export async function getPosts() {
  const allPosts = await prismaRead.post.findMany();
  console.log(allPosts);
  return allPosts;
}

export async function getPost(slug: string): Promise<Post | null> {
  const foundSlug = await prismaRead.post.findFirst({
    where: {
      slug,
    },
  });

  if (!foundSlug) return null;

  const title = foundSlug.title;
  const html = marked(foundSlug.markdown);

  return { slug, title, html };
}
