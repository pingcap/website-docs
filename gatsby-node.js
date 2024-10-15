require("ts-node").register({ transpileOnly: true });

const {
  createDocs,
  createDocHome,
  createCloudAPIReference,
  createDocSearch,
  create404,
} = require("./gatsby/create-pages");
const { createExtraType } = require("./gatsby/create-types");
const {
  createConditionalToc,
} = require("./gatsby/plugin/if-condition/create-conditional-toc");

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
  createExtraType(options);
  createConditionalToc(options);
};
