import path from "path";
import fs from "fs-extra";

export const cpMarkdown = (
  filepath: string,
  destpath: string,
  filename: string
) => {
  const sourceDir = path.resolve(
    __dirname,
    `../docs/markdown-pages/${filepath}`
  );

  let _destpath = destpath;

  if (!filename) {
    _destpath = destpath.endsWith("/")
      ? destpath.slice(0, destpath.length - 1)
      : destpath;
  }

  const destDir = path.resolve(__dirname, `../public/${_destpath}.md`);

  fs.copy(sourceDir, destDir).catch((e) => console.warn(e.toString()));
};
