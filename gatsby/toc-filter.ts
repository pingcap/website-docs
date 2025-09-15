import { EXTENDS_FOLDERS, mdxAstToToc, TocQueryData } from "./toc";
import { generateConfig } from "./path";

// Whitelist of files that should always be built regardless of TOC content
const WHITELIST = [""];

/**
 * Extract file paths from TOC navigation structure
 */
export function extractFilesFromToc(
  nav: any[],
  extendsFolders?: string[]
): string[] {
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

          // Check if extends folders are specified and found in path segments
          if (extendsFolders && extendsFolders.length > 0) {
            let foundExtendsFolder = false;
            for (const extendsFolder of extendsFolders) {
              const extendsIndex = pathSegments.indexOf(extendsFolder);
              if (
                extendsIndex !== -1 &&
                extendsIndex < pathSegments.length - 1
              ) {
                // Keep the extends folder and everything after it (excluding the .md extension)
                const pathFromExtends = pathSegments
                  .slice(extendsIndex, -1)
                  .join("/");
                files.push(`${pathFromExtends}/${filename}`);
                foundExtendsFolder = true;
                break;
              }
            }
            if (!foundExtendsFolder) {
              files.push(filename);
            }
          } else {
            files.push(filename);
          }
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

/**
 * Get files that should be built based on TOC content
 * Returns a Map where key is "locale/repo/version" and value is Set of file names
 */
export async function getFilesFromTocs(
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
    console.error(tocQuery.errors);
  }

  const tocNodes = tocQuery.data!.allMdx.nodes;
  const tocFilesMap = new Map<string, Set<string>>();

  tocNodes.forEach((node: TocQueryData["allMdx"]["nodes"][0]) => {
    const { config } = generateConfig(node.slug);
    const toc = mdxAstToToc(node.mdxAST.children, config);
    const files = extractFilesFromToc(toc, EXTENDS_FOLDERS);

    // Create a key for this specific locale/repo/version combination
    const key = `${config.locale}/${config.repo}/${
      config.version || config.branch
    }`;

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

  return tocFilesMap;
}

/**
 * Filter nodes based on TOC content
 * Only build files that are referenced in the corresponding TOC
 */
export function filterNodesByToc(
  nodes: any[],
  tocFilesMap: Map<string, Set<string>>
): any[] {
  const skippedNodes: Map<string, string[]> = new Map();
  const filteredNodes = nodes.filter((node) => {
    // Check if file is in whitelist - if so, always build it
    if (WHITELIST.includes(node.name)) {
      return true;
    }

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
    const isIncluded = filesForThisToc.has(
      `${node.pathConfig.prefix ? node.pathConfig.prefix + "/" : ""}${
        node.name
      }`
    );
    if (!isIncluded) {
      if (!skippedNodes.has(key)) {
        skippedNodes.set(key, []);
      }
      skippedNodes.get(key)!.push(node.name);
    }
    return isIncluded;
  });

  skippedNodes.forEach((nodes, key) => {
    console.info(`Skipped: ${key}: ${nodes.join(", ")}`);
  });

  return filteredNodes;
}
