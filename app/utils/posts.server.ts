import { marked } from "marked";
import { prisma } from "~/db.server";
import { ParsedPost } from "~/typings/Post";

export async function getPosts() {
  return await prisma.post.findMany();
}

export async function getPost(slug: string): Promise<ParsedPost | null> {
  const post = await prisma.post.findFirst({
    where: {
      slug: slug,
    },
  });
  console.log(post);
  if (!post) return null;
  const html = marked(post.markdown);
  return { ...post, html };
}
