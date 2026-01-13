/**
 * Tests for url-resolver.ts
 */

import { parseSourcePath, calculateFileUrlWithConfig } from "../url-resolver";
import type { UrlResolverConfig } from "../types";
import { defaultUrlResolverConfig } from "../config";
import path from "path";

describe("parseSourcePath", () => {
  const sourceBasePath = "/base/path/docs/markdown-pages";

  it("should parse valid source path", () => {
    const absolutePath =
      "/base/path/docs/markdown-pages/en/tidb/master/alert-rules.md";
    const result = parseSourcePath(absolutePath, sourceBasePath);
    expect(result).toEqual({
      segments: ["en", "tidb", "master", "alert-rules.md"],
      filename: "alert-rules",
    });
  });

  it("should handle _index.md files", () => {
    const absolutePath =
      "/base/path/docs/markdown-pages/en/tidbcloud/master/tidb-cloud/dedicated/_index.md";
    const result = parseSourcePath(absolutePath, sourceBasePath);
    expect(result).toEqual({
      segments: [
        "en",
        "tidbcloud",
        "master",
        "tidb-cloud",
        "dedicated",
        "_index.md",
      ],
      filename: "_index",
    });
  });

  it("should handle relative path (slug format) without .md extension", () => {
    const slug = "en/tidb/master/alert-rules";
    const result = parseSourcePath(slug, sourceBasePath);
    expect(result).toEqual({
      segments: ["en", "tidb", "master", "alert-rules.md"],
      filename: "alert-rules",
    });
  });

  it("should handle relative path (slug format) with .md extension", () => {
    const slug = "en/tidb/master/alert-rules.md";
    const result = parseSourcePath(slug, sourceBasePath);
    expect(result).toEqual({
      segments: ["en", "tidb", "master", "alert-rules.md"],
      filename: "alert-rules",
    });
  });

  it("should handle relative path (slug format) with leading slash", () => {
    const slug = "/en/tidb/master/alert-rules";
    const result = parseSourcePath(slug, sourceBasePath);
    expect(result).toEqual({
      segments: ["en", "tidb", "master", "alert-rules.md"],
      filename: "alert-rules",
    });
  });

  it("should handle relative path for tidbcloud", () => {
    const slug = "en/tidbcloud/master/tidb-cloud/dedicated/_index";
    const result = parseSourcePath(slug, sourceBasePath);
    expect(result).toEqual({
      segments: [
        "en",
        "tidbcloud",
        "master",
        "tidb-cloud",
        "dedicated",
        "_index.md",
      ],
      filename: "_index",
    });
  });

  it("should return null for path with too few segments", () => {
    const absolutePath = "/base/path/docs/markdown-pages/en.md";
    const result = parseSourcePath(absolutePath, sourceBasePath);
    expect(result).toBeNull();
  });

  it("should handle paths with trailing slashes", () => {
    const absolutePath =
      "/base/path/docs/markdown-pages/en/tidb/master/alert-rules.md/";
    const result = parseSourcePath(absolutePath, sourceBasePath);
    expect(result).toEqual({
      segments: ["en", "tidb", "master", "alert-rules.md"],
      filename: "alert-rules",
    });
  });
});

describe("calculateFileUrl", () => {
  const sourceBasePath = path.resolve(
    __dirname,
    "../../../docs/markdown-pages"
  );

  const testConfig: UrlResolverConfig = {
    ...defaultUrlResolverConfig,
    sourceBasePath,
    // Test config: don't omit default language, use auto trailing slash
    defaultLanguage: undefined,
    trailingSlash: "auto",
    aliases: {
      "branch-alias": {
        context: {
          repo: ["tidb", "tidb-in-kubernetes"],
        },
        mappings: {
          master: "stable",
          main: "stable",
          "release-*": "v*",
        },
      },
    },
  };

  it("should resolve tidbcloud dedicated _index to /tidbcloud (first rule)", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidbcloud/master/tidb-cloud/dedicated/_index.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    // First rule matches: /{lang}/tidbcloud/master/tidb-cloud/dedicated/{filename}
    // with condition filename = "_index" -> /{lang}/tidbcloud
    // trailingSlash: "auto" adds trailing slash for _index files
    expect(url).toBe("/en/tidbcloud/");
  });

  it("should resolve tidbcloud _index with prefixes (second rule)", () => {
    // This test verifies the second rule for paths with multiple prefixes
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidbcloud/master/tidb-cloud/dedicated/starter/_index.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    // Second rule matches: /{lang}/tidbcloud/{branch}/tidb-cloud/{...prefixes}/{filename}
    // with conditionalTarget for _index -> /{lang}/tidbcloud/{prefixes}
    expect(url).toBe("/en/tidbcloud/dedicated/starter");
  });

  it("should resolve tidbcloud non-index without prefixes", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidbcloud/master/tidb-cloud/dedicated/some-page.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/tidbcloud/some-page/");
  });

  it("should resolve tidbcloud with multiple prefixes for _index", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidbcloud/master/tidb-cloud/dedicated/starter/_index.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/tidbcloud/dedicated/starter");
  });

  it("should resolve develop _index with folders", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/develop/subfolder/_index.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/develop/subfolder");
  });

  it("should resolve develop non-index without folders", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/develop/subfolder/some-page.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/develop/some-page/");
  });

  it("should resolve tidb with branch alias (master -> stable)", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/alert-rules.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/tidb/stable/alert-rules/");
  });

  it("should resolve tidb with branch alias (release-8.5 -> v8.5)", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/release-8.5/alert-rules.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/tidb/v8.5/alert-rules/");
  });

  it("should resolve tidb _index with branch alias", () => {
    const absolutePath = path.join(sourceBasePath, "en/tidb/master/_index.md");
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/tidb/stable");
  });

  it("should resolve tidb with folders and branch alias", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/subfolder/page.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/tidb/stable/page/");
  });

  it("should resolve api folder", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/api/overview.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/api/overview/");
  });

  it("should resolve best-practice folder", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/best-practice/guide.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/best-practice/guide/");
  });

  it("should resolve releases folder", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/releases/v8.5.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/releases/v8.5/");
  });

  it("should use fallback rule for unmatched patterns", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/other-repo/some-folder/page.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/other-repo/page/");
  });

  it("should handle fallback with _index", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/other-repo/some-folder/_index.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBe("/en/other-repo");
  });

  it("should return null for invalid path", () => {
    const absolutePath = "/invalid/path/file.md";
    const url = calculateFileUrlWithConfig(absolutePath, testConfig);
    expect(url).toBeNull();
  });
});

