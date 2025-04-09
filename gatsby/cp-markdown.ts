import path from "path";
import fs from "fs-extra";

export const cpMarkdown = (
  filepath: string,
  destpath: string,
  filename: string
) => {
  if (!filename) {
    return;
  }
  const sourceDir = path.resolve(
    __dirname,
    `../docs/markdown-pages/${filepath}`
  );
  const destDir = path.resolve(
    __dirname,
    `../public/${destpath}/${filename}.md`
  );
  fs.copy(sourceDir, destDir).catch((e) => console.warn(e.toString()));
};
