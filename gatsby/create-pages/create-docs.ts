import { resolve } from "path";

import type { CreatePagesArgs } from "gatsby";
import sig from "signale";

import {
  Locale,
  Repo,
  BuildType,
  TOCNamespaceSlugMap,
  TOCNamespace,
} from "../../src/shared/interface";
import { generateConfig, generateNavTOCPath } from "../../gatsby/path";
import { getTOCNamespace } from "../../gatsby/toc-namespace";
import { calculateFileUrl } from "../../gatsby/url-resolver";
import { cpMarkdown } from "../../gatsby/cp-markdown";
import {
  getTidbCloudFilesFromTocs,
  determineInDefaultPlan,
} from "../cloud-plan";
import { getFilesFromTocs, filterNodesByToc } from "../toc-filter";
import { PageQueryData, DEFAULT_BUILD_TYPE } from "./interface";

export const createDocs = async (createPagesArgs: CreatePagesArgs) => {
  const {
    actions: { createPage, createRedirect },
    graphql,
  } = createPagesArgs;
  // const template = resolve(__dirname, '../src/doc/index.tsx')
  const template = resolve(__dirname, "../../src/templates/DocTemplate.tsx");

  // First, get the list of files that should be built based on TOC content
  const tocFilesMap = await getFilesFromTocs(graphql);

  // Get tidbcloud specific TOC files for plan determination
  const tidbCloudTocFilesMap = await getTidbCloudFilesFromTocs(graphql);

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

  const nodes = filterNodesByToc(
    docs.data!.allMdx.nodes.map((node) => {
      const { config, name, filePath } = generateConfig(node.slug);
      return { ...node, pathConfig: config, name, filePath };
    }),
    tocFilesMap
  );

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

    const path = calculateFileUrl(node.slug, true);
    if (!path) {
      console.info(
        `Failed to calculate URL for ${node.slug}, filePath: ${filePath}`
      );
      return;
    }

    const namespace = getTOCNamespace(node.slug);
    const namespaceSlug = TOCNamespaceSlugMap[namespace || TOCNamespace.TiDB];
    const navUrl = generateNavTOCPath(pathConfig, namespaceSlug);
    const starterNavUrl = generateNavTOCPath(pathConfig, "tidb-cloud-starter");
    const essentialNavUrl = generateNavTOCPath(
      pathConfig,
      "tidb-cloud-essential"
    );

    const locale = [Locale.en, Locale.zh, Locale.ja]
      .map((l) =>
        versionRecord[l][pathConfig.repo]?.[name]?.includes(pathConfig.version)
          ? l
          : undefined
      )
      .filter(Boolean);

    // Determine inDefaultPlan for tidbcloud articles
    const inDefaultPlan = determineInDefaultPlan(
      name,
      pathConfig,
      tidbCloudTocFilesMap
    );

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
        inDefaultPlan,
        namespace,
      },
    });

    // create redirects
    if (node.frontmatter.aliases) {
      node.frontmatter.aliases.forEach((fromPath: string) => {
        createRedirect({
          fromPath,
          toPath: path,
          isPermanent: true,
        });
      });
    }
  });
};
