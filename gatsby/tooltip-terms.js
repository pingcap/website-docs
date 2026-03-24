const fs = require("fs");
const path = require("path");

const TOOLTIP_TERMS_PATH = path.resolve(
  __dirname,
  "../src/data/tooltip-terms.json"
);
const SUPPORTED_TOOLTIP_LANGUAGES = ["en", "zh", "ja"];

function parseTooltipTerms(rawContent, sourcePath = TOOLTIP_TERMS_PATH) {
  let parsedContent;

  try {
    parsedContent = JSON.parse(rawContent);
  } catch (error) {
    throw new Error(`${sourcePath} must contain valid JSON.`);
  }

  if (!Array.isArray(parsedContent)) {
    throw new Error(
      `${sourcePath} must contain a top-level array of tooltip terms.`
    );
  }

  const seenIds = new Set();

  return parsedContent.map((term, index) => {
    const errorPrefix = `${sourcePath} item #${index + 1}`;

    if (!term || typeof term !== "object" || Array.isArray(term)) {
      throw new Error(`${errorPrefix} must be an object.`);
    }

    if (typeof term.id !== "string" || term.id.trim() === "") {
      throw new Error(`${errorPrefix} must define a non-empty string id.`);
    }

    if (seenIds.has(term.id)) {
      throw new Error(
        `${sourcePath} contains a duplicated tooltip id: ${term.id}`
      );
    }
    seenIds.add(term.id);

    if (
      !term.definition ||
      typeof term.definition !== "object" ||
      Array.isArray(term.definition)
    ) {
      throw new Error(`${errorPrefix} must define a definition object.`);
    }

    const definition = SUPPORTED_TOOLTIP_LANGUAGES.reduce((acc, language) => {
      const content = term.definition[language];

      if (typeof content !== "string" || content.trim() === "") {
        throw new Error(
          `${errorPrefix} is missing a non-empty ${language} definition.`
        );
      }

      acc[language] = content.trim();
      return acc;
    }, {});

    return {
      id: term.id,
      definition,
    };
  });
}

function loadTooltipTerms(sourcePath = TOOLTIP_TERMS_PATH) {
  return parseTooltipTerms(fs.readFileSync(sourcePath, "utf8"), sourcePath);
}

function buildTooltipTermMap(terms) {
  return terms.reduce((acc, term) => {
    acc[term.id] = term.definition;
    return acc;
  }, {});
}

function visitAstNode(node, visitor) {
  if (!node) {
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((item) => visitAstNode(item, visitor));
    return;
  }

  visitor(node);

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => visitAstNode(child, visitor));
  }
}

function extractTooltipIdFromJsx(jsxValue) {
  const trimmedValue = jsxValue.trim();

  if (
    !trimmedValue.startsWith("<Tooltip") ||
    trimmedValue.startsWith("</Tooltip")
  ) {
    return null;
  }

  if (trimmedValue.endsWith("/>")) {
    throw new Error(
      'Tooltip does not support self-closing syntax. Use <Tooltip id="...">label</Tooltip>.'
    );
  }

  const idMatch = trimmedValue.match(
    /(?:^|\s)id\s*=\s*(?:"([^"]+)"|'([^']+)')/
  );
  const tooltipId = idMatch?.[1] || idMatch?.[2];

  if (!tooltipId) {
    throw new Error("Tooltip is missing a quoted id attribute.");
  }

  return tooltipId;
}

function collectTooltipIdsFromAst(mdxAst) {
  const tooltipIds = [];

  visitAstNode(mdxAst, (node) => {
    if (node?.type !== "jsx" || typeof node.value !== "string") {
      return;
    }

    const tooltipId = extractTooltipIdFromJsx(node.value);
    if (tooltipId) {
      tooltipIds.push(tooltipId);
    }
  });

  return tooltipIds;
}

function validateTooltipReferences(nodes, availableTooltipIds) {
  const errors = [];

  nodes.forEach((node) => {
    try {
      const tooltipIds = collectTooltipIdsFromAst(node.mdxAST);
      const missingIds = [...new Set(tooltipIds)].filter(
        (tooltipId) => !availableTooltipIds.has(tooltipId)
      );

      if (missingIds.length > 0) {
        const fileLabel = node.parent?.relativePath || node.slug || node.id;
        errors.push(
          `${fileLabel} references undefined tooltip ids: ${missingIds.join(
            ", "
          )}`
        );
      }
    } catch (error) {
      const fileLabel = node.parent?.relativePath || node.slug || node.id;
      errors.push(`${fileLabel}: ${error.message}`);
    }
  });

  if (errors.length > 0) {
    throw new Error(
      [
        "Tooltip term validation failed:",
        ...errors.map((error) => `- ${error}`),
      ].join("\n")
    );
  }
}

module.exports = {
  TOOLTIP_TERMS_PATH,
  SUPPORTED_TOOLTIP_LANGUAGES,
  buildTooltipTermMap,
  collectTooltipIdsFromAst,
  loadTooltipTerms,
  parseTooltipTerms,
  validateTooltipReferences,
};
