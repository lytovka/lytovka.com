import fs from "fs";
import { marked } from "marked";
import fm from "front-matter";

// This method is separate from other fetchers because of additional split operation.
export const getIntroFile = (): { short: string; extended: string } => {
  const pathToIntro = `${__dirname}/../app/markdown/intro.md`;
  const file = fs.readFileSync(pathToIntro).toString();
  const [short, extended] = marked(file).split("<hr>");

  return { short, extended };
};

export const getSlugContent = (
  slug: string
): {
  attributes: { date: string; title: string; slug: string };
  body: string;
} => {
  const realSlug = slug.replace(/\.md$/, "");
  const path = `${__dirname}/../app/markdown/notes/${realSlug}.md`;
  const file = fs.readFileSync(path).toString();
  const { attributes, body } = fm<{
    title: string;
    date: string;
    slug: string;
  }>(file);
  const html = marked(body);

  return { attributes, body: html };
};

const getAllNoteSlugs = (): Array<string> => {
  const res = fs.readdirSync(`${__dirname}/../app/markdown/notes`);

  return res;
};

export const fetchAllContent = (): Array<{
  attributes: { date: string; title: string; slug: string };
  body: string;
}> => {
  const slugs = getAllNoteSlugs();
  const notes = slugs
    .map((slug) => getSlugContent(slug))
    .sort((note1, note2) =>
      note1.attributes.date > note2.attributes.date ? 1 : -1
    );

  return notes;
};
