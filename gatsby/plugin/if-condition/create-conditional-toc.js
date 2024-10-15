import { getPageType } from "./utils";

const visit = require(`unist-util-visit`);
const genMDX = require("gatsby-plugin-mdx/utils/gen-mdx");
const defaultOptions = require("gatsby-plugin-mdx/utils/default-options");
const generateTOC = require(`mdast-util-toc`);

export const createConditionalToc = ({
  store,
  pathPrefix,
  getNode,
  getNodes,
  cache,
  reporter,
  actions,
  schema,
  ...helpers
}) => {
  const options = defaultOptions({});
  const { createTypes } = actions;
  const pendingPromises = new WeakMap();
  const processMDX = ({ node }) => {
    let promise = pendingPromises.get(node);
    if (!promise) {
      promise = genMDX({
        node,
        options,
        store,
        pathPrefix,
        getNode,
        getNodes,
        cache,
        reporter,
        actions,
        schema,
        ...helpers,
      });
      pendingPromises.set(node, promise);
      promise.then(() => {
        pendingPromises.delete(node);
      });
    }
    return promise;
  };

  const tocType = schema.buildObjectType({
    name: `Mdx`,
    fields: {
      toc: {
        type: `JSON`,
        args: {
          maxDepth: {
            type: `Int`,
            default: 6,
          },
        },
        async resolve(mdxNode, { maxDepth }) {
          const { mdast } = await processMDX({ node: mdxNode });
          const toc = generateTOC(mdast, { maxDepth });

          let isConditional = false;
          const shouldDeleteHeadings = [];
          const filePath = mdxNode.fileAbsolutePath;
          visit(mdast, (node) => {
            const openIfRegex = /<if platform="(.+?)">/;
            const closeIfRegex = /<\/if>/;

            const openMatch = openIfRegex.exec(node.value);
            const closeMatch = closeIfRegex.exec(node.value);

            if (openMatch) {
              const platform = openMatch[1];
              const shouldRender = platform === getPageType(filePath);

              if (!shouldRender) {
                isConditional = true;
              }
            }
            if (closeMatch) {
              isConditional = false;
            }

            if (isConditional && node.type === "heading") {
              shouldDeleteHeadings.push(node.children[0].value);
            }
          });

          const items = getItems(toc.map, {});
          filterItems(items, shouldDeleteHeadings);
          return items;
        },
      },
    },
    interfaces: [`Node`],
    extensions: {
      childOf: {
        mimeTypes: options.mediaTypes,
      },
    },
  });

  createTypes([tocType]);
};

// parse mdast-utils-toc object to JSON object:
//
// {"items": [{
//   "url": "#something-if",
//   "title": "Something if",
//   "items": [
//     {
//       "url": "#something-else",
//       "title": "Something else"
//     },
//     {
//       "url": "#something-elsefi",
//       "title": "Something elsefi"
//     }
//   ]},
//   {
//     "url": "#something-iffi",
//     "title": "Something iffi"
//   }]}
//
// TODO: fully test it with different options, tight=True
//
function getItems(node, current) {
  if (!node) {
    return {};
  } else if (node.type === `paragraph`) {
    visit(node, (item) => {
      if (item.type === `link`) {
        current.url = item.url;
      }
      if (item.type === `text`) {
        current.title = item.value;
      }
    });
    return current;
  } else {
    if (node.type === `list`) {
      current.items = node.children.map((i) => getItems(i, {}));
      return current;
    } else if (node.type === `listItem`) {
      const heading = getItems(node.children[0], {});
      if (node.children.length > 1) {
        getItems(node.children[1], heading);
      }
      return heading;
    }
  }
  return {};
}

function filterItems(data, filters) {
  data.items.forEach((it) => {
    if (!!it.items) {
      filterItems(it, filters);
    }
  });
  data.items = data.items.filter((it) => !filters.includes(it.title));
}
