const fs = require("fs");
const path = require("path");

const TOOLTIP_TERMS_PATH = path.resolve(
  __dirname,
  "../docs/tooltip-terms.json"
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

module.exports = {
  TOOLTIP_TERMS_PATH,
  SUPPORTED_TOOLTIP_LANGUAGES,
  loadTooltipTerms,
  parseTooltipTerms,
};