describe("calculateFileUrl with defaultLanguage: 'en'", () => {
  const sourceBasePath = path.resolve(
    __dirname,
    "../../../docs/markdown-pages"
  );

  const configWithDefaultLang: UrlResolverConfig = {
    ...defaultUrlResolverConfig,
    sourceBasePath,
    defaultLanguage: "en",
    trailingSlash: "never",
  };

  it("should omit /en/ prefix for English files (tidb)", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/alert-rules.md"
    );
    const url = calculateFileUrlWithConfig(
      absolutePath,
      configWithDefaultLang,
      true
    );
    expect(url).toBe("/tidb/stable/alert-rules");
  });

  it("should omit /en/ prefix for English files (tidbcloud)", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidbcloud/master/tidb-cloud/dedicated/some-page.md"
    );
    const url = calculateFileUrlWithConfig(
      absolutePath,
      configWithDefaultLang,
      true
    );
    expect(url).toBe("/tidbcloud/some-page");
  });

  it("should omit /en/ prefix for English dedicated _index files (tidbcloud)", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidbcloud/master/tidb-cloud/dedicated/_index.md"
    );
    const url = calculateFileUrlWithConfig(
      absolutePath,
      configWithDefaultLang,
      true
    );
    // First rule matches: /{lang}/tidbcloud/master/tidb-cloud/dedicated/{filename}
    // with condition filename = "_index" -> /{lang}/tidbcloud
    // After defaultLanguage omission: /tidbcloud
    // trailingSlash: "never" removes trailing slash
    expect(url).toBe("/tidbcloud");
  });

  it("should omit /en/ prefix for English develop files", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/develop/overview.md"
    );
    const url = calculateFileUrlWithConfig(
      absolutePath,
      configWithDefaultLang,
      true
    );
    expect(url).toBe("/develop/overview");
  });

  it("should keep /zh/ prefix for Chinese files", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "zh/tidb/master/alert-rules.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, configWithDefaultLang);
    expect(url).toBe("/zh/tidb/stable/alert-rules");
  });

  it("should keep /ja/ prefix for Japanese files", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "ja/tidb/master/alert-rules.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, configWithDefaultLang);
    expect(url).toBe("/ja/tidb/stable/alert-rules");
  });

  it("should omit /en/ prefix for English api files", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/api/overview.md"
    );
    const url = calculateFileUrlWithConfig(
      absolutePath,
      configWithDefaultLang,
      true
    );
    expect(url).toBe("/api/overview");
  });

  it("should omit /en/ prefix for English release branch files", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/release-8.5/alert-rules.md"
    );
    const url = calculateFileUrlWithConfig(
      absolutePath,
      configWithDefaultLang,
      true
    );
    expect(url).toBe("/tidb/v8.5/alert-rules");
  });
});

