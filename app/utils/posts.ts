import { Post, PostMarkdownMetadata } from "app/types/Post";
import path from "path";
import fs from "fs/promises";
import parseMD from "parse-md";
import { marked } from "marked";

function isValidMetadata(attributes: any): attributes is PostMarkdownMetadata {
  return attributes?.title && attributes?.description;
}

const postsDirPath = path.join(__dirname, "..", "app/posts");

export async function getPost(slug: string): Promise<Post | null> {
  const filepath = path.join(postsDirPath, slug + ".md");
  const file = await fs.readFile(filepath);
  const { metadata, content } = parseMD(file.toString());

  if (!isValidMetadata(metadata)) {
    return null;
  }

  const html = marked(content);

  return {
    slug,
    html,
    metadata,
  };
}

export async function getPosts(): Promise<Array<Post | null>> {
  const dir = await fs.readdir(postsDirPath);
  return Promise.all(
    dir.map(async (filename) => {
      const fileContent = await fs.readFile(path.join(postsDirPath, filename));
      const { metadata, content } = parseMD(fileContent.toString());

      if (!isValidMetadata(metadata)) {
        return null;
      }

      return {
        slug: filename.replace(/\.md$/, ""),
        html: content,
        metadata,
      };
    })
  );
}
