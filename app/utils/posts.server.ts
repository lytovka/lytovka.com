import { marked } from "marked";

import { prisma } from "~/db.server";
import parseFrontMatter from "front-matter";
import type { Post } from "~/typings/Post";
import fs from "fs/promises";
import path from "path";

// export async function getPosts() {
//   const allPosts = await prisma.posts.findMany();
//   return allPosts;
// }

// export async function getPost(slug: string): Promise<Post | null> {
//   const foundPost = await prisma.posts.findFirst({
//     where: {
//       slug,
//     },
//   });

//   if (!foundPost) return null;

//   const title = foundPost.title;
//   const html = marked(foundPost.markdown);

//   return { slug, title, html, date: foundPost.date };
// }

export async function getPost(slug: string): Promise<Post | null> {
  const source = await fs.readFile(
    path.join(`${__dirname}/../posts`, slug + ".md"),
    "utf-8"
  );
  const { attributes, body } = parseFrontMatter(source.toString());
  const html = marked(body);

  // @ts-ignore
  return { slug, title: attributes.title, html, date: attributes.date };
}

export async function getPosts() {
  const postsPath = await fs.readdir(`${__dirname}/../posts`, {
    withFileTypes: true,
  });

  const posts = await Promise.all(
    postsPath.map(async (dirent) => {
      const file = await fs.readFile(
        path.join(`${__dirname}/../posts`, dirent.name)
      );
      const { attributes } = parseFrontMatter(file.toString());
      return {
        slug: dirent.name.replace(/\.md/, ""),
        //@ts-ignore
        title: attributes.title,
      };
    })
  );
  return posts;
}
