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
  process.env.WEBSITE_BUILD_TYPE !== "archive" &&
    actions.createPage({
      path: "/search",
      component: path.resolve(
        __dirname,
        "./src/templates/DocSearchTemplate.tsx"
      ),
    });
  actions.createPage({
    path: "/404",
    component: path.resolve(__dirname, "./src/templates/404Template.tsx"),
  });
};

exports.createSchemaCustomization = createExtraType;
