import parseFrontMatter from "front-matter";
import fs from "fs/promises";
import { marked } from "marked";
import path from "path";

import type { Post, PostAttributes } from "~/typings/Post";

export async function getPost(slug: string): Promise<Post | null> {
  const source = await fs.readFile(
    path.join(`${__dirname}/../posts`, slug + ".md"),
    "utf-8"
  );
  const { attributes, body } = parseFrontMatter<PostAttributes>(
    source.toString()
  );
  const html = marked(body);

  return { html, ...attributes };
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
      const { attributes } = parseFrontMatter<PostAttributes>(file.toString());
      return {
        slug: dirent.name.replace(/\.md/, ""),
        title: attributes.title,
      };
    })
  );
  return posts;
}
