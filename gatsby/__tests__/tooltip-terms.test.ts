import fs from "fs";

import {
  TOOLTIP_TERMS_PATH,
  parseTooltipTerms,
  loadTooltipTerms,
} from "../tooltip-terms";

describe("tooltip terms parsing", () => {
  it("accepts valid JSON content", () => {
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

describe("tooltip terms loading", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("loads tooltip terms from the docs data file", () => {
    jest.spyOn(fs, "readFileSync").mockReturnValue(`
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

    const terms = loadTooltipTerms();

    expect(fs.readFileSync).toHaveBeenCalledWith(TOOLTIP_TERMS_PATH, "utf8");
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
});
