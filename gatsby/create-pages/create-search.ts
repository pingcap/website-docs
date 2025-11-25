import { resolve } from "path";
import type { CreatePagesArgs } from "gatsby";

export const createDocSearch = async ({
  actions: { createPage },
}: CreatePagesArgs) => {
  const template = resolve(
    __dirname,
    "../../src/templates/DocSearchTemplate.tsx"
  );

  createPage({
    path: "/search/",
    component: template,
    context: {
      feature: {
        banner: false,
      },
    },
  });
};
