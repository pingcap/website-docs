const {
  parseTooltipTerms,
  collectTooltipIdsFromAst,
  validateTooltipReferences,
} = require("../tooltip-terms");

describe("tooltip terms parsing", () => {
  it("accepts valid JSON-compatible YAML content", () => {
    const terms = parseTooltipTerms(`
      [
        {
          "id": "data-branch",
          "definition": {
            "en": "English",
            "zh": "Chinese",
            "ja": "Japanese"
          }
        }
      ]
    `);

    expect(terms).toEqual([
      {
        id: "data-branch",
        definition: {
          en: "English",
          zh: "Chinese",
          ja: "Japanese",
        },
      },
    ]);
  });

  it("rejects duplicated ids", () => {
    expect(() =>
      parseTooltipTerms(`
        [
          {
            "id": "data-branch",
            "definition": {
              "en": "English",
              "zh": "Chinese",
              "ja": "Japanese"
            }
          },
          {
            "id": "data-branch",
            "definition": {
              "en": "English 2",
              "zh": "Chinese 2",
              "ja": "Japanese 2"
            }
          }
        ]
      `)
    ).toThrow("duplicated tooltip id");
  });

  it("rejects missing localized definitions", () => {
    expect(() =>
      parseTooltipTerms(`
        [
          {
            "id": "data-branch",
            "definition": {
              "en": "English",
              "zh": "Chinese",
              "ja": ""
            }
          }
        ]
      `)
    ).toThrow("missing a non-empty ja definition");
  });
});

describe("tooltip reference collection", () => {
  it("collects tooltip ids from jsx nodes", () => {
    expect(
      collectTooltipIdsFromAst({
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "jsx",
                value: '<Tooltip id="data-branch">',
              },
              {
                type: "text",
                value: "Data Branch",
              },
              {
                type: "jsx",
                value: "</Tooltip>",
              },
            ],
          },
        ],
      })
    ).toEqual(["data-branch"]);
  });

  it("rejects self-closing tooltip syntax", () => {
    expect(() =>
      collectTooltipIdsFromAst({
        children: [
          {
            type: "jsx",
            value: '<Tooltip id="data-branch" />',
          },
        ],
      })
    ).toThrow("does not support self-closing syntax");
  });
});

describe("tooltip reference validation", () => {
  it("passes when all tooltip ids exist", () => {
    expect(() =>
      validateTooltipReferences(
        [
          {
            slug: "en/tidb/master/sample",
            parent: {
              relativePath: "docs/markdown-pages/en/tidb/master/sample.md",
            },
            mdxAST: {
              children: [
                {
                  type: "jsx",
                  value: '<Tooltip id="data-branch">',
                },
                {
                  type: "jsx",
                  value: "</Tooltip>",
                },
              ],
            },
          },
        ],
        new Set(["data-branch"])
      )
    ).not.toThrow();
  });

  it("fails with file context when tooltip id is missing", () => {
    expect(() =>
      validateTooltipReferences(
        [
          {
            slug: "en/tidb/master/sample",
            parent: {
              relativePath: "docs/markdown-pages/en/tidb/master/sample.md",
            },
            mdxAST: {
              children: [
                {
                  type: "jsx",
                  value: '<Tooltip id="missing-id">',
                },
                {
                  type: "jsx",
                  value: "</Tooltip>",
                },
              ],
            },
          },
        ],
        new Set(["data-branch"])
      )
    ).toThrow("docs/markdown-pages/en/tidb/master/sample.md references undefined tooltip ids: missing-id");
  });

  it("fails when tooltip id is omitted", () => {
    expect(() =>
      validateTooltipReferences(
        [
          {
            slug: "en/tidb/master/sample",
            parent: {
              relativePath: "docs/markdown-pages/en/tidb/master/sample.md",
            },
            mdxAST: {
              children: [
                {
                  type: "jsx",
                  value: "<Tooltip>",
                },
                {
                  type: "jsx",
                  value: "</Tooltip>",
                },
              ],
            },
          },
        ],
        new Set(["data-branch"])
      )
    ).toThrow("Tooltip is missing a quoted id attribute");
  });
});
