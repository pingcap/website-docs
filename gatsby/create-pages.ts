import { resolve } from "path";

import type { CreatePagesArgs } from "gatsby";
import sig from "signale";

import { Locale, Repo, BuildType } from "../src/shared/interface";
import {
  generateConfig,
  generateUrl,
  generateNav,
  generateDocHomeUrl,
} from "./path";
import { docs as DOCS_CONFIG } from "../docs/docs.json";

interface PageQueryData {
  allMdx: {
    nodes: {
      id: string;
      frontmatter: { aliases: string[] };
      slug: string;
    }[];
  };
}

const DEFAULT_BUILD_TYPE: BuildType = "prod";

export const createDocs = async ({
  actions: { createPage, createRedirect },
  graphql,
}: CreatePagesArgs) => {
  // const template = resolve(__dirname, '../src/doc/index.tsx')
  const template = resolve(__dirname, "../src/templates/DocTemplate.tsx");

  const docs = await graphql<PageQueryData>(`
    {
      allMdx(
        filter: {
          fileAbsolutePath: { regex: "/^(?!.*TOC).*$/" }
          slug: {
            nin: ["en/tidb/_docHome", "zh/tidb/_docHome", "ja/tidb/_docHome"]
          }
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
  `);

  if (docs.errors) {
    sig.error(docs.errors);
  }

  const nodes = docs.data!.allMdx.nodes.map((node) => {
    const { config, name, filePath } = generateConfig(node.slug);
    return { ...node, pathConfig: config, name, filePath };
  });

  const versionRecord = nodes.reduce(
    (acc, { pathConfig, name }) => {
      if (acc[pathConfig.locale][pathConfig.repo] == null) {
        acc[pathConfig.locale][pathConfig.repo] = {};
      }

      if (acc[pathConfig.locale][pathConfig.repo][name] == null) {
        acc[pathConfig.locale][pathConfig.repo][name] = [];
      }

      acc[pathConfig.locale][pathConfig.repo][name].push(pathConfig.version);

      return acc;
    },
    {
      en: {} as Record<Repo, Record<string, (string | null)[]>>,
      zh: {} as Record<Repo, Record<string, (string | null)[]>>,
      ja: {} as Record<Repo, Record<string, (string | null)[]>>,
    }
  );

  nodes.forEach((node) => {
    const { id, name, pathConfig, filePath } = node;

    if (name?.startsWith("_")) {
      return;
    }

    const path = generateUrl(name, pathConfig);
    const navUrl = generateNav(pathConfig);

    const locale = [Locale.en, Locale.zh, Locale.ja]
      .map((l) =>
        versionRecord[l][pathConfig.repo]?.[name]?.includes(pathConfig.version)
          ? l
          : undefined
      )
      .filter(Boolean);

    createPage({
      path,
      component: template,
      context: {
        id,
        name,
        pathConfig,
        // use for edit in github
        filePath,
        pageUrl: path,
        navUrl,
        availIn: {
          locale,
          version: versionRecord[pathConfig.locale][pathConfig.repo][name],
        },
        buildType: (process.env.WEBSITE_BUILD_TYPE ??
          DEFAULT_BUILD_TYPE) as BuildType, // prod | archive, default is prod; archive is for archive site
        feature: {
          banner: false,
          feedback: true,
        },
      },
    });

    // create redirects
    if (node.frontmatter.aliases) {
      node.frontmatter.aliases.forEach((fromPath) => {
        createRedirect({
          fromPath,
          toPath: path,
          isPermanent: true,
        });
      });
    }
  });
};

export const createCloudAPIReference = async ({
  actions: { createPage, createRedirect },
  graphql,
}: CreatePagesArgs) => {
  const template = resolve(
    __dirname,
    "../src/templates/CloudAPIReferenceTemplate.tsx"
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

export const createDocHome = async ({
  actions: { createPage, createRedirect },
  graphql,
}: CreatePagesArgs) => {
  // const template = resolve(__dirname, "../src/doc/index.tsx");
  const template = resolve(__dirname, "../src/templates/DocTemplate.tsx");

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
    const navUrl = generateNav(pathConfig);

    const locale = [Locale.en, Locale.zh, Locale.ja];

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
        pageUrl: path,
        availIn: {
          locale,
          version: [],
        },
        buildType: (process.env.WEBSITE_BUILD_TYPE ??
          DEFAULT_BUILD_TYPE) as BuildType,
        feature: {
          banner: false,
          feedback: true,
          globalHome: true,
        },
      },
    });
  });
};

export const createDocSearch = async ({
  actions: { createPage },
}: CreatePagesArgs) => {
  const template = resolve(__dirname, "../src/templates/DocSearchTemplate.tsx");

  createPage({
    path: "/search",
    component: template,
    context: {
      feature: {
        banner: false,
      },
    },
  });
};

export const create404 = async ({
  actions: { createPage },
}: CreatePagesArgs) => {
  const template = resolve(__dirname, "../src/templates/404Template.tsx");

  createPage({
    path: "/404",
    component: template,
    context: {
      feature: {
        banner: false,
      },
    },
  });
};
