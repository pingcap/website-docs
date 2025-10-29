const visit = require(`unist-util-visit`);
const genMDX = require("gatsby-plugin-mdx/utils/gen-mdx");
const defaultOptions = require("gatsby-plugin-mdx/utils/default-options");
const generateTOC = require(`mdast-util-toc`);
const GithubSlugger = require(`github-slugger`);

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

          // Build a map of heading IDs to their CustomContent conditions
          const headingConditions = {};
          const slugger = new GithubSlugger();
          const conditionStack = [];

          // Helper function to extract text from heading node
          const getHeadingText = (node) => {
            let text = "";
            visit(node, (child) => {
              if (child.type === "text") {
                text += child.value;
              } else if (child.type === "inlineCode") {
                text += child.value;
              }
            });
            return text;
          };

          // Helper function to parse CustomContent JSX attributes
          const parseCustomContentAttributes = (jsxString) => {
            const attributes = {};

            // Match platform="value" or platform='value'
            const platformMatch = jsxString.match(/platform=["']([^"']+)["']/);
            if (platformMatch) {
              attributes.platform = platformMatch[1];
            }

            // Match plan="value" or plan='value'
            const planMatch = jsxString.match(/plan=["']([^"']+)["']/);
            if (planMatch) {
              attributes.plan = planMatch[1];
            }

            // Match language="value" or language='value'
            const languageMatch = jsxString.match(/language=["']([^"']+)["']/);
            if (languageMatch) {
              attributes.language = languageMatch[1];
            }

            return attributes;
          };

          // Traverse the mdast tree to track CustomContent blocks
          // We need to identify start position and end position of CustomContent blocks
          const customContentRanges = [];
          let tempStack = [];

          // First pass: identify all CustomContent block ranges
          visit(mdast, (node, index, parent) => {
            if (node.type === "jsx" && node.value) {
              const trimmedValue = node.value.trim();

              // Check for opening tag (not self-closing)
              if (
                trimmedValue.includes("<CustomContent") &&
                !trimmedValue.includes("/>")
              ) {
                const attributes = parseCustomContentAttributes(node.value);
                tempStack.push({
                  startPosition: node.position,
                  attributes,
                });
              }
              // Check for closing tag
              else if (trimmedValue.includes("</CustomContent>")) {
                if (tempStack.length > 0) {
                  const blockInfo = tempStack.pop();
                  customContentRanges.push({
                    start: blockInfo.startPosition,
                    end: node.position,
                    attributes: blockInfo.attributes,
                  });
                }
              }
            }
          });

          // Second pass: match headings with CustomContent blocks
          visit(mdast, (node) => {
            if (node.type === "heading" && node.position) {
              const headingText = getHeadingText(node);
              const headingId = slugger.slug(headingText);

              // Check if this heading is inside any CustomContent block
              for (const range of customContentRanges) {
                if (
                  node.position.start.line > range.start.end.line &&
                  node.position.end.line < range.end.start.line
                ) {
                  headingConditions[headingId] = { ...range.attributes };
                  break; // Only use the first matching range (innermost)
                }
              }
            }
          });

          // Reset slugger for potential reuse
          slugger.reset();

          const items = getItems(toc.map, {}, headingConditions);
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
//   "condition": { "platform": "a", "plan": "b", "language": "c" },
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
function getItems(node, current, headingConditions = {}) {
  if (!node) {
    return {};
  } else if (node.type === `paragraph`) {
    visit(node, (item) => {
      if (item.type === `link`) {
        current.url = item.url;
        // Extract heading ID from URL and attach condition if exists
        const headingId = item.url.replace(/^#/, "");
        if (headingConditions[headingId]) {
          current.condition = headingConditions[headingId];
        }
      }
      if (item.type === `text`) {
        current.title = item.value;
      }
    });
    return current;
  } else {
    if (node.type === `list`) {
      current.items = node.children.map((i) =>
        getItems(i, {}, headingConditions)
      );
      return current;
    } else if (node.type === `listItem`) {
      const heading = getItems(node.children[0], {}, headingConditions);
      if (node.children.length > 1) {
        getItems(node.children[1], heading, headingConditions);
      }
      return heading;
    }
  }
  return {};
}
