import CONFIG from "../../docs/docs.json";
import { TOCNamespace, TOCNamespaceSlugMap } from "../../src/shared/interface";
import { resolveMarkdownLink } from "../link-resolver";
import { generateConfig, generateNavTOCPath } from "../path";
import { mdxAstToToc } from "../toc";
import { filterNodesByToc, getFilesFromTocs } from "../toc-filter";
import { getTOCNamespace } from "../toc-namespace";
import { calculateFileUrl } from "../url-resolver";

const source = `en/tidb/${CONFIG.docs.tidb.stable}`;
const tocSlug = `${source}/TOC-tidb-cloud-filesystem`;
const tocAST = [
  {
    type: "list",
    ordered: false,
    children: [
      ["Introduction", "/tidb-cloud-filesystem/_index.md"],
      ["Quick Start", "/tidb-cloud-filesystem/filesystem-quick-start.md"],
      ["CLI Commands", "/ai/ti/reference/ti-filesystem.md"],
    ].map(([label, url]) => ({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "link", url, children: [{ type: "text", value: label }] },
          ],
        },
      ],
    })),
  },
];

describe("Filesystem product routing", () => {
  it.each([
    ["_index", "/tidbcloud-filesystem"],
    ["filesystem-quick-start", "/tidbcloud-filesystem/filesystem-quick-start"],
    ["guides/filesystem-mount", "/tidbcloud-filesystem/filesystem-mount"],
  ])("publishes %s with its own namespace and TOC", (name, expected) => {
    const slug = `${source}/tidb-cloud-filesystem/${name}`;
    expect(calculateFileUrl(slug, true)).toBe(expected);
    const namespace = getTOCNamespace(slug);
    expect(namespace).toBe(TOCNamespace.TiDBCloudFilesystem);
    expect(
      generateNavTOCPath(
        generateConfig(slug).config,
        TOCNamespaceSlugMap[namespace!]
      )
    ).toBe(tocSlug);
  });

  it("does not take over other TiDB versions or AI documentation", () => {
    expect(
      getTOCNamespace("en/tidb/master/tidb-cloud-filesystem/filesystem-mount")
    ).toBe(TOCNamespace.TiDB);
    expect(
      calculateFileUrl(
        "en/tidb/master/tidb-cloud-filesystem/filesystem-mount",
        true
      )
    ).toBe("/tidb/dev/filesystem-mount");
    expect(getTOCNamespace(`${source}/ai/ti/reference/ti-filesystem`)).toBe(
      TOCNamespace.AI
    );
    expect(
      calculateFileUrl(`${source}/ai/ti/reference/ti-filesystem`, true)
    ).toBe("/ai/ti-filesystem");
  });

  it.each([
    ["/tidb-cloud-filesystem/_index", "/ai", "/tidbcloud-filesystem"],
    [
      "/tidb-cloud-filesystem/filesystem-mount#finish-safely",
      "/ai/ti-quick-start",
      "/tidbcloud-filesystem/filesystem-mount#finish-safely",
    ],
    [
      "/tidb-cloud-filesystem/filesystem-mount",
      "/zh/ai",
      "/tidbcloud-filesystem/filesystem-mount",
    ],
    [
      "/ai/ti/reference/ti-filesystem",
      "/tidbcloud-filesystem",
      "/ai/ti-filesystem",
    ],
    [
      "/tidb-cloud/manage-api-keys",
      "/tidbcloud-filesystem",
      "/tidbcloud/manage-api-keys",
    ],
    [
      "filesystem-mount#finish-safely",
      "/tidbcloud-filesystem/filesystem-quick-start",
      "/tidbcloud-filesystem/filesystem-mount#finish-safely",
    ],
  ])("resolves %s from %s", (link, current, expected) => {
    expect(resolveMarkdownLink(link, current)).toBe(expected);
  });

  it("builds pages from the Filesystem TOC and keeps cross-product links", async () => {
    const nav = mdxAstToToc(tocAST as any, tocSlug);
    expect(nav.map((item) => item.link)).toEqual([
      "/tidbcloud-filesystem",
      "/tidbcloud-filesystem/filesystem-quick-start",
      "/ai/ti-filesystem",
    ]);
    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMdx: {
          nodes: [
            {
              id: "filesystem-toc",
              slug: tocSlug,
              mdxAST: { children: tocAST },
              parent: { relativePath: `${tocSlug}.md` },
            },
          ],
        },
      },
    });
    const { tocFilesMap, tocNamesByFileMap } = await getFilesFromTocs(graphql);
    const nodes = ["filesystem-quick-start", "unlisted-page"].map((name) => {
      const slug = `${source}/tidb-cloud-filesystem/${name}`;
      return { name, slug, pathConfig: generateConfig(slug).config };
    });
    const included = filterNodesByToc(nodes, tocFilesMap, tocNamesByFileMap);
    expect(included.map((node) => node.name)).toEqual([
      "filesystem-quick-start",
    ]);
    expect(included[0].tocNames).toEqual(["TOC-tidb-cloud-filesystem"]);
  });
});
