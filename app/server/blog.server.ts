import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = `${path.resolve()}/app`;

type FileContentOptions = {
  ext: "md" | "mdx";
};

export async function getFileContent(
  contentPath: string,
  options: FileContentOptions = {
    ext: "mdx",
  },
) {
  const file = path.join(root, `${contentPath}.${options.ext}`);
  if (!existsSync(file)) {
    return null;
  }
  const buff = await fs.readFile(file, { encoding: "utf-8" });

  return { content: buff.toString() };
}
