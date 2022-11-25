import parseFrontMatter from "front-matter";
import fs from "fs/promises";
import { marked } from "marked";
import path from "path";
import * as build from "@remix-run/dev/server-build";

import type { Post, PostAttributes } from "~/typings/Post";

export async function getPost(slug: string): Promise<Post | null> {
  const source = await fs.readFile(
    path.join(process.env.PWD ?? "", "/posts", slug + ".md"),
    "utf-8"
  );
  const { attributes, body } = parseFrontMatter<PostAttributes>(
    source.toString()
  );
  const html = marked(body);

  return { html, ...attributes };
}
export async function getPosts() {
  const postsPath = await fs.readdir(
    path.join(process.env.PWD ?? "", "/posts"),
    {
      withFileTypes: true,
    }
  );

  const posts = await Promise.all(
    postsPath.map(async (dirent) => {
      const file = await fs.readFile(
        path.join(process.env.PWD ?? "", "/posts/", dirent.name)
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
