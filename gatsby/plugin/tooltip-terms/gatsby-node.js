const { loadTooltipTerms } = require("../../tooltip-terms");

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type TooltipTermDefinition {
      en: String!
      zh: String!
      ja: String!
    }

    type TooltipTerm implements Node @dontInfer {
      termId: String!
      definition: TooltipTermDefinition!
    }
  `);
};

exports.sourceNodes = ({
  actions,
  createContentDigest,
  createNodeId,
  reporter,
}) => {
  const { createNode } = actions;
  const tooltipTerms = loadTooltipTerms();

  tooltipTerms.forEach((term) => {
    createNode({
      termId: term.id,
      definition: term.definition,
      id: createNodeId(`tooltip-term-${term.id}`),
      parent: null,
      children: [],
      internal: {
        type: "TooltipTerm",
        contentDigest: createContentDigest(term),
      },
    });
  });

  reporter.info(`Loaded ${tooltipTerms.length} tooltip terms.`);
};
