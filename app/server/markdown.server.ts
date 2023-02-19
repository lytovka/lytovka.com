import matter from "gray-matter";
import fs from "fs/promises";
import { marked } from "marked";
import path from "path";

//TODO: This is a hack to get the root path for the app for diff environments (development, CI, and deploy preview). Need to find a better way.
const root =
  process.env.CI === "true"
    ? `${path.resolve()}/app`
    : process.env.NODE_ENV === "test"
    ? `${__dirname}/..`
    : `${__dirname}/../app`;

type Metadata = {
  title: string;
  date: string;
  slug: string;
};

// This method is separate from other fetchers because of additional split operation.
export const getIntroFile = async (): Promise<{
  short: string;
  extended: string;
}> => {
  const CONTENT = `${root}/markdown`;
  const pathToIntro = `${CONTENT}/intro.md`;
  const file = (await fs.readFile(pathToIntro)).toString();
  const { content } = matter(file);
  const [short, extended] = marked(content).split("<hr>");

  return { short, extended };
};

export const getSlugContent = async (
  slug: string
): Promise<{
  attributes: Metadata;
  body: string;
}> => {
  const CONTENT = `${root}/markdown`;
  const realSlug = slug.replace(/\.md$/, "");
  const file = (
    await fs.readFile(`${CONTENT}/notes/${realSlug}.md`)
  ).toString();
  const { data, content } = matter(file);
  const html = marked(content);

  return { attributes: data as Metadata, body: html };
};

const getAllNoteSlugs = async (): Promise<Array<string>> => {
  const CONTENT = `${root}/markdown`;
  const res = fs.readdir(`${CONTENT}/notes`);

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
