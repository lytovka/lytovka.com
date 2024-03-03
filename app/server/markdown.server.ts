import path from "path";
import matter from "gray-matter";
import fs from "fs/promises";
import { marked } from "marked";
import previews from "~/markdown/notes/previews.json";

const root = `${path.resolve()}/app`;

type Metadata = {
  title: string;
  description: string;
  date: string;
  slug: string;
  languages: string;
};

export type Note = {
  body: string;
  attributes: Metadata;
};

const renderer = new marked.Renderer();
renderer.heading = (text, level) => {
  const slug = text.toLowerCase().replace(/\s+/g, "-");

  return `<h${level} id="${slug}"><a href="#${slug}">${text}</a></h${level}>`;
};

marked.setOptions({ renderer });

const assertMetadata = (metadata: unknown): metadata is Metadata => {
  if (typeof metadata !== "object" || metadata === null) {
    return false;
  }

  return (
    "title" in metadata &&
    typeof metadata.title === "string" &&
    "date" in metadata &&
    "slug" in metadata &&
    typeof metadata.slug === "string"
  );
};

// This method is separate from other fetchers because of additional split operation.
export const getIntroFile = async (): Promise<{
  short: string;
  extended: string;
}> => {
  const filePath = import.meta.glob("/app/markdown/intro.md");
  const file = await filePath["/app/markdown/intro.md"]();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const { content } = matter((file as any).default);
  const [short, extended] = (await marked.parse(content)).split("<hr>");

  return { short, extended };
};

export const getSlugContent = async (slug: string): Promise<Note | null> => {
  const realSlug = slug.replace(/\.md$/, "");

  const buff = await fs.readFile(`${root}/markdown/notes/${realSlug}.md`);
  const buffString = buff.toString();
  const { data: metadata, content } = matter(buffString);
  const html = await marked(content);

  if (!assertMetadata(metadata)) {
    return null;
  }

  return { attributes: metadata, body: html };
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
