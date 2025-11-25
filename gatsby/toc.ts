import {
  ListItem,
  List,
  Link,
  Paragraph,
  Text,
  Content,
  PhrasingContent,
  Heading,
} from "mdast";

import {
  RepoNav,
  RepoNavLink,
  PathConfig,
  CloudPlan,
} from "../src/shared/interface";
import { generateUrl } from "./path";

export const EXTENDS_FOLDERS: CloudPlan[] = [
  "starter",
  "essential",
  "dedicated",
  "premium",
];

const SKIP_MODE_HEADING = "_BUILD_ALLOWLIST";

function filterWhitelistContent(ast: Content[]): Content[] {
  const result: Content[] = [];
  let skipMode = false;

  for (let i = 0; i < ast.length; i++) {
    const node = ast[i];

    // Check if this is a heading with _WHITELIST_ content
    if (node.type === "heading") {
      if (
        (node.children[0] as Text).value === SKIP_MODE_HEADING ||
        (node.children[0] as Text).value.startsWith("_")
      ) {
        skipMode = true;
        continue; // Skip this heading
      } else {
        skipMode = false; // Reset skip mode when encountering a different heading
      }
    }

    // If we're in skip mode, only stop skipping when we encounter another heading
    if (skipMode && node.type === "heading") {
      skipMode = false; // Reset skip mode for the new heading
    }

    // Only add the node if we're not in skip mode
    if (!skipMode) {
      // Recursively process children if the node has them
      const processedNode = processNodeChildren(node);
      result.push(processedNode);
    }
  }

  return result;
}

function processNodeChildren(node: Content): Content {
  // Create a copy of the node to avoid mutating the original
  const processedNode = { ...node };

  // Check if the node has children and recursively process them
  if ("children" in processedNode && Array.isArray(processedNode.children)) {
    // Only process children if they are Content[] type (like in List, Heading, etc.)

    const processedChildren = filterWhitelistContent(
      processedNode.children as Content[]
    );
    (processedNode as any).children = processedChildren;
  }

  return processedNode;
}

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

export function mdxAstToToc(
  ast: Content[],
  tocConfig: PathConfig,
  prefixId = `0`,
  filterWhitelist = false
): RepoNav {
  const filteredAst = filterWhitelist ? filterWhitelistContent(ast) : ast;

  return filteredAst
    .filter(
      (node) =>
        node.type === "list" || (node.type === "heading" && node.depth > 1)
    )
    .map((node, idx) => {
      if (node.type === "list") {
        return handleList(node.children, tocConfig, `${prefixId}-${idx}`);
      } else {
        return handleHeading((node as Heading).children, `${prefixId}-${idx}`);
      }
    })
    .flat();
}

function handleList(ast: ListItem[], tocConfig: PathConfig, prefixId = `0`) {
  return ast.map((node, idx) => {
    const content = node.children as [Paragraph, List | undefined];
    if (content.length > 0 && content.length <= 2) {
      const ret = getContentFromLink(
        content[0],
        tocConfig,
        `${prefixId}-${idx}`
      );

      if (content[1]) {
        const list = content[1];
        if (list.type !== "list") {
          throw new Error(
            `incorrect listitem in TOC.md: ${JSON.stringify(list)}`
          );
        }

        ret.children = handleList(
          list.children,
          tocConfig,
          `${prefixId}-${idx}`
        );
      }

      return ret;
    }

    throw new Error(
      `incorrect format list in TOC.md: ${content
        .flatMap((n) => JSON.stringify(n))
        .join(", ")}`
    );
  });
}

function handleHeading(ast: PhrasingContent[], id = `0`): RepoNavLink[] {
  const child = ast[0] as Text;
  return [
    {
      type: "heading",
      content: [child.value],
      id,
    },
  ];
}

function getContentFromLink(
  content: Paragraph,
  tocConfig: PathConfig,
  id: string
): RepoNavLink {
  if (content.type !== "paragraph" || content.children.length === 0) {
    throw new Error(
      `incorrect format paragraph in TOC.md: ${JSON.stringify(content)}`
    );
  }

  const child = content.children[0] as Link | Text;
  // use `image` as tag
  const image = content.children.find((n) => n.type === "image");
  const tag = image && {
    value: image.alt!,
    query: `?${image.url.split("?")[1]}`,
  };

  if (child.type === "link") {
    if (child.children.length === 0) {
      throw new Error(`incorrect link in TOC.md: ${JSON.stringify(child)}`);
    }

    const content = child.children.map((node) => {
      switch (node.type) {
        case "text":
          return node.value;
        case "inlineCode":
          return { code: true, value: node.value };
        default:
          throw new Error(`unsupported tag ${node.type} in TOC link`);
      }
    });

    if (child.url.startsWith("https://")) {
      return {
        type: "nav",
        link: child.url,
        content,
        tag,
        id,
      };
    }

    const urlSegs = child.url.split("/");
    let filename = urlSegs[urlSegs.length - 1].replace(".md", "");

    for (const extendsFolder of EXTENDS_FOLDERS) {
      if (urlSegs.includes(extendsFolder)) {
        filename = `${extendsFolder}/${filename}`;
        break;
      }
    }

    return {
      type: "nav",
      link: generateUrl(filename, tocConfig),
      content,
      tag,
      id,
    };
  } else {
    return {
      type: "nav",
      content: [child.value],
      tag,
      id,
    };
  }
}