describe("calculateFileUrl with slug format (relative path)", () => {
  const sourceBasePath = path.resolve(
    __dirname,
    "../../../docs/markdown-pages"
  );

  const configWithDefaultLang: UrlResolverConfig = {
    sourceBasePath,
    defaultLanguage: "en",
    trailingSlash: "never",
    pathMappings: [
      // tidbcloud with prefix
      {
        sourcePattern:
          "/{lang}/{repo}/{branch}/{namespace}/{...prefixes}/{filename}",
        targetPattern: "/{lang}/{repo}/{filename}",
        conditions: {
          repo: ["tidbcloud"],
          namespace: ["tidb-cloud"],
        },
        filenameTransform: {
          ignoreIf: ["_index"],
          conditionalTarget: {
            keepIf: ["_index"],
            keepTargetPattern: "/{lang}/{repo}/{prefixes}",
          },
        },
      },
      // tidb with branch
      {
        sourcePattern: "/{lang}/{repo}/{branch}/{...folders}/{filename}",
        targetPattern: "/{lang}/{repo}/{branch:branch-alias}/{filename}",
        conditions: {
          repo: ["tidb", "tidb-in-kubernetes"],
        },
        filenameTransform: {
          ignoreIf: ["_index", "_docHome"],
        },
      },
      // Fallback
      {
        sourcePattern: "/{lang}/{repo}/{...any}/{filename}",
        targetPattern: "/{lang}/{repo}/{filename}",
        filenameTransform: {
          ignoreIf: ["_index", "_docHome"],
        },
      },
    ],
    aliases: {
      "branch-alias": {
        context: {
          repo: ["tidb", "tidb-in-kubernetes"],
        },
        mappings: {
          master: "stable",
          "release-*": "v*",
        },
      },
    },
  };

  it("should resolve slug format for tidb files", () => {
    const slug = "en/tidb/master/alert-rules";
    const url = calculateFileUrlWithConfig(slug, configWithDefaultLang, true);
    expect(url).toBe("/tidb/stable/alert-rules");
  });

  it("should resolve slug format for tidbcloud files", () => {
    const slug = "en/tidbcloud/master/tidb-cloud/dedicated/some-page";
    const url = calculateFileUrlWithConfig(slug, configWithDefaultLang, true);
    expect(url).toBe("/tidbcloud/some-page");
  });

  it("should resolve slug format for tidbcloud _index files", () => {
    const slug = "en/tidbcloud/master/tidb-cloud/dedicated/_index";
    const url = calculateFileUrlWithConfig(slug, configWithDefaultLang, true);
    expect(url).toBe("/tidbcloud/dedicated");
  });

  it("should resolve slug format with leading slash", () => {
    const slug = "/en/tidb/master/alert-rules";
    const url = calculateFileUrlWithConfig(slug, configWithDefaultLang, true);
    expect(url).toBe("/tidb/stable/alert-rules");
  });

  it("should resolve slug format for Chinese files", () => {
    const slug = "zh/tidb/master/alert-rules";
    const url = calculateFileUrlWithConfig(slug, configWithDefaultLang);
    expect(url).toBe("/zh/tidb/stable/alert-rules");
  });

  it("should return null for invalid slug format", () => {
    const invalidSlug = "invalid/path";
    const url = calculateFileUrlWithConfig(invalidSlug, configWithDefaultLang);
    expect(url).toBeNull();
  });
});

describe("calculateFileUrl with omitDefaultLanguage parameter", () => {
  const sourceBasePath = path.resolve(
    __dirname,
    "../../../docs/markdown-pages"
  );

  const configWithDefaultLang: UrlResolverConfig = {
    ...defaultUrlResolverConfig,
    sourceBasePath,
    defaultLanguage: "en",
    trailingSlash: "never",
  };

  it("should keep default language when omitDefaultLanguage is false (default)", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/alert-rules.md"
    );
    const url = calculateFileUrlWithConfig(absolutePath, configWithDefaultLang);
    expect(url).toBe("/en/tidb/stable/alert-rules");
  });

  it("should keep default language when omitDefaultLanguage is undefined (default)", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/alert-rules.md"
    );
    const url = calculateFileUrlWithConfig(
      absolutePath,
      configWithDefaultLang,
      false
    );
    expect(url).toBe("/en/tidb/stable/alert-rules");
  });

  it("should omit default language when omitDefaultLanguage is true", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "en/tidb/master/alert-rules.md"
    );
    const url = calculateFileUrlWithConfig(
      absolutePath,
      configWithDefaultLang,
      true
    );
    expect(url).toBe("/tidb/stable/alert-rules");
  });

  it("should keep non-default language even when omitDefaultLanguage is false", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "zh/tidb/master/alert-rules.md"
    );
    const url = calculateFileUrlWithConfig(
      absolutePath,
      configWithDefaultLang,
      false
    );
    expect(url).toBe("/zh/tidb/stable/alert-rules");
  });

  it("should keep non-default language when omitDefaultLanguage is true", () => {
    const absolutePath = path.join(
      sourceBasePath,
      "zh/tidb/master/alert-rules.md"
    );
    const url = calculateFileUrlWithConfig(
      absolutePath,
      configWithDefaultLang,
      true
    );
    expect(url).toBe("/zh/tidb/stable/alert-rules");
  });
});
