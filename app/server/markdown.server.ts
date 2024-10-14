import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import { marked } from "marked";
import previews from "~/markdown/notes/previews.json";
import rehypeSlug from "rehype-slug";
import rehypeAutoLinkHeadings from "rehype-autolink-headings";

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

export const getAboutPageSerialize = async (
  mdString: string,
): Promise<{
  short: string;
  extended: string;
} | null> => {
  const { content } = matter(mdString);
  const [short, extended] = (await marked.parse(content)).split("<hr>");

  return { short, extended };
};

export const getMdxSerialize = async (mdxString: string) => {
  const { frontmatter, code } = await bundleMDX({
    source: mdxString,
    mdxOptions(options) {
      /*eslint-disable */
      options.rehypePlugins = [
        ...(options.rehypePlugins || []),
        rehypeSlug,
        [
          rehypeAutoLinkHeadings,
          {
            behavior: "wrap",
            properties: {
              className: ["anchor"],
            },
          },
        ],
      ];
      /*eslint-enable */

      return options;
    },
  });

  return { frontmatter: frontmatter as Metadata, code };
};

export const fetchPreviews = (): Array<Metadata> => {
  return (previews as Array<Metadata>).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};
