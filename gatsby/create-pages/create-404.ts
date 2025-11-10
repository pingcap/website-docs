import { resolve } from "path";
import type { CreatePagesArgs } from "gatsby";
import { DEFAULT_BUILD_TYPE } from "./interface";
import { BuildType } from "../../src/shared/interface";

export const create404 = async ({
  actions: { createPage },
}: CreatePagesArgs) => {
  const template = resolve(__dirname, "../../src/templates/404Template.tsx");

  createPage({
    path: "/404/",
    component: template,
    context: {
      buildType: (process.env.WEBSITE_BUILD_TYPE ??
        DEFAULT_BUILD_TYPE) as BuildType,
      feature: {
        banner: false,
      },
    },
  });
};
