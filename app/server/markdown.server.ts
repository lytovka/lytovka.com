import { marked } from "marked";
import fm from "front-matter";
import fs from "fs/promises";

// This method is separate from other fetchers because of additional split operation.
export const getIntroFile = async (): Promise<{
  short: string;
  extended: string;
}> => {
  const pathToIntro = `${__dirname}/../app/markdown/intro.md`;
  const file = (await fs.readFile(pathToIntro)).toString();
  const [short, extended] = marked(file).split("<hr>");

  return { short, extended };
};

export const getSlugContent = async (
  slug: string
): Promise<{
  attributes: { date: string; title: string; slug: string };
  body: string;
}> => {
  const realSlug = slug.replace(/\.md$/, "");
  const path = `${__dirname}/../app/markdown/notes/${realSlug}.md`;
  const file = (await fs.readFile(path)).toString();
  const { attributes, body } = fm<{
    title: string;
    date: string;
    slug: string;
  }>(file);
  const html = marked(body);

  return { attributes, body: html };
};

const getAllNoteSlugs = async (): Promise<Array<string>> => {
  const res = await fs.readdir(`${__dirname}/../app/markdown/notes`);

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
