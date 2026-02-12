import { mdxAstToToc, TocQueryData } from "./toc";
import { generateConfig } from "./path";
import { calculateFileUrl } from "./url-resolver";
import { isIgnoredTocRelativePath } from "./toc-ignore";

// Whitelist of files that should always be built regardless of TOC content
const WHITELIST = [""];

type TocFilesMap = Map<string, Set<string>>;
type TocNamesByFileMap = Map<string, Map<string, Set<string>>>;

export interface TocFilesResult {
  tocFilesMap: TocFilesMap;
  tocNamesByFileMap: TocNamesByFileMap;
}

/**
 * Extract file paths from TOC navigation structure
 */
export function extractFilesFromToc(nav: any[]): string[] {
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
  // Remove duplicates and return unique files
  return [...new Set(files)];
}

function getTocNameFromRelativePath(relativePath: string): string {
  const filename = relativePath.split("/").pop() || relativePath;
  return filename.replace(/\.md$/, "");
}

function sortTocNames(tocNames: Iterable<string>): string[] {
  const priority = [
    "TOC",
    "TOC-tidb-cloud-starter",
    "TOC-tidb-cloud-essential",
    "TOC-tidb-cloud-premium",
  ];
  const priorityIndex = new Map(priority.map((name, idx) => [name, idx]));
  return [...new Set(tocNames)].sort((a, b) => {
    const ai = priorityIndex.get(a);
    const bi = priorityIndex.get(b);
    if (ai != null && bi != null) return ai - bi;
    if (ai != null) return -1;
    if (bi != null) return 1;
    return a.localeCompare(b);
  });
}

/**
 * Get files that should be built based on TOC content
 * Returns a Map where key is "locale/repo/version" and value is Set of file names
 */
export async function getFilesFromTocs(
  graphql: any
): Promise<TocFilesResult> {
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
    console.error(tocQuery.errors);
  }

  const tocNodes = tocQuery.data!.allMdx.nodes;
  const tocFilesMap: TocFilesMap = new Map();
  const tocNamesByFileMap: TocNamesByFileMap = new Map();

  const filteredTocNodes = tocNodes.filter(
    (node: TocQueryData["allMdx"]["nodes"][0]) =>
      !isIgnoredTocRelativePath(node.parent?.relativePath || "")
  );

  filteredTocNodes.forEach((node: TocQueryData["allMdx"]["nodes"][0]) => {
    const { config } = generateConfig(node.slug);
    const tocPath = calculateFileUrl(node.slug);
    const toc = mdxAstToToc(node.mdxAST.children, tocPath || node.slug);
    const files = extractFilesFromToc(toc);
    const tocName = getTocNameFromRelativePath(node.parent.relativePath);

    // Create a key for this specific locale/repo/version combination
    const key = `${config.locale}/${config.repo}/${
      config.version || config.branch
    }`;

    // Track TOC membership for each file (normalized by removing anchor)
    if (!tocNamesByFileMap.has(key)) {
      tocNamesByFileMap.set(key, new Map());
    }
    const fileToTocs = tocNamesByFileMap.get(key)!;
    files.forEach((file) => {
      const normalizedFile = file.split("#")[0];
      if (!fileToTocs.has(normalizedFile)) {
        fileToTocs.set(normalizedFile, new Set());
      }
      fileToTocs.get(normalizedFile)!.add(tocName);
    });

    // If key already exists, take union with existing files
    if (tocFilesMap.has(key)) {
      const existingFiles = tocFilesMap.get(key)!;
      const union = new Set([...existingFiles, ...files]);
      tocFilesMap.set(key, union);
      console.info(
        `TOC ${key}: found ${new Set(files).size} files, union with existing: ${
          union.size
        } files (was ${existingFiles.size} files)`
      );
    } else {
      tocFilesMap.set(key, new Set(files));
      console.info(`TOC ${key}: found ${new Set(files).size} files`);
    }
  });

  return { tocFilesMap, tocNamesByFileMap };
}

/**
 * Filter nodes based on TOC content
 * Only build files that are referenced in the corresponding TOC
 */
export function filterNodesByToc(
  nodes: any[],
  tocFilesMap: TocFilesMap,
  tocNamesByFileMap: TocNamesByFileMap
): any[] {
  const skippedNodes: Map<string, string[]> = new Map();
  const filteredNodes = nodes.filter((node) => {
    // Check if file is in whitelist - if so, always build it
    if (WHITELIST.includes(node.name)) {
      node.tocNames = [];
      return true;
    }

    // Filter nodes based on TOC content
    if (tocFilesMap.size === 0) {
      // If no TOC files found, build all files (fallback)
      node.tocNames = [];
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
    const fullPath = node.name;

    // Check if the file is directly referenced in TOC
    let isIncluded = filesForThisToc.has(fullPath);

    // If not found, check if any TOC entry with anchor (#) matches this file
    if (!isIncluded) {
      for (const tocFile of filesForThisToc) {
        // Remove anchor part (#xxx) from TOC file path and check if it matches
        const tocFileWithoutAnchor = tocFile.split("#")[0];
        if (tocFileWithoutAnchor === fullPath) {
          isIncluded = true;
          break;
        }
      }
    }
    if (!isIncluded) {
      if (!skippedNodes.has(key)) {
        skippedNodes.set(key, []);
      }
      skippedNodes.get(key)!.push(node.name);
      node.tocNames = [];
    }

    if (isIncluded) {
      const tocNamesSet = tocNamesByFileMap.get(key)?.get(fullPath);
      node.tocNames = tocNamesSet ? sortTocNames(tocNamesSet) : [];
    }
    return isIncluded;
  });

  skippedNodes.forEach((nodes, key) => {
    console.info(`Skipped: ${key}: ${nodes.join(", ")}`);
  });

  return filteredNodes;
}
