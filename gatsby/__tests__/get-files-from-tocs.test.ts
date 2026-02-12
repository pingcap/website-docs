jest.mock("../toc", () => ({
  mdxAstToToc: jest.fn((_ast: any, tocSlug: string) => {
    if (tocSlug.endsWith("/TOC-api")) {
      return [{ type: "nav", link: "/api-only.md" }];
    }
    if (tocSlug.endsWith("/TOC-tidb-operator-releases")) {
      return [{ type: "nav", link: "/operator-releases-only.md" }];
    }
    if (tocSlug.endsWith("/TOC-tidb-cloud-starter")) {
      return [{ type: "nav", link: "/cloud-starter-only.md" }];
    }
    return [{ type: "nav", link: "/toc-only.md" }];
  }),
}));

jest.mock("../url-resolver", () => ({
  calculateFileUrl: jest.fn(() => null),
}));

describe("getFilesFromTocs TOC selection rules", () => {
  afterEach(() => {
    jest.resetModules();
  });

  function makeNode(slug: string, relativePath: string) {
    return {
      id: slug,
      slug,
      mdxAST: { children: [] },
      parent: { relativePath },
    };
  }

  it("tidb non-stable versions only read TOC.md", async () => {
    const { getFilesFromTocs } = require("../toc-filter");

    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMdx: {
          nodes: [
            makeNode(
              "zh/tidb/master/TOC",
              "docs/markdown-pages/zh/tidb/master/TOC.md"
            ),
            makeNode(
              "zh/tidb/master/TOC-api",
              "docs/markdown-pages/zh/tidb/master/TOC-api.md"
            ),
          ],
        },
      },
    });

    const { tocFilesMap } = await getFilesFromTocs(graphql);
    expect([...tocFilesMap.get("zh/tidb/dev")!]).toEqual(["toc-only"]);
  });

  it("tidb stable reads all TOCs under stable directory", async () => {
    const { getFilesFromTocs } = require("../toc-filter");

    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMdx: {
          nodes: [
            makeNode(
              "en/tidb/release-8.5/TOC",
              "docs/markdown-pages/en/tidb/release-8.5/TOC.md"
            ),
            makeNode(
              "en/tidb/release-8.5/TOC-api",
              "docs/markdown-pages/en/tidb/release-8.5/TOC-api.md"
            ),
          ],
        },
      },
    });

    const { tocFilesMap } = await getFilesFromTocs(graphql);
    expect(new Set(tocFilesMap.get("en/tidb/stable")!)).toEqual(
      new Set(["toc-only", "api-only"])
    );
  });

  it("tidb-in-kubernetes non-stable versions only read TOC.md", async () => {
    const { getFilesFromTocs } = require("../toc-filter");

    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMdx: {
          nodes: [
            makeNode(
              "en/tidb-in-kubernetes/release-2.0/TOC",
              "docs/markdown-pages/en/tidb-in-kubernetes/release-2.0/TOC.md"
            ),
            makeNode(
              "en/tidb-in-kubernetes/release-2.0/TOC-tidb-operator-releases",
              "docs/markdown-pages/en/tidb-in-kubernetes/release-2.0/TOC-tidb-operator-releases.md"
            ),
          ],
        },
      },
    });

    const { tocFilesMap } = await getFilesFromTocs(graphql);
    expect([...tocFilesMap.get("en/tidb-in-kubernetes/v2.0")!]).toEqual([
      "toc-only",
    ]);
  });

  it("tidbcloud always reads all TOCs under tidbcloud directory", async () => {
    const { getFilesFromTocs } = require("../toc-filter");

    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMdx: {
          nodes: [
            makeNode(
              "en/tidbcloud/master/TOC",
              "docs/markdown-pages/en/tidbcloud/master/TOC.md"
            ),
            makeNode(
              "en/tidbcloud/master/TOC-tidb-cloud-starter",
              "docs/markdown-pages/en/tidbcloud/master/TOC-tidb-cloud-starter.md"
            ),
          ],
        },
      },
    });

    const { tocFilesMap } = await getFilesFromTocs(graphql);
    expect(new Set(tocFilesMap.get("en/tidbcloud/master")!)).toEqual(
      new Set(["toc-only", "cloud-starter-only"])
    );
  });
});

