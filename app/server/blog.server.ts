import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = `${path.resolve()}/app`;

export async function getContent(contentPath: string) {
  const file = path.join(root, "markdown/notes", `${contentPath}.mdx`);
  if (!existsSync(file)) {
    return null;
  }
  const buff = await fs.readFile(file, { encoding: "utf-8" });
  return { path, content: buff.toString() };
}
