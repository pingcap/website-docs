import {
  getTidbCloudFilesFromTocs,
  determineInDefaultPlan,
} from "../cloud-plan";
import { CloudPlan } from "../../src/shared/interface";

jest.mock("../toc", () => ({
  mdxAstToToc: jest.fn((_ast: any, slug: string) => [
    {
      type: "nav",
      link: slug.endsWith("TOC-tidb-cloud-starter-postgresql")
        ? "/cloud-starter-postgresql-only.md"
        : "/cloud-starter-only.md",
    },
  ]),
}));

jest.mock("../toc-filter", () => ({
  extractFilesFromToc: jest.fn((nav: any[]) =>
    nav.map((item) => item.link.replace(/^\//, "").replace(/\.md$/, ""))
  ),
}));

jest.mock("../url-resolver", () => ({
  calculateFileUrl: jest.fn(() => null),
}));

describe("TiDB Cloud plan TOC membership", () => {
  it("unifies Starter MySQL and PostgreSQL TOC files", async () => {
    const graphql = jest.fn().mockResolvedValue({
      data: {
        allMdx: {
          nodes: [
            {
              slug: "en/tidbcloud/master/TOC-tidb-cloud-starter",
              mdxAST: { children: [] },
              parent: {
                relativePath:
                  "docs/markdown-pages/en/tidbcloud/master/TOC-tidb-cloud-starter.md",
              },
            },
            {
              slug: "en/tidbcloud/master/TOC-tidb-cloud-starter-postgresql",
              mdxAST: { children: [] },
              parent: {
                relativePath:
                  "docs/markdown-pages/en/tidbcloud/master/TOC-tidb-cloud-starter-postgresql.md",
              },
            },
          ],
        },
      },
    });

    const tocMap = await getTidbCloudFilesFromTocs(graphql);
    expect([...tocMap.get("en/tidbcloud/master")!.starter]).toEqual([
      "cloud-starter-only",
      "cloud-starter-postgresql-only",
    ]);
  });

  it("treats PostgreSQL-only Starter pages as Starter plan pages", () => {
    const result = determineInDefaultPlan(
      "cloud-starter-postgresql-only",
      { repo: "tidbcloud", locale: "en", branch: "master", version: null },
      new Map([
        [
          "en/tidbcloud/master",
          {
            dedicated: new Set(),
            starter: new Set(["cloud-starter-postgresql-only"]),
            essential: new Set(),
            premium: new Set(),
          },
        ],
      ])
    );

    expect(result).toBe(CloudPlan.Starter);
  });
});
