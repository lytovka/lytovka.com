import path from "path";
import matter from "gray-matter";
import fs from "fs/promises";
import { marked } from "marked";

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
  languages: string;
};

export type Note = {
  body: string;
  attributes: Metadata;
};

// This method is separate from other fetchers because of additional split operation.
export const getIntroFile = async (
  locale = "en",
): Promise<{
  short: string;
  extended: string;
}> => {
  const pathToIntro = `${root}/markdown/${locale}/intro.md`;
  const file = (await fs.readFile(pathToIntro)).toString();
  const { content } = matter(file);
  const [short, extended] = marked(content, { mangle: false }).split("<hr>");

  return { short, extended };
};

export const getSlugContent = async (
  locale: string,
  slug: string,
): Promise<Note | null> => {
  const realSlug = slug.replace(/\.md$/, "");

  return fs
    .readFile(`${root}/markdown/${locale}/notes/${realSlug}.md`)
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

export const fetchPreviews = async (
  locale = "en",
): Promise<Array<Metadata>> => {
  let previews: Array<Metadata> = [];
  if (locale === "en") {
    previews = (
      await import(
        /* webpackChunkName: "../markdown/en/notes/previews.json" */
        `../markdown/en/notes/previews.json`
      )
    ).default as Array<Metadata>;
  }
  if (locale === "ru") {
    previews = (
      await import(
        /* webpackChunkName: "../markdown/ru/notes/previews.json" */
        `../markdown/ru/notes/previews.json`
      )
    ).default as Array<Metadata>;
  }

  return previews.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};
