require("ts-node").register({ transpileOnly: true });
require("dotenv").config();

const {
  createDocs,
  createDocHome,
  createCloudAPIReference,
  createDocSearch,
  create404,
} = require("./gatsby/create-pages");
const { createFrontmatter, createNavs } = require("./gatsby/create-types");
const {
  createConditionalToc,
} = require("./gatsby/plugin/conditional-toc/conditional-toc");

exports.createPages = async ({ graphql, actions }) => {
  await createDocHome({ graphql, actions });
  await createDocs({ graphql, actions });

  if (process.env.WEBSITE_BUILD_TYPE !== "archive") {
    await createCloudAPIReference({ graphql, actions });
    await createDocSearch({ actions });
  }

  create404({ actions });
};

exports.createSchemaCustomization = (options) => {
  createFrontmatter(options);
  createNavs(options);
  createConditionalToc(options);
};
