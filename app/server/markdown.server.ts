import path from "node:path";
import matter from "gray-matter";
import fs from "node:fs/promises";
import { bundleMDX } from 'mdx-bundler'
import type { MarkedExtension } from "marked";
import { marked } from "marked";
import previews from "~/markdown/notes/previews.json";
import rehypeSlug from "rehype-slug"
import rehypeAutoLinkHeadings from "rehype-autolink-headings"

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

const extension: MarkedExtension = {
  useNewRenderer: true,
  renderer: {
    heading(token) {
      //@ts-ignore @ts-expect-error this includes parser object
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const text = this.parser.parseInline(token.tokens) as String;
      const level = token.depth;
      const slug = text.toLowerCase().replace(/\s+/g, "-");

      return `<h${level} id="${slug}"><a href="#${slug}">${text}</a></h${level}>`;
    },
  },
};

marked.use(extension);

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

export const getMdxSerialize = async (mdxString: string) => {
  const { frontmatter, code } = await bundleMDX({
    source: mdxString,
    mdxOptions(options, frontmatter) {
      options.rehypePlugins = [...(options.rehypePlugins || []), rehypeSlug,
      [
        rehypeAutoLinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor']
          }
        }
      ]
      ]

      return options;
    }
  })

  return { frontmatter: frontmatter as Record<string, string>, code }
};

export const getSlugContent = async (slug: string): Promise<Note | null> => {
  const realSlug = slug.replace(/\{.md,.mdx}$/, "");

  const buff = await fs.readFile(`${root}/markdown/notes/${realSlug}.mdx`);
  const buffString = buff.toString();
  const { data: metadata, content } = matter(buffString);
  const html = await marked(content);

  if (!assertMetadata(metadata)) {
    return null;
  }

  return { attributes: metadata, body: html };
};

export const fetchPreviews = (): Array<Metadata> => {
  return (previews as Array<Metadata>).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};
