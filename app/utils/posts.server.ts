import { PrismaClient } from "@prisma/client";
import { marked } from "marked";
import { MarkdownPost, Post, PostUpdate, UpdatePost } from "~/types/Post";
import path from "path";
import fs from "fs/promises";
import parseMD from "parse-md";

type Metadata = {
  title: string;
  date: string;
};

// The Prisma part is irrelevant for now. I added it for fun.
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
  console.log({ postId, post });
  await prismaWrite.posts.update({ where: { id: postId }, data: post });
}

// markdown parse

const isMetadataType = (meta: unknown): meta is Metadata => {
  return (
    typeof meta === "object" &&
    meta !== null &&
    "title" in meta &&
    "date" in meta
  );
};

const postsTopFolderPath = path.join(process.cwd(), `app/posts`);
const buildPath = (...p: Array<string>) => path.join(process.cwd(), ...p);

export async function getMarkdownPostsPreview() {
  const dir = await fs.readdir(postsTopFolderPath);
  const posts = await Promise.all(
    dir.map(async (postFileName) => {
      const postFilePath = buildPath("app/posts", postFileName);
      const fileContent = await fs.readFile(postFilePath);
      const { metadata } = parseMD(fileContent.toString());
      if (!isMetadataType(metadata)) return null;
      return {
        title: metadata.title,
        slug: postFileName.replace(/\.mdx?$/, ""),
      };
    })
  );
  return posts.filter((post) => post !== null);
}

export async function parseMarkdownPost(
  slug: string
): Promise<MarkdownPost | null> {
  const filePath = buildPath("app/posts", `${slug}.md`);
  const fileContent = await fs.readFile(filePath);
  const { metadata, content } = parseMD(fileContent.toString());
  const html = marked(content);
  if (!isMetadataType(metadata)) return null;
  return { html, slug, title: metadata.title, date: metadata.date };
}
