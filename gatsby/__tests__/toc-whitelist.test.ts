import { Locale, Repo, type PathConfig } from "../../src/shared/interface";

jest.mock("../toc", () => ({
  mdxAstToToc: jest.fn(() => []),
}));

jest.mock("../url-resolver", () => ({
  calculateFileUrl: jest.fn(() => null),
}));

describe("toc-filter _index whitelist rules", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("allows all stable _index pages, but only root _index for non-stable tidb branches", () => {
    const { filterNodesByToc } = require("../toc-filter");

    const stableConfig: PathConfig = {
      locale: Locale.en,
      repo: Repo.tidb,
      branch: "release-8.5",
      version: "stable",
    };
    const devConfig: PathConfig = {
      locale: Locale.en,
      repo: Repo.tidb,
      branch: "master",
      version: "dev",
    };

    const tocFilesMap = new Map<string, Set<string>>([
      ["en/tidb/stable", new Set(["some-file"])],
      ["en/tidb/dev", new Set(["some-file"])],
    ]);
    const tocNamesByFileMap = new Map<string, Map<string, Set<string>>>();

    const nodes = [
      {
        slug: "en/tidb/release-8.5/_index",
        name: "",
        filePath: "_index.md",
        pathConfig: stableConfig,
      },
      {
        slug: "en/tidb/release-8.5/ai/_index",
        name: "",
        filePath: "ai/_index.md",
        pathConfig: stableConfig,
      },
      {
        slug: "en/tidb/master/_index",
        name: "",
        filePath: "_index.md",
        pathConfig: devConfig,
      },
      {
        slug: "en/tidb/master/ai/_index",
        name: "",
        filePath: "ai/_index.md",
        pathConfig: devConfig,
      },
    ];

    const result = filterNodesByToc(nodes, tocFilesMap, tocNamesByFileMap);
    expect(result.map((n: any) => n.slug)).toEqual([
      "en/tidb/release-8.5/_index",
      "en/tidb/release-8.5/ai/_index",
      "en/tidb/master/_index",
    ]);
  });

  it("keeps legacy behavior for tidbcloud _index pages", () => {
    const { filterNodesByToc } = require("../toc-filter");

    const tocFilesMap = new Map<string, Set<string>>([
      ["en/tidbcloud/master", new Set(["some-file"])],
    ]);
    const tocNamesByFileMap = new Map<string, Map<string, Set<string>>>();

    const nodes = [
      {
        slug: "en/tidbcloud/master/tidb-cloud/starter/_index",
        name: "",
        filePath: "tidb-cloud/starter/_index.md",
        pathConfig: {
          locale: Locale.en,
          repo: Repo.tidbcloud,
          branch: "master",
          version: null,
        } as PathConfig,
      },
    ];

    const result = filterNodesByToc(nodes, tocFilesMap, tocNamesByFileMap);
    expect(result.map((n: any) => n.slug)).toEqual([
      "en/tidbcloud/master/tidb-cloud/starter/_index",
    ]);
  });
});
