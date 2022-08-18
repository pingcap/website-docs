require("ts-node").register({ transpileOnly: true });

const path = require("path");

const {
  createDocs,
  createDocHome,
  createCloudAPIReference,
} = require("./gatsby/create-pages");
const { createExtraType } = require("./gatsby/create-types");

exports.createPages = async ({ graphql, actions }) => {
  await createDocHome({ graphql, actions });
  await createDocs({ graphql, actions });
  await createCloudAPIReference({ graphql, actions });
  actions.createPage({
    path: "/test",
    component: path.resolve(__dirname, "./src/templates/DocHomeTemplate.tsx"),
  });
  actions.createPage({
    path: "/search",
    component: path.resolve(__dirname, "./src/search/index.tsx"),
  });
  actions.createPage({
    path: "/404",
    component: path.resolve(__dirname, "./src/templates/404Template.tsx"),
  });
};

exports.createSchemaCustomization = createExtraType;
