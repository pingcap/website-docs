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
          let insideCustomContent = false;
          let currentConditionAttrs = null;

          visit(mdast, (node, index, parent) => {
            // Check for opening CustomContent tag
            if (
              node.type === "jsx" &&
              node.value &&
              node.value.includes("<CustomContent")
            ) {
              const attributes = parseCustomContentAttributes(node.value);
              conditionStack.push(attributes);
              insideCustomContent = true;
              currentConditionAttrs = attributes;
            }
            // Check for closing CustomContent tag
            else if (
              node.type === "jsx" &&
              node.value &&
              node.value.includes("</CustomContent>")
            ) {
              if (conditionStack.length > 0) {
                conditionStack.pop();
              }
              if (conditionStack.length === 0) {
                insideCustomContent = false;
                currentConditionAttrs = null;
              } else {
                currentConditionAttrs =
                  conditionStack[conditionStack.length - 1];
              }
            }
            // Track headings inside CustomContent blocks
            else if (node.type === "heading" && conditionStack.length > 0) {
              const headingText = getHeadingText(node);
              const headingId = slugger.slug(headingText);

              headingConditions[headingId] = {
                ...conditionStack[conditionStack.length - 1],
              };
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
