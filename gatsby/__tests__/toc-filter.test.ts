describe("toc-filter ignore rules", () => {
  const originalEnv = process.env.WEBSITE_IGNORED_TOC_RELATIVE_PATH_SUBSTRINGS;

  afterEach(() => {
    if (originalEnv == null) {
      delete process.env.WEBSITE_IGNORED_TOC_RELATIVE_PATH_SUBSTRINGS;
    } else {
      process.env.WEBSITE_IGNORED_TOC_RELATIVE_PATH_SUBSTRINGS = originalEnv;
    }
    jest.resetModules();
  });

  it("ignores TOC-pingkai.md for release-8.5 zh", () => {
    // Load module after reset to ensure env is applied consistently
    jest.resetModules();
    const { isIgnoredTocRelativePath } = require("../toc-ignore");

    expect(
      isIgnoredTocRelativePath(
        "markdown-pages/zh/tidb/release-8.5/TOC-pingkai.md"
      )
    ).toBe(true);
  });

  it("supports env-based ignore substrings", () => {
    process.env.WEBSITE_IGNORED_TOC_RELATIVE_PATH_SUBSTRINGS =
      "custom/TOC-ignore-me.md, TOC-some-other.md";

    jest.resetModules();
    const { isIgnoredTocRelativePath } = require("../toc-ignore");

    expect(isIgnoredTocRelativePath("custom/TOC-ignore-me.md")).toBe(true);
    expect(isIgnoredTocRelativePath("foo/bar/TOC-some-other.md")).toBe(true);
    expect(isIgnoredTocRelativePath("custom/TOC-keep-me.md")).toBe(false);
  });
});
