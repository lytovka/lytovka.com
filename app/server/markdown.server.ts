import path from "path";
import matter from "gray-matter";
import fs from "fs/promises";
import { marked } from "marked";
import previews from "~/markdown/notes/previews.json";
import { fileURLToPath } from "url";

//TODO: This is a hack to get the root path for the app for diff environments (test, CI, and deploy preview). Need to find a better way.

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  languages: string;
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
  const [short, extended] = marked(content, { mangle: false }).split("<hr>");

  return { short, extended };
};

export const getSlugContent = async (slug: string): Promise<Note | null> => {
  const realSlug = slug.replace(/\.md$/, "");

  return fs
    .readFile(`${root}/markdown/notes/${realSlug}.md`)
    .then((res) => {
      const file = res.toString();
      const { data, content } = matter(file);
      const html = marked(content, { mangle: false });

      return { attributes: data as Metadata, body: html };
    })
    .catch((_) => {
      return null;
    });
};

const getAllNoteSlugs = async (): Promise<Array<string>> => {
  const res = fs.readdir(`${root}/markdown/notes`);

  return res;
};

export const fetchAllContent = async (): Promise<Array<Note>> => {
  const slugs = await getAllNoteSlugs();
  const notes = (await Promise.all(
    slugs.map(async (slug) => getSlugContent(slug)).filter(Boolean),
  )) as Array<Note>;
  const sortedNotes = notes.sort(
    (a, b) =>
      new Date(b.attributes.date).getTime() -
      new Date(a.attributes.date).getTime(),
  );

  return sortedNotes;
};

export const fetchPreviews = (): Array<Metadata> => {
  return (previews as Array<Metadata>).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};
