import fs from "fs/promises";
import { marked } from "marked";

export const getMarkdownFile = async (): Promise<{
  short: string;
  extended: string;
}> => {
  const pathToIntro = `${__dirname}/../app/posts/intro.md`;
  const file = (await fs.readFile(pathToIntro)).toString();
  const [short, extended] = marked(file).split("<hr>");

  return { short, extended };
};
