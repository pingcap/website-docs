import { resolve } from "path";

import type { CreatePagesArgs } from "gatsby";
import sig from "signale";

import { Locale, BuildType } from "../../src/shared/interface";
import {
  generateConfig,
  generateNav,
  generateDocHomeUrl,
} from "../../gatsby/path";
import { DEFAULT_BUILD_TYPE, PageQueryData } from "./interface";

export const createDocHome = async ({
  actions: { createPage },
  graphql,
}: CreatePagesArgs) => {
  // const template = resolve(__dirname, "../src/doc/index.tsx");
  const template = resolve(__dirname, "../../src/templates/DocTemplate.tsx");

  const prodQueryStr = `
  {
    allMdx(
      filter: {
        fileAbsolutePath: { regex: "/tidb/master/_docHome.md$/" }
        frontmatter: { draft: { ne: true } }
      }
    ) {
      nodes {
        id
        frontmatter {
          aliases
        }
        slug
        parent {
          ... on File {
            relativePath
          }
        }
      }
    }
  }
`;

  const archiveQueryStr = `
  {
    allMdx(
      filter: {
        fileAbsolutePath: { regex: "/tidb/_docHome.md$/" }
        frontmatter: { draft: { ne: true } }
      }
    ) {
      nodes {
        id
        frontmatter {
          aliases
        }
        slug
        parent {
          ... on File {
            relativePath
          }
        }
      }
    }
  }
`;

  const docs = await graphql<PageQueryData>(
    process.env.WEBSITE_BUILD_TYPE === "archive"
      ? archiveQueryStr
      : prodQueryStr
  );

  if (docs.errors) {
    sig.error(docs.errors);
  }

  const nodes = docs.data!.allMdx.nodes.map((node) => {
    const { config, name, filePath } = generateConfig(node.slug);
    return { ...node, pathConfig: config, name, filePath };
  });

  nodes.forEach((node) => {
    const { id, name, pathConfig, filePath, slug } = node;
    const path = generateDocHomeUrl(name, pathConfig);
    const navUrl = generateNav(pathConfig, slug);
    const starterNavUrl = generateNav(pathConfig, "tidb-cloud-starter");
    const essentialNavUrl = generateNav(pathConfig, "tidb-cloud-essential");
    const locale =
      process.env.WEBSITE_BUILD_TYPE === "archive"
        ? [Locale.en, Locale.zh]
        : [Locale.en, Locale.zh, Locale.ja];

    createPage({
      path,
      component: template,
      context: {
        id,
        name,
        pathConfig,
        // use for edit in github
        filePath,
        navUrl,
        starterNavUrl,
        essentialNavUrl,
        pageUrl: path,
        availIn: {
          locale,
          version: [],
        },
        buildType: (process.env.WEBSITE_BUILD_TYPE ??
          DEFAULT_BUILD_TYPE) as BuildType,
        feature: {
          banner: true,
          feedback: true,
          globalHome: true,
        },
      },
    });
  });
};
