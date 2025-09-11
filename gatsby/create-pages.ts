import { resolve } from "path";

import type { CreatePagesArgs } from "gatsby";
import sig from "signale";

import { Locale, Repo, BuildType } from "../src/shared/interface";
import {
  generateConfig,
  generateUrl,
  generateNav,
  generateDocHomeUrl,
  generateStarterNav,
  generateEssentialNav,
} from "./path";
import { docs as DOCS_CONFIG } from "../docs/docs.json";
import { cpMarkdown } from "./cp-markdown";
import { mdxAstToToc } from "./toc";

interface PageQueryData {
  allMdx: {
    nodes: {
      id: string;
      frontmatter: { aliases: string[] };
      slug: string;
    }[];
  };
}

interface TocQueryData {
  allMdx: {
    nodes: {
      id: string;
      slug: string;
      mdxAST: any;
      parent: {
        relativePath: string;
      };
    }[];
  };
}

const DEFAULT_BUILD_TYPE: BuildType = "prod";

/**
 * Extract file paths from TOC navigation structure
 */
function extractFilesFromToc(nav: any[]): string[] {
  const files: string[] = [];

  function traverse(navItems: any[]) {
    for (const item of navItems) {
      if (
        item.type === "nav" &&
        item.link &&
        !item.link.startsWith("https://")
      ) {
        // Extract filename from link path
        const pathSegments = item.link.split("/");
        const filenameWithExt = pathSegments[pathSegments.length - 1];
        if (filenameWithExt && filenameWithExt !== "") {
          // Remove .md extension to match the actual file name
          const filename = filenameWithExt.replace(/\.md$/, "");
          files.push(filename);
        }
      }
      if (item.children) {
        traverse(item.children);
      }
    }
  }

  traverse(nav);
  return files;
}

/**
 * Get files that should be built based on TOC content
 * Returns a Map where key is "locale/repo/version" and value is Set of file names
 */
async function getFilesFromTocs(
  graphql: any
): Promise<Map<string, Set<string>>> {
  const tocQuery = await graphql(`
    {
      allMdx(filter: { fileAbsolutePath: { regex: "/TOC.*md$/" } }) {
        nodes {
          id
          slug
          mdxAST
          parent {
            ... on File {
              relativePath
            }
          }
        }
      }
    }
  `);

  if (tocQuery.errors) {
    sig.error(tocQuery.errors);
  }

  const tocNodes = tocQuery.data!.allMdx.nodes;
  const tocFilesMap = new Map<string, Set<string>>();

  tocNodes.forEach((node: TocQueryData["allMdx"]["nodes"][0]) => {
    const { config } = generateConfig(node.slug);
    const toc = mdxAstToToc(node.mdxAST.children, config);
    const files = extractFilesFromToc(toc);

    // Create a key for this specific locale/repo/version combination
    const key = `${config.locale}/${config.repo}/${
      config.version || config.branch
    }`;
    tocFilesMap.set(key, new Set(files));

    sig.info(`TOC ${key}: found ${files.length} files`);
  });

  return tocFilesMap;
}

export const createDocs = async (createPagesArgs: CreatePagesArgs) => {
  const {
    actions: { createPage, createRedirect },
    graphql,
  } = createPagesArgs;
  // const template = resolve(__dirname, '../src/doc/index.tsx')
  const template = resolve(__dirname, "../src/templates/DocTemplate.tsx");

  // First, get the list of files that should be built based on TOC content
  const tocFilesMap = await getFilesFromTocs(graphql);
  sig.info(
    `Found TOC files for ${tocFilesMap.size} locale/repo/version combinations`
  );

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

  const nodes = docs
    .data!.allMdx.nodes.map((node) => {
      const { config, name, filePath } = generateConfig(node.slug);
      return { ...node, pathConfig: config, name, filePath };
    })
    .filter((node) => {
      // Filter nodes based on TOC content
      if (tocFilesMap.size === 0) {
        // If no TOC files found, build all files (fallback)
        return true;
      }

      // Create the key for this specific locale/repo/version combination
      const key = `${node.pathConfig.locale}/${node.pathConfig.repo}/${
        node.pathConfig.version || node.pathConfig.branch
      }`;
      const filesForThisToc = tocFilesMap.get(key);

      if (!filesForThisToc) {
        // If no TOC found for this specific combination, don't build the file
        return false;
      }

      // Only build files that are referenced in the corresponding TOC
      return filesForThisToc.has(node.name);
    });

  sig.info(
    `Building ${nodes.length} files after TOC filtering (from ${
      docs.data!.allMdx.nodes.length
    } total files)`
  );

  // Log some statistics about the filtering
  const filteredByToc = docs.data!.allMdx.nodes.length - nodes.length;
  if (filteredByToc > 0) {
    sig.info(`Filtered out ${filteredByToc} files not referenced in TOCs`);
  }

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
    const starterNavUrl = generateStarterNav(pathConfig);
    const essentialNavUrl = generateEssentialNav(pathConfig);

    const locale = [Locale.en, Locale.zh, Locale.ja]
      .map((l) =>
        versionRecord[l][pathConfig.repo]?.[name]?.includes(pathConfig.version)
          ? l
          : undefined
      )
      .filter(Boolean);

    cpMarkdown(`${node.slug}.md`, path, name);
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
        starterNavUrl,
        essentialNavUrl,
        availIn: {
          locale,
          version: versionRecord[pathConfig.locale][pathConfig.repo][name],
        },
        buildType: (process.env.WEBSITE_BUILD_TYPE ??
          DEFAULT_BUILD_TYPE) as BuildType, // prod | archive, default is prod; archive is for archive site
        feature: {
          banner: true,
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
    const starterNavUrl = generateStarterNav(pathConfig);
    const essentialNavUrl = generateEssentialNav(pathConfig);
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

export const createDocSearch = async ({
  actions: { createPage },
}: CreatePagesArgs) => {
  const template = resolve(__dirname, "../src/templates/DocSearchTemplate.tsx");

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

export const create404 = async ({
  actions: { createPage },
}: CreatePagesArgs) => {
  const template = resolve(__dirname, "../src/templates/404Template.tsx");

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
