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
      expect(result).toBe("/developer/vector-search#data-types");
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
      expect(result).toBe("/developer/page#anchor-name");
    });

    it("should preserve hash for links without leading slash", () => {
      const result = resolveMarkdownLink(
        "develop/vector-search#section",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/developer/vector-search#section");
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
      expect(result).toBe("/developer/page#section-1_2-3");
    });
  });

  describe("linkMappings - namespace rules", () => {
    it("should resolve develop namespace links (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search/vector-search-data-types",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/developer/vector-search-data-types");
    });

    it("should resolve develop namespace links (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search/vector-search-data-types",
        "/zh/tidb/stable/alert-rules"
      );
      expect(result).toBe("/zh/developer/vector-search-data-types");
    });

    it("should resolve develop namespace links (ja - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search/vector-search-data-types",
        "/ja/tidb/stable/alert-rules"
      );
      expect(result).toBe("/ja/developer/vector-search-data-types");
    });

    it("should resolve develop/_index links to developer root (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/develop/_index",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/developer");
    });

    it("should resolve develop/_index links to developer root (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/develop/_index",
        "/zh/tidb/stable/alert-rules"
      );
      expect(result).toBe("/zh/developer");
    });

    it("should resolve api/_index links to api root (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/api/_index",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/api");
    });

    it("should resolve best-practices namespace links (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/best-practices/optimization/query-optimization",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/best-practices/query-optimization");
    });

    it("should resolve best-practices namespace links (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/best-practices/optimization/query-optimization",
        "/zh/tidb/stable/alert-rules"
      );
      expect(result).toBe("/zh/best-practices/query-optimization");
    });

    it("should resolve api namespace links (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/api/overview/introduction",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/api/introduction");
    });

    it("should resolve api namespace links (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/api/overview/introduction",
        "/zh/tidb/stable/alert-rules"
      );
      expect(result).toBe("/zh/api/introduction");
    });

    it("should resolve ai namespace links (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/ai/overview/introduction",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/ai/introduction");
    });

    it("should resolve ai namespace links (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/ai/overview/introduction",
        "/zh/tidb/stable/alert-rules"
      );
      expect(result).toBe("/zh/ai/introduction");
    });

    it("should resolve releases/_index links to tidb-self-managed (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/releases/_index",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/releases/tidb-self-managed");
    });

    it("should resolve releases/_index links to tidb-self-managed (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/releases/_index",
        "/zh/tidb/stable/alert-rules"
      );
      expect(result).toBe("/zh/releases/tidb-self-managed");
    });

    it("should resolve releases/_index links to tidb-self-managed (en - currentPageUrl without language prefix)", () => {
      const result = resolveMarkdownLink(
        "/releases/_index",
        "/tidb/stable/alert-rules"
      );
      expect(result).toBe("/releases/tidb-self-managed");
    });

    it("should resolve tidb-cloud/releases/_index links (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/tidb-cloud/releases/_index",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/releases/tidb-cloud");
    });

    it("should resolve tidb-cloud/releases/_index links (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/tidb-cloud/releases/_index",
        "/zh/tidb/stable/alert-rules"
      );
      expect(result).toBe("/zh/releases/tidb-cloud");
    });

    it("should resolve tidb-cloud/releases/_index links (en - currentPageUrl without language prefix)", () => {
      const result = resolveMarkdownLink(
        "/tidb-cloud/releases/_index",
        "/tidb/stable/alert-rules"
      );
      expect(result).toBe("/releases/tidb-cloud");
    });

    it("should resolve tidb-in-kubernetes/releases/_index links from tidb-in-kubernetes pages (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/tidb-in-kubernetes/releases/_index",
        "/en/tidb-in-kubernetes/stable/deploy"
      );
      expect(result).toBe("/releases/tidb-operator");
    });

    it("should resolve tidb-in-kubernetes/releases/_index links from tidb-in-kubernetes pages (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/tidb-in-kubernetes/releases/_index",
        "/zh/tidb-in-kubernetes/stable/deploy"
      );
      expect(result).toBe("/zh/releases/tidb-operator");
    });

    it("should resolve tidb-in-kubernetes/releases/_index links from tidb-in-kubernetes pages (en - currentPageUrl without language prefix)", () => {
      const result = resolveMarkdownLink(
        "/tidb-in-kubernetes/releases/_index",
        "/tidb-in-kubernetes/stable/deploy"
      );
      expect(result).toBe("/releases/tidb-operator");
    });

    it("should resolve /releases/* links from releases/tidb-self-managed page (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/releases/release-8.5.4",
        "/en/releases/tidb-self-managed"
      );
      expect(result).toBe("/tidb/stable/release-8.5.4");
    });

    it("should resolve /releases/* links from releases/tidb-self-managed page (en - currentPageUrl without language prefix)", () => {
      const result = resolveMarkdownLink(
        "/releases/release-8.5.4",
        "/releases/tidb-self-managed"
      );
      expect(result).toBe("/tidb/stable/release-8.5.4");
    });

    it("should resolve /releases/* links from releases/tidb-self-managed page (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/releases/release-8.5.4",
        "/zh/releases/tidb-self-managed"
      );
      expect(result).toBe("/zh/tidb/stable/release-8.5.4");
    });

    it("should resolve /releases/* links from /tidb/dev/releases page (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/releases/release-8.5.4",
        "/en/tidb/dev/releases"
      );
      expect(result).toBe("/tidb/dev/release-8.5.4");
    });

    it("should resolve /releases/* links from /tidb/dev/releases page (en - currentPageUrl without language prefix)", () => {
      const result = resolveMarkdownLink(
        "/releases/release-8.5.4",
        "/tidb/dev/releases"
      );
      expect(result).toBe("/tidb/dev/release-8.5.4");
    });

    it("should resolve /releases/* links from /tidb/v8.1/releases page (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/releases/release-8.1.0",
        "/zh/tidb/v8.1/releases"
      );
      expect(result).toBe("/zh/tidb/v8.1/release-8.1.0");
    });

    it("should resolve /releases/* links from releases/tidb-operator page (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/releases/release-2.0.0",
        "/en/releases/tidb-operator"
      );
      expect(result).toBe("/tidb-in-kubernetes/dev/release-2.0.0");
    });

    it("should resolve /releases/* links from releases/tidb-operator page (en - currentPageUrl without language prefix)", () => {
      const result = resolveMarkdownLink(
        "/releases/release-2.0.0",
        "/releases/tidb-operator"
      );
      expect(result).toBe("/tidb-in-kubernetes/dev/release-2.0.0");
    });

    it("should resolve /releases/* links from releases/tidb-operator page (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/release-2.0.0",
        "/en/releases/tidb-operator"
      );
      expect(result).toBe("/tidb-in-kubernetes/dev/release-2.0.0");
    });

    it("should resolve /releases/* links from releases/tidb-operator page (en - currentPageUrl without language prefix)", () => {
      const result = resolveMarkdownLink(
        "/release-2.0.0",
        "/releases/tidb-operator"
      );
      expect(result).toBe("/tidb-in-kubernetes/dev/release-2.0.0");
    });

    it("should resolve /releases/* links from releases/tidb-operator page (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/releases/release-2.0.0",
        "/zh/releases/tidb-operator"
      );
      expect(result).toBe("/zh/tidb-in-kubernetes/dev/release-2.0.0");
    });

    it("should resolve /releases/* links from releases/tidb-operator page (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/release-2.0.0",
        "/zh/releases/tidb-operator"
      );
      expect(result).toBe("/zh/tidb-in-kubernetes/dev/release-2.0.0");
    });

    it("should resolve releases namespace links (en - matches Rule 4, not Rule 1)", () => {
      const result = resolveMarkdownLink(
        "/releases/v8.5/release-notes",
        "/en/tidb/stable/alert-rules"
      );
      // /releases/v8.5/release-notes doesn't match Rule 1 (releases not in conditions)
      // Matches Rule 4: current page /en/tidb/stable/alert-rules matches /{lang}/{repo}/{branch}/{...any}
      // Link /releases/v8.5/release-notes matches /{...any}/{docname}
      // Target: /{lang}/{repo}/{branch}/{docname} = /en/tidb/stable/release-notes
      // After defaultLanguage omission: /tidb/stable/release-notes
      expect(result).toBe("/tidb/stable/release-notes");
    });

    it("should resolve releases namespace links (zh - matches Rule 4, not Rule 1)", () => {
      const result = resolveMarkdownLink(
        "/releases/v8.5/release-notes",
        "/zh/tidb/stable/alert-rules"
      );
      // Same as above but with zh language prefix
      expect(result).toBe("/zh/tidb/stable/release-notes");
    });

    it("should transform tidb-cloud to tidbcloud (en - default language omitted)", () => {
      const result = resolveMarkdownLink(
        "/tidb-cloud/dedicated/getting-started",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/tidbcloud/getting-started");
    });

    it("should transform tidb-cloud to tidbcloud (zh - language prefix included)", () => {
      const result = resolveMarkdownLink(
        "/tidb-cloud/dedicated/getting-started",
        "/zh/tidb/stable/alert-rules"
      );
      expect(result).toBe("/zh/tidbcloud/getting-started");
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

    it("should handle namespace links with multiple path segments (en)", () => {
      const result = resolveMarkdownLink(
        "/develop/a/b/c/d/e/page",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/developer/page");
    });

    it("should handle namespace links with multiple path segments (zh)", () => {
      const result = resolveMarkdownLink(
        "/develop/a/b/c/d/e/page",
        "/zh/tidb/stable/alert-rules"
      );
      expect(result).toBe("/zh/developer/page");
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
      // Should match by assuming default language is omitted from currentPageUrl
      expect(result).toBe("/tidbcloud/getting-started");
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

    it("should resolve _index links from tidb pages with stable branch", () => {
      const result = resolveMarkdownLink(
        "/upgrade/_index",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/tidb/stable/upgrade");
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

    it("should resolve _index links from tidb-in-kubernetes pages", () => {
      const result = resolveMarkdownLink(
        "/deploy/_index",
        "/en/tidb-in-kubernetes/stable/deploy"
      );
      expect(result).toBe("/tidb-in-kubernetes/stable/deploy");
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

  describe("linkMappingsByPath - Rule 3: developer/best-practices/api/ai/releases namespace pages", () => {
    it("should resolve links from develop namespace page", () => {
      const result = resolveMarkdownLink(
        "/vector-search/vector-search-overview",
        "/en/developer/vector-search"
      );
      expect(result).toBe("/tidb/stable/vector-search-overview");
    });

    it("should resolve links from best-practices namespace page", () => {
      const result = resolveMarkdownLink(
        "/optimization/query-optimization",
        "/en/best-practices/optimization"
      );
      expect(result).toBe("/tidb/stable/query-optimization");
    });

    it("should resolve links from api namespace page", () => {
      const result = resolveMarkdownLink(
        "/tiproxy/tiproxy-api",
        "/en/api/tiproxy-api-overview"
      );
      expect(result).toBe("/tidb/stable/tiproxy-api");
    });

    it("should resolve links from ai namespace page", () => {
      const result = resolveMarkdownLink("/some/linked-doc", "/en/ai/overview");
      expect(result).toBe("/tidb/stable/linked-doc");
    });

    it("should resolve links from releases namespace page", () => {
      const result = resolveMarkdownLink(
        "/v8.5/release-notes",
        "/en/releases/v8.5"
      );
      // Current page /en/releases/v8.5 doesn't match Rule 3 (releases not in pathConditions)
      // Should return original link or match other rules
      // Actually matches Rule 4: /en/releases/v8.5 matches /{lang}/{repo}/{branch}/{...any} where repo=releases, branch=v8.5
      // But repo="releases" is not in pathConditions ["tidb", "tidb-in-kubernetes"]
      // So it doesn't match Rule 4 either
      // Should return original link
      expect(result).toBe("/v8.5/release-notes");
    });

    it("should resolve links with multiple path segments from develop namespace", () => {
      const result = resolveMarkdownLink(
        "/vector-search/data-types/vector-search-data-types-overview",
        "/en/developer/vector-search/data-types"
      );
      expect(result).toBe("/tidb/stable/vector-search-data-types-overview");
    });

    it("should resolve links with multiple path segments from best-practices namespace", () => {
      const result = resolveMarkdownLink(
        "/optimization/query/query-performance-tuning",
        "/en/best-practices/optimization/query"
      );
      expect(result).toBe("/tidb/stable/query-performance-tuning");
    });

    it("should resolve links with multiple path segments from api namespace", () => {
      const result = resolveMarkdownLink(
        "/overview/api-reference/getting-started",
        "/en/api/overview/api-reference"
      );
      expect(result).toBe("/tidb/stable/getting-started");
    });

    it("should resolve links with multiple path segments from releases namespace", () => {
      const result = resolveMarkdownLink(
        "/v8.5/whats-new/features",
        "/en/releases/v8.5/whats-new"
      );
      // Current page /en/releases/v8.5/whats-new doesn't match Rule 3 (releases not in pathConditions)
      // Should return original link or match other rules
      // Actually matches Rule 4: /en/releases/v8.5/whats-new matches /{lang}/{repo}/{branch}/{...any} where repo=releases, branch=v8.5
      // But repo="releases" is not in pathConditions ["tidb", "tidb-in-kubernetes"]
      // So it doesn't match Rule 4 either
      // Should return original link
      expect(result).toBe("/v8.5/whats-new/features");
    });

    it("should preserve hash for links from develop namespace", () => {
      const result = resolveMarkdownLink(
        "/vector-search/vector-search-overview#data-types",
        "/en/developer/vector-search"
      );
      expect(result).toBe("/tidb/stable/vector-search-overview#data-types");
    });

    it("should preserve hash for links from best-practices namespace", () => {
      const result = resolveMarkdownLink(
        "/optimization/query-optimization#index-selection",
        "/en/best-practices/optimization"
      );
      expect(result).toBe("/tidb/stable/query-optimization#index-selection");
    });

    it("should resolve links from Chinese develop namespace", () => {
      const result = resolveMarkdownLink(
        "/vector-search/vector-search-overview",
        "/zh/developer/vector-search"
      );
      expect(result).toBe("/zh/tidb/stable/vector-search-overview");
    });

    it("should resolve links from Japanese develop namespace", () => {
      const result = resolveMarkdownLink(
        "/vector-search/vector-search-overview",
        "/ja/developer/vector-search"
      );
      expect(result).toBe("/ja/tidb/stable/vector-search-overview");
    });

    it("should resolve single segment links from develop namespace", () => {
      const result = resolveMarkdownLink(
        "/page-name",
        "/en/developer/vector-search"
      );
      expect(result).toBe("/tidb/stable/page-name");
    });

    it("should resolve links from develop namespace root", () => {
      const result = resolveMarkdownLink(
        "/vector-search-overview",
        "/en/developer"
      );
      expect(result).toBe("/tidb/stable/vector-search-overview");
    });

    it("should resolve links from api namespace root", () => {
      const result = resolveMarkdownLink("/api-overview", "/en/api");
      expect(result).toBe("/tidb/stable/api-overview");
    });

    it("should handle links without leading slash from develop namespace", () => {
      const result = resolveMarkdownLink(
        "vector-search/vector-search-overview",
        "/en/developer/vector-search"
      );
      expect(result).toBe("/tidb/stable/vector-search-overview");
    });

    it("should resolve links from best-practices namespace with deep nesting", () => {
      const result = resolveMarkdownLink(
        "/a/b/c/d/e/page",
        "/en/best-practices/a/b/c/d/e"
      );
      expect(result).toBe("/tidb/stable/page");
    });

    it("should resolve links from releases namespace with version segments", () => {
      const result = resolveMarkdownLink(
        "/v8.5/changelog/changes",
        "/en/releases/v8.5/changelog"
      );
      // Current page /en/releases/v8.5/changelog doesn't match Rule 3 (releases not in pathConditions)
      // Should return original link or match other rules
      // Actually matches Rule 4: /en/releases/v8.5/changelog matches /{lang}/{repo}/{branch}/{...any} where repo=releases, branch=v8.5
      // But repo="releases" is not in pathConditions ["tidb", "tidb-in-kubernetes"]
      // So it doesn't match Rule 4 either
      // Should return original link
      expect(result).toBe("/v8.5/changelog/changes");
    });

    it("should not match non-develop/best-practices/api/releases namespace pages", () => {
      const result = resolveMarkdownLink(
        "/some/path/to/page",
        "/en/other-namespace/some/path"
      );
      // Should not match Rule 3 (namespace is "other-namespace", not in pathConditions)
      // Should return original link or match other rules
      expect(result).toBe("/some/path/to/page");
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

  describe("curLang variable", () => {
    it("should extract curLang from current page URL first segment (en)", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search",
        "/en/tidb/stable/alert-rules"
      );
      // curLang should be "en" and omitted in result
      expect(result).toBe("/developer/vector-search");
    });

    it("should extract curLang from current page URL first segment (zh)", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search",
        "/zh/tidb/stable/alert-rules"
      );
      // curLang should be "zh" and included in result
      expect(result).toBe("/zh/developer/vector-search");
    });

    it("should extract curLang from current page URL first segment (ja)", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search",
        "/ja/tidb/stable/alert-rules"
      );
      // curLang should be "ja" and included in result
      expect(result).toBe("/ja/developer/vector-search");
    });

    it("should handle curLang when current page URL has no language prefix", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search",
        "/tidb/stable/alert-rules"
      );
      // curLang should fallback to default language when language prefix is omitted
      expect(result).toBe("/developer/vector-search");
    });

    it("should use curLang in releases/_index target pattern for tidb-self-managed", () => {
      const result = resolveMarkdownLink(
        "/releases/_index",
        "/zh/tidb/stable/alert-rules"
      );
      expect(result).toBe("/zh/releases/tidb-self-managed");
    });

    it("should use curLang in tidb-cloud/releases/_index target pattern", () => {
      const result = resolveMarkdownLink(
        "/tidb-cloud/releases/_index",
        "/ja/tidb/stable/alert-rules"
      );
      expect(result).toBe("/ja/releases/tidb-cloud");
    });

    it("should use curLang in tidb-in-kubernetes/releases/_index target pattern", () => {
      const result = resolveMarkdownLink(
        "/tidb-in-kubernetes/releases/_index",
        "/ja/tidb-in-kubernetes/stable/deploy"
      );
      expect(result).toBe("/ja/releases/tidb-operator");
    });

    it("should use curLang in namespace links target pattern", () => {
      const result = resolveMarkdownLink(
        "/api/overview/introduction",
        "/zh/tidb/stable/alert-rules"
      );
      expect(result).toBe("/zh/api/introduction");
    });
  });

  describe("Trailing slash handling", () => {
    it("should remove trailing slash (trailingSlash: never)", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search/",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/developer/vector-search");
    });

    it("should handle links without trailing slash", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/developer/vector-search");
    });
  });

  describe("Link path normalization", () => {
    it("should handle links without leading slash", () => {
      const result = resolveMarkdownLink(
        "develop/vector-search",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/developer/vector-search");
    });

    it("should handle links with multiple leading slashes", () => {
      const result = resolveMarkdownLink(
        "///develop/vector-search",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/developer/vector-search");
    });

    it("should handle empty path segments", () => {
      const result = resolveMarkdownLink(
        "/develop//vector-search",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/developer/vector-search");
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
      expect(result).toBe("/developer/page-name-with-dashes");
    });
  });

  describe("Complex scenarios", () => {
    it("should resolve nested namespace links correctly", () => {
      const result = resolveMarkdownLink(
        "/develop/vector-search/vector-search-data-types/vector-search-data-types-overview",
        "/en/tidb/stable/alert-rules"
      );
      expect(result).toBe("/developer/vector-search-data-types-overview");
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
