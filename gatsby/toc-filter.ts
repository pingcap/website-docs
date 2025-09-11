import { mdxAstToToc } from "./toc";
import { generateConfig } from "./path";

export interface TocQueryData {
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
    const files = extractFilesFromToc(toc);

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
        `TOC ${key}: found ${files.length} files (${
          new Set(files).size
        } unique), union with existing: ${union.size} files (was ${
          existingFiles.size
        } files)`
      );
    } else {
      tocFilesMap.set(key, new Set(files));
      console.info(
        `TOC ${key}: found ${files.length} files (${
          new Set(files).size
        } unique)`
      );
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
  return nodes.filter((node) => {
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
}
