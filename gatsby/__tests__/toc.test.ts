import { mdxAstToToc } from "../toc";
import { extractFilesFromToc } from "../toc-filter";

describe("mdxAstToToc tag query parsing", () => {
  it("does not emit a bogus ?undefined query when the image URL has no query string", () => {
    const toc = mdxAstToToc(
      [
        {
          type: "list",
          children: [
            {
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [
                    { type: "text", value: "Data Service" },
                    {
                      type: "image",
                      alt: "PREVIEW",
                      url: "/media/tidb-cloud/blank_transparent_placeholder.png",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ] as any,
      "en/tidbcloud/master/TOC"
    );

    expect(toc[0].tag).toEqual({
      value: "PREVIEW",
      query: undefined,
    });
  });

  it("does not create a tag when the TOC image has no alt text", () => {
    const toc = mdxAstToToc(
      [
        {
          type: "list",
          children: [
            {
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [
                    { type: "text", value: "Data Service" },
                    {
                      type: "image",
                      alt: null,
                      url: "/media/tidb-cloud/blank_transparent_placeholder.png",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ] as any,
      "en/tidbcloud/master/TOC"
    );

    expect(toc[0].tag).toBeUndefined();
  });

  it("keeps tag query params when the image URL includes them", () => {
    const toc = mdxAstToToc(
      [
        {
          type: "list",
          children: [
            {
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [
                    { type: "text", value: "Beta Feature" },
                    {
                      type: "image",
                      alt: "BETA",
                      url: "/media/tidb-cloud/blank_transparent_placeholder.png?color=%232d9cd2",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ] as any,
      "en/tidbcloud/master/TOC"
    );

    expect(toc[0].tag).toEqual({
      value: "BETA",
      query: "?color=%232d9cd2",
    });
  });
});

describe("mdxAstToToc TiDB Operator releases navigation", () => {
  it("maps main release TOC links to stable URLs and preserves TOC membership", () => {
    const toc = mdxAstToToc(
      [
        {
          type: "list",
          children: [
            {
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [{ type: "text", value: "v2.0" }],
                },
                {
                  type: "list",
                  children: [
                    {
                      type: "listItem",
                      children: [
                        {
                          type: "paragraph",
                          children: [
                            {
                              type: "link",
                              url: "releases/release-2.0.0.md",
                              children: [{ type: "text", value: "2.0 GA" }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ] as any,
      "en/tidb-in-kubernetes/main/TOC-tidb-operator-releases"
    );

    expect(toc[0].children?.[0].link).toBe(
      "/tidb-in-kubernetes/stable/release-2.0.0"
    );
    expect(extractFilesFromToc(toc)).toEqual(["release-2.0.0"]);
  });
});
