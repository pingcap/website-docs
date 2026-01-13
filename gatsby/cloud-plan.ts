import { mdxAstToToc, TocQueryData } from "./toc";
import { generateConfig } from "./path";
import { extractFilesFromToc } from "./toc-filter";
import { CloudPlan } from "../src/shared/interface";

type TocMap = Map<
  string,
  {
    dedicated: Set<string>;
    starter: Set<string>;
    essential: Set<string>;
    premium: Set<string>;
  }
>;

/**
 * Get files from different TOC types for tidbcloud
 * Returns a Map where key is "locale/repo/version" and value is object with dedicated, starter, essential file sets
 */
export async function getTidbCloudFilesFromTocs(graphql: any): Promise<TocMap> {
  const tocQuery = await graphql(`
    {
      allMdx(
        filter: { fileAbsolutePath: { regex: "/tidbcloud/.*TOC.*md$/" } }
      ) {
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
    console.error(tocQuery.errors);
  }

  const tocNodes = tocQuery.data!.allMdx.nodes;
  const tidbCloudTocFilesMap: TocMap = new Map();

  tocNodes.forEach((node: TocQueryData["allMdx"]["nodes"][0]) => {
    const { config } = generateConfig(node.slug);
    const toc = mdxAstToToc(node.mdxAST.children, node.slug);
    const files = extractFilesFromToc(toc);

    // Create a key for this specific locale/repo/version combination
    const key = `${config.locale}/${config.repo}/${
      config.version || config.branch
    }`;

    // Determine TOC type based on filename
    const relativePath = node.parent.relativePath;
    let tocType: CloudPlan | null = null;

    if (relativePath.includes("TOC.md")) {
      tocType = CloudPlan.Dedicated;
    } else if (relativePath.includes("TOC-tidb-cloud-starter")) {
      tocType = CloudPlan.Starter;
    } else if (relativePath.includes("TOC-tidb-cloud-essential")) {
      tocType = CloudPlan.Essential;
    } else if (relativePath.includes("TOC-tidb-cloud-premium")) {
      tocType = CloudPlan.Premium;
    }

    // Initialize the entry if it doesn't exist
    if (!tidbCloudTocFilesMap.has(key)) {
      tidbCloudTocFilesMap.set(key, {
        dedicated: new Set(),
        starter: new Set(),
        essential: new Set(),
        premium: new Set(),
      });
    }

    // Add files to the appropriate TOC type
    const entry = tidbCloudTocFilesMap.get(key)!;
    if (!tocType) {
      console.error(`TOC ${key} has no type`);
      return;
    }
    entry[tocType] = new Set(files);

    console.info(`TOC ${key} (${tocType}): found ${files.length} files`);
  });

  return tidbCloudTocFilesMap;
}

/**
 * Determine the inDefaultPlan value for a tidbcloud article based on TOC presence
 */
export function determineInDefaultPlan(
  fileName: string,
  pathConfig: any,
  tidbCloudTocFilesMap: TocMap
): CloudPlan | null {
  // Only apply this logic for tidbcloud articles
  if (pathConfig.repo !== "tidbcloud") {
    return null;
  }

  const key = `${pathConfig.locale}/${pathConfig.repo}/${
    pathConfig.version || pathConfig.branch
  }`;

  const tocData = tidbCloudTocFilesMap.get(key);
  if (!tocData) {
    return null;
  }

  const { dedicated, starter, essential, premium } = tocData;

  // Check if article is in TOC.md (dedicated)
  if (dedicated.has(fileName)) {
    return CloudPlan.Dedicated;
  }

  // Check if article is in TOC-tidb-cloud-starter.md but not in TOC.md
  if (starter.has(fileName) && !dedicated.has(fileName)) {
    return CloudPlan.Starter;
  }

  // Check if article is only in TOC-tidb-cloud-essential.md
  if (
    essential.has(fileName) &&
    !dedicated.has(fileName) &&
    !starter.has(fileName)
  ) {
    return CloudPlan.Essential;
  }

  if (
    premium.has(fileName) &&
    !essential.has(fileName) &&
    !dedicated.has(fileName) &&
    !starter.has(fileName)
  ) {
    return CloudPlan.Premium;
  }

  return null;
}
