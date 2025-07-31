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

import { RepoNav, RepoNavLink, PathConfig } from "../src/shared/interface";
import { generateUrl } from "./path";

export function mdxAstToToc(
  ast: Content[],
  config: PathConfig,
  prefixId = `0`
): RepoNav {
  return ast
    .filter(
      (node) =>
        node.type === "list" || (node.type === "heading" && node.depth > 1)
    )
    .map((node, idx) => {
      if (node.type === "list") {
        return handleList(node.children, config, `${prefixId}-${idx}`);
      } else {
        return handleHeading((node as Heading).children, `${prefixId}-${idx}`);
      }
    })
    .flat();
}

function handleList(ast: ListItem[], config: PathConfig, prefixId = `0`) {
  return ast.map((node, idx) => {
    const content = node.children as [Paragraph, List | undefined];
    if (content.length > 0 && content.length <= 2) {
      const ret = getContentFromLink(content[0], config, `${prefixId}-${idx}`);

      if (content[1]) {
        const list = content[1];
        if (list.type !== "list") {
          throw new Error(
            `incorrect listitem in TOC.md: ${JSON.stringify(list)}`
          );
        }

        ret.children = handleList(list.children, config, `${prefixId}-${idx}`);
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
  config: PathConfig,
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
    const filename = urlSegs[urlSegs.length - 1].replace(".md", "");

    return {
      type: "nav",
      link: generateUrl(filename, config),
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
