import matter from "gray-matter";
import fs from "fs/promises";
import { marked } from "marked";
import path from "path";

//TODO: This is a hack to get the root path for the app for diff environments (test, CI, and deploy preview). Need to find a better way.
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

export type Note = {
  body: string;
  attributes: Metadata;
};

// This method is separate from other fetchers because of additional split operation.
export const getIntroFile = async (): Promise<{
  short: string;
  extended: string;
}> => {
  const pathToIntro = `${root}/markdown/intro.md`;
  const file = (await fs.readFile(pathToIntro)).toString();
  const { content } = matter(file);
  const [short, extended] = marked(content).split("<hr>");

  return { short, extended };
};

export const getSlugContent = async (slug: string): Promise<Note> => {
  const realSlug = slug.replace(/\.md$/, "");
  const file = (
    await fs.readFile(`${root}/markdown/notes/${realSlug}.md`)
  ).toString();
  const { data, content } = matter(file);
  const html = marked(content);

  return { attributes: data as Metadata, body: html };
};

const getAllNoteSlugs = async (): Promise<Array<string>> => {
  const res = fs.readdir(`${root}/markdown/notes`);

  return res;
};

export const fetchAllContent = async (): Promise<Array<Note>> => {
  const slugs = await getAllNoteSlugs();
  const notes = await Promise.all(
    slugs.map(async (slug) => getSlugContent(slug))
  );
  const sortedNotes = notes.sort(
    (a, b) =>
      new Date(b.attributes.date).getTime() -
      new Date(a.attributes.date).getTime()
  );

  return sortedNotes;
};
