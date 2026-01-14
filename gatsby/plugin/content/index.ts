import visit from "unist-util-visit";
import type { Root, Link, Blockquote } from "mdast";
import { calculateFileUrl } from "../../url-resolver";
import { resolveMarkdownLink } from "../../link-resolver";

function textToJsx(text: string) {
  switch (text) {
    case "Note:":
    case "注意：":
    case "Note":
    case "注意":
      return "Note";
    case "Warning:":
    case "警告：":
    case "Warning":
    case "警告":
      return "Warning";
    case "Tip:":
    case "建议：":
    case "Tip":
    case "建议":
      return "Tip";
    case "Important:":
    case "重要：":
    case "Important":
    case "重要":
      return "Important";
    default:
      throw new Error("unreachable");
  }
}

module.exports = function ({
  markdownAST,
  markdownNode,
}: {
  markdownAST: Root;
  markdownNode: { fileAbsolutePath: string };
}) {
  const currentFileUrl = calculateFileUrl(markdownNode.fileAbsolutePath) || "";

  visit(markdownAST, (node: any) => {
    if (Array.isArray(node.children)) {
      node.children = node.children.flatMap((node: any) => {
        if (node.type === "link" && !node.url.startsWith("#")) {
          const ele = node as Link;

          if (ele.url.startsWith("http")) {
            return [
              {
                type: "jsx",
                value: `<a href="${ele.url}" target="_blank" referrerPolicy="no-referrer-when-downgrade">`,
              },
              ...node.children,
              { type: "jsx", value: "</a>" },
            ];
          } else {
            // Resolve markdown link using link-resolver
            const resolvedPath = resolveMarkdownLink(
              ele.url.replace(".md", ""),
              currentFileUrl
            );

            return [
              {
                type: "jsx",
                value: `<Link to="${resolvedPath}">`,
              },
              ...node.children,
              { type: "jsx", value: "</Link>" },
            ];
          }
        }

        if (node.type === "blockquote") {
          const ele = node as Blockquote;
          const first = ele.children[0];
          if (
            first?.type === "paragraph" &&
            first.children?.[0].type === "strong" &&
            first.children[0].children?.[0].type === "text"
          ) {
            const text = first.children[0].children[0].value;
            switch (text) {
              case "Note:":
              // https://github.com/orgs/community/discussions/16925
              case "Note":
              case "注意：":
              case "注意":
              case "Warning:":
              case "Warning":
              case "警告：":
              case "警告":
              case "Tip:":
              case "Tip":
              case "建议：":
              case "建议":
              case "Important:":
              case "Important":
              case "重要：":
              case "重要": {
                const children = node.children.slice(1);
                const jsx = textToJsx(text);
                return [
                  { type: "jsx", value: `<${jsx}>` },
                  ...children,
                  { type: "jsx", value: `</${jsx}>` },
                ];
              }

              default:
                return ele;
            }
          }
          return ele;
        }

        return node;
      });
    }
  });
};
