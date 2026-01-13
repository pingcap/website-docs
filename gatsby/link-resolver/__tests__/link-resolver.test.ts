/**
 * Tests for link-resolver.ts
 */

import { resolveMarkdownLink } from "../link-resolver";

describe("resolveMarkdownLink", () => {
  describe("External links and anchor links", () => {
    it("should return external http links as-is", () => {
      const result = resolveMarkdownLink(
        "http://example.com/page",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("http://example.com/page");
    });

    it("should return external https links as-is", () => {
      const result = resolveMarkdownLink(
        "https://example.com/page",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("https://example.com/page");
    });

    it("should return anchor links as-is", () => {
      const result = resolveMarkdownLink(
        "#section",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("#section");
    });

    it("should return empty link as-is", () => {
      const result = resolveMarkdownLink("", "/en/tidb/stable/alert-rules");
      expect(result).toBe("");
    });
  });

  describe("Links with hash (anchor)", () => {
    it("should preserve hash for namespace links", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search#data-types",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/vector-search#data-types");
    });

    it("should preserve hash for tidbcloud links", () => {
      const result = resolveMarkdownLink(
        "/dedicated/getting-started#quick-start",
        "/en/tidbcloud/dedicated"
      );
      expect(result).toBe("/tidbcloud/getting-started#quick-start");
    });

    it("should preserve hash for tidb links", () => {
      const result = resolveMarkdownLink(
        "/upgrade/upgrade-tidb-using-tiup#prerequisites",
        "/en/tidb/stable/upgrade"
      );
      expect(result).toBe("/tidb/stable/upgrade-tidb-using-tiup#prerequisites");
    });

    it("should preserve hash for links that don't match any rule", () => {
      const result = resolveMarkdownLink(
        "/some/path/to/page#section",
        "/en/tidb/some-path"
      );
      // /en/tidb/some-path matches Rule 3 /{lang}/{repo}/{branch}/{...any} where branch=some-path, {...any}=""
      // Link /some/path/to/page matches /{...any}/{docname} where {...any}=some/path/to, docname=page
      // Target: /{lang}/{repo}/{branch}/{docname} = /en/tidb/some-path/page
      // After defaultLanguage omission: /tidb/some-path/page
      expect(result).toBe("/tidb/some-path/page#section");
    });

    it("should preserve hash with multiple segments", () => {
      const result = resolveMarkdownLink(
        "/develop/a/b/c/page#anchor-name",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/page#anchor-name");
    });

    it("should preserve hash for links without leading slash", () => {
      const result = resolveMarkdownLink(
        "develop/vector-search#section",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/vector-search#section");
    });

    it("should preserve hash for tidb-in-kubernetes links", () => {
      const result = resolveMarkdownLink(
        "/deploy/deploy-tidb-on-kubernetes#configuration",
        "/en/tidb-in-kubernetes/stable/deploy"
      );
      expect(result).toBe(
        "/tidb-in-kubernetes/stable/deploy-tidb-on-kubernetes#configuration"
      );
    });

    it("should preserve hash for Chinese links", () => {
      const result = resolveMarkdownLink(
        "/dedicated/getting-started#快速开始",
        "/zh/tidbcloud/dedicated"
      );
      expect(result).toBe("/zh/tidbcloud/getting-started#快速开始");
    });

    it("should preserve hash for links that don't match any rule", () => {
      const result = resolveMarkdownLink(
        "/unknown/path#anchor",
        "/en/tidb/stable/alert-rules"
      );
      // Link doesn't match linkMappings, but matches linkMappingsByPath
      expect(result).toBe("/tidb/stable/path#anchor");
    });

    it("should handle hash with special characters", () => {
      const result = resolveMarkdownLink(
        "/develop/page#section-1_2-3",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/page#section-1_2-3");
    });
  });

  describe("linkMappings - namespace rules", () => {
    it("should resolve develop namespace links", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search/vector-search-data-types",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/vector-search-data-types");
    });

    it("should resolve best-practice namespace links", () => {
      const result = resolveMarkdownLink(
        "/best-practice/optimization/query-optimization",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/best-practice/query-optimization");
    });

    it("should resolve api namespace links", () => {
      const result = resolveMarkdownLink(
        "/api/overview/introduction",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/api/introduction");
    });

    it("should resolve releases namespace links", () => {
      const result = resolveMarkdownLink(
        "/releases/v8.5/release-notes",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/releases/release-notes");
    });

    it("should transform tidb-cloud to tidbcloud", () => {
      const result = resolveMarkdownLink(
        "/tidb-cloud/dedicated/getting-started",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/tidbcloud/getting-started");
    });

    it("should not match non-namespace links", () => {
      const result = resolveMarkdownLink(
        "/other/path/to/page",
        "/en/tidb/stable/alert-rules"
      );
      // Link /other/path/to/page doesn't match linkMappings (not a namespace)
      // But current page /en/tidb/stable/alert-rules matches /{lang}/{repo}/{branch}/{...any}
      // Link matches /{...any}/{docname} where {...any} = other/path/to, docname = page
      // Target pattern /{lang}/{repo}/{branch}/{docname} = /en/tidb/stable/page
      // After defaultLanguage omission: /tidb/stable/page
      expect(result).toBe("/tidb/stable/page");
    });

    it("should handle namespace links with multiple path segments", () => {
      const result = resolveMarkdownLink(
        "/develop/a/b/c/d/e/page",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/page");
    });
  });

  describe("linkMappingsByPath - tidbcloud pages", () => {
    it("should resolve links from tidbcloud pages (with lang)", () => {
      const result = resolveMarkdownLink(
        "/dedicated/getting-started",
        "/en/tidbcloud/dedicated"
      );
      expect(result).toBe("/tidbcloud/getting-started");
    });

    it("should resolve links from tidbcloud pages (without lang, default omitted)", () => {
      const result = resolveMarkdownLink(
        "/dedicated/getting-started",
        "/tidbcloud/dedicated"
      );
      // Should not match because pathPattern requires /{lang}/tidbcloud
      expect(result).toBe("/dedicated/getting-started");
    });

    it("should resolve links with multiple path segments from tidbcloud pages", () => {
      const result = resolveMarkdownLink(
        "/dedicated/setup/configuration",
        "/en/tidbcloud/dedicated"
      );
      expect(result).toBe("/tidbcloud/configuration");
    });

    it("should resolve links from tidbcloud pages /tidbcloud", () => {
      const result = resolveMarkdownLink(
        "/vector-search/vector-search-data-types",
        "/en/tidbcloud"
      );
      expect(result).toBe("/tidbcloud/vector-search-data-types");
    });
  });

  describe("linkMappingsByPath - tidb pages with branch", () => {
    it("should resolve links from tidb pages with stable branch", () => {
      const result = resolveMarkdownLink(
        "/upgrade/upgrade-tidb-using-tiup",
        "/en/tidb/stable/upgrade"
      );
      expect(result).toBe("/tidb/stable/upgrade-tidb-using-tiup");
    });

    it("should resolve links from tidb pages with version branch", () => {
      const result = resolveMarkdownLink(
        "/upgrade/upgrade-tidb-using-tiup",
        "/en/tidb/v8.5/upgrade"
      );
      expect(result).toBe("/tidb/v8.5/upgrade-tidb-using-tiup");
    });

    it("should resolve links from tidb-in-kubernetes pages", () => {
      const result = resolveMarkdownLink(
        "/deploy/deploy-tidb-on-kubernetes",
        "/en/tidb-in-kubernetes/stable/deploy"
      );
      expect(result).toBe(
        "/tidb-in-kubernetes/stable/deploy-tidb-on-kubernetes"
      );
    });

    it("should not match non-tidb repo pages (pathConditions check)", () => {
      const result = resolveMarkdownLink(
        "/upgrade/upgrade-tidb-using-tiup",
        "/en/other-repo/stable/upgrade"
      );
      // Should not match pathConditions for tidb/tidb-in-kubernetes, no fallback rule
      expect(result).toBe("/upgrade/upgrade-tidb-using-tiup");
    });

    it("should resolve links with multiple path segments from tidb pages", () => {
      const result = resolveMarkdownLink(
        "/upgrade/a/b/c/page",
        "/en/tidb/stable/upgrade"
      );
      expect(result).toBe("/tidb/stable/page");
    });
  });

  describe("Default language omission", () => {
    it("should omit /en/ prefix for English links from tidbcloud pages", () => {
      const result = resolveMarkdownLink(
        "/dedicated/getting-started",
        "/en/tidbcloud/dedicated"
      );
      expect(result).toBe("/tidbcloud/getting-started");
    });

    it("should omit /en/ prefix for English links from tidb pages", () => {
      const result = resolveMarkdownLink(
        "/upgrade/upgrade-tidb-using-tiup",
        "/en/tidb/stable/upgrade"
      );
      expect(result).toBe("/tidb/stable/upgrade-tidb-using-tiup");
    });

    it("should keep /zh/ prefix for Chinese links", () => {
      const result = resolveMarkdownLink(
        "/dedicated/getting-started",
        "/zh/tidbcloud/dedicated"
      );
      expect(result).toBe("/zh/tidbcloud/getting-started");
    });

    it("should keep /ja/ prefix for Japanese links", () => {
      const result = resolveMarkdownLink(
        "/upgrade/upgrade-tidb-using-tiup",
        "/ja/tidb/stable/upgrade"
      );
      expect(result).toBe("/ja/tidb/stable/upgrade-tidb-using-tiup");
    });
  });

  describe("Trailing slash handling", () => {
    it("should remove trailing slash (trailingSlash: never)", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search/",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/vector-search");
    });

    it("should handle links without trailing slash", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/vector-search");
    });
  });

  describe("Link path normalization", () => {
    it("should handle links without leading slash", () => {
      const result = resolveMarkdownLink(
        "develop/vector-search",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/vector-search");
    });

    it("should handle links with multiple leading slashes", () => {
      const result = resolveMarkdownLink(
        "///develop/vector-search",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/vector-search");
    });

    it("should handle empty path segments", () => {
      const result = resolveMarkdownLink(
        "/develop//vector-search",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/vector-search");
    });
  });

  describe("Edge cases", () => {
    it("should return original link if current page doesn't match any pathPattern", () => {
      const result = resolveMarkdownLink(
        "/unknown/path/to/page",
        "/en/unknown/current/page"
      );
      // No matching rule, should return original link
      expect(result).toBe("/unknown/path/to/page");
    });

    it("should handle root path links", () => {
      const result = resolveMarkdownLink("/", "/en/tidb/stable/alert-rules");
      expect(result).toBe("/");
    });

    it("should handle single segment links", () => {
      const result = resolveMarkdownLink(
        "/page",
        "/en/tidb/stable/alert-rules"
      );
      // Current page /en/tidb/stable/alert-rules matches Rule 3 /{lang}/{repo}/{branch}/{...any}:
      // - lang = en, repo = tidb, branch = stable, {...any} = alert-rules
      // Link /page matches /{...any}/{docname} where {...any} is empty, docname = page
      // Target pattern /{lang}/{repo}/{branch}/{docname} = /en/tidb/stable/page
      // After defaultLanguage omission: /tidb/stable/page
      expect(result).toBe("/tidb/stable/page");
    });

    it("should handle links with special characters", () => {
      const result = resolveMarkdownLink(
        "/develop/page-name-with-dashes",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/page-name-with-dashes");
    });
  });

  describe("Complex scenarios", () => {
    it("should resolve nested namespace links correctly", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search/vector-search-data-types/vector-search-data-types-overview",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/develop/vector-search-data-types-overview");
    });

    it("should resolve links from tidbcloud with multiple prefixes", () => {
      const result = resolveMarkdownLink(
        "/dedicated/starter/setup/config",
        "/en/tidbcloud/dedicated/starter"
      );
      expect(result).toBe("/tidbcloud/config");
    });

    it("should resolve links from tidb with deep folder structure", () => {
      const result = resolveMarkdownLink(
        "/upgrade/from-v7/to-v8/upgrade-guide",
        "/en/tidb/stable/upgrade/from-v7"
      );
      expect(result).toBe("/tidb/stable/upgrade-guide");
    });
  });
});
