import fs from "fs/promises";
import { marked } from "marked";

export const getMarkdownFile = async () => {
  const pathToIntro = `${__dirname}/../app/posts/intro.md`;
  const file = (await fs.readFile(pathToIntro)).toString();
  const html = marked(file);

  return html;
};
