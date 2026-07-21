import { mdxAstToToc } from "../toc";

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
