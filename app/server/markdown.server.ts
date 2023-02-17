import matter from "gray-matter";
import fs from "fs/promises";
import { marked } from "marked";

type Metadata = {
  title: string;
  date: string;
  slug: string;
};

`${__dirname}/../app/markdown`;
const CONTENT = `${__dirname}/../app/markdown`;

// This method is separate from other fetchers because of additional split operation.
export const getIntroFile = async (): Promise<{
  short: string;
  extended: string;
}> => {
  const pathToIntro = `${CONTENT}/intro.md`;
  const file = (await fs.readFile(pathToIntro)).toString();
  const [short, extended] = matter(file).content.split("<hr>");

  return { short, extended };
};

export const getSlugContent = async (
  slug: string
): Promise<{
  attributes: Metadata;
  body: string;
}> => {
  const realSlug = slug.replace(/\.md$/, "");
  const path = `${CONTENT}/notes/${realSlug}.md`;
  const file = (await fs.readFile(path)).toString();
  // const { attributes, body } = fm<Metadata>(file);
  const { data, content } = matter(file);
  const html = marked(content);

  return { attributes: data as Metadata, body: html };
};

const getAllNoteSlugs = async (): Promise<Array<string>> => {
  const res = await fs.readdir(`${CONTENT}/notes`);

  return res;
};

export const fetchAllContent = async (): Promise<
  Array<{
    attributes: { date: string; title: string; slug: string };
    body: string;
  }>
> => {
  const slugs = await getAllNoteSlugs();
  const notes = await Promise.all(
    slugs.map(async (slug) => getSlugContent(slug))
  );

  return notes;
};
