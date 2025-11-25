import { resolve } from "path";

import type { CreatePagesArgs } from "gatsby";

import { Locale, BuildType } from "../../src/shared/interface";
import { docs as DOCS_CONFIG } from "../../docs/docs.json";
import { DEFAULT_BUILD_TYPE } from "./interface";

export const createCloudAPIReference = async ({
  actions: { createPage },
}: CreatePagesArgs) => {
  const template = resolve(
    __dirname,
    "../../src/templates/CloudAPIReferenceTemplate.tsx"
  );
  const pageCfg = DOCS_CONFIG.tidbcloud.openAPI;
  const pageList = pageCfg.data;
  const locale = [Locale.en];

  pageList.forEach((page) => {
    const path = `/tidbcloud/${pageCfg.path}/${page.pathname}`;
    const isProduction = process.env.CI === "true";
    createPage({
      path,
      component: template,
      context: {
        ...page,
        isProduction,
        availIn: {
          locale,
          version: [],
        },
        buildType: (process.env.WEBSITE_BUILD_TYPE ??
          DEFAULT_BUILD_TYPE) as BuildType,
        feature: {
          banner: false,
        },
      },
    });
  });
};
