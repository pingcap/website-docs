/**
 * Tests for pattern-matcher.ts
 */

import { matchPattern, applyPattern } from "../pattern-matcher";
import type { UrlResolverConfig } from "../types";

describe("matchPattern", () => {
  it("should match simple pattern with variables", () => {
    const pattern = "/{lang}/{repo}/{filename}";
    const segments = ["en", "tidb", "alert-rules"];
    const result = matchPattern(pattern, segments);
    expect(result).toEqual({
      lang: "en",
      repo: "tidb",
      filename: "alert-rules",
    });
  });

  it("should match pattern with variable segments (0 segments)", () => {
    const pattern = "/{lang}/{repo}/{...folders}/{filename}";
    const segments = ["en", "tidb", "alert-rules"];
    const result = matchPattern(pattern, segments);
    expect(result).toEqual({
      lang: "en",
      repo: "tidb",
      folders: "",
      filename: "alert-rules",
    });
  });

  it("should match pattern with variable segments (1 segment)", () => {
    const pattern = "/{lang}/{repo}/{...folders}/{filename}";
    const segments = ["en", "tidb", "subfolder", "alert-rules"];
    const result = matchPattern(pattern, segments);
    expect(result).toEqual({
      lang: "en",
      repo: "tidb",
      folders: "subfolder",
      filename: "alert-rules",
    });
  });

  it("should match pattern with variable segments (multiple segments)", () => {
    const pattern = "/{lang}/{repo}/{...folders}/{filename}";
    const segments = [
      "en",
      "tidb",
      "folder1",
      "folder2",
      "folder3",
      "alert-rules",
    ];
    const result = matchPattern(pattern, segments);
    expect(result).toEqual({
      lang: "en",
      repo: "tidb",
      folders: "folder1/folder2/folder3",
      filename: "alert-rules",
    });
  });

  it("should match pattern with variable segments at the end", () => {
    const pattern = "/{lang}/{repo}/{namespace}/{...prefixes}/{filename}";
    const segments = [
      "en",
      "tidbcloud",
      "tidb-cloud",
      "dedicated",
      "starter",
      "_index",
    ];
    const result = matchPattern(pattern, segments);
    expect(result).toEqual({
      lang: "en",
      repo: "tidbcloud",
      namespace: "tidb-cloud",
      prefixes: "dedicated/starter",
      filename: "_index",
    });
  });

  it("should return null for non-matching pattern", () => {
    const pattern = "/{lang}/{repo}/{filename}";
    const segments = ["en", "tidb", "folder", "alert-rules"];
    const result = matchPattern(pattern, segments);
    expect(result).toBeNull();
  });

  it("should match complex pattern with conditions", () => {
    const pattern = "/{lang}/{repo}/{namespace}/{...prefixes}/{filename}";
    const segments = ["en", "tidbcloud", "tidb-cloud", "dedicated", "_index"];
    const result = matchPattern(pattern, segments);
    expect(result).toEqual({
      lang: "en",
      repo: "tidbcloud",
      namespace: "tidb-cloud",
      prefixes: "dedicated",
      filename: "_index",
    });
  });
});

describe("applyPattern", () => {
  it("should apply simple pattern with variables", () => {
    const pattern = "/{lang}/{repo}/{filename}";
    const variables = {
      lang: "en",
      repo: "tidb",
      filename: "alert-rules",
    };
    const result = applyPattern(pattern, variables);
    expect(result).toBe("/en/tidb/alert-rules");
  });

  it("should skip empty variables (from 0-match variable segments)", () => {
    const pattern = "/{lang}/{repo}/{folders}/{filename}";
    const variables = {
      lang: "en",
      repo: "tidb",
      folders: "",
      filename: "alert-rules",
    };
    const result = applyPattern(pattern, variables);
    expect(result).toBe("/en/tidb/alert-rules");
  });

  it("should expand variable segments with slashes", () => {
    const pattern = "/{lang}/{repo}/{folders}/{filename}";
    const variables = {
      lang: "en",
      repo: "tidb",
      folders: "folder1/folder2/folder3",
      filename: "alert-rules",
    };
    const result = applyPattern(pattern, variables);
    expect(result).toBe("/en/tidb/folder1/folder2/folder3/alert-rules");
  });

  it("should apply alias syntax with context", () => {
    const pattern = "/{lang}/{repo}/{branch:branch-alias}/{filename}";
    const variables = {
      lang: "en",
      repo: "tidb",
      branch: "master",
      filename: "alert-rules",
    };
    const config: Partial<UrlResolverConfig> = {
      aliases: {
        "branch-alias": {
          context: {
            repo: ["tidb", "tidb-in-kubernetes"],
          },
          mappings: {
            master: "stable",
          },
        },
      },
    };
    const result = applyPattern(pattern, variables, config);
    expect(result).toBe("/en/tidb/stable/alert-rules");
  });

  it("should not apply alias when context doesn't match", () => {
    const pattern = "/{lang}/{repo}/{branch:branch-alias}/{filename}";
    const variables = {
      lang: "en",
      repo: "other-repo",
      branch: "master",
      filename: "alert-rules",
    };
    const config: Partial<UrlResolverConfig> = {
      aliases: {
        "branch-alias": {
          context: {
            repo: ["tidb", "tidb-in-kubernetes"],
          },
          mappings: {
            master: "stable",
          },
        },
      },
    };
    const result = applyPattern(pattern, variables, config);
    expect(result).toBe("/en/other-repo/master/alert-rules");
  });

  it("should handle wildcard alias patterns", () => {
    const pattern = "/{lang}/{repo}/{branch:branch-alias}/{filename}";
    const variables = {
      lang: "en",
      repo: "tidb",
      branch: "release-8.5",
      filename: "alert-rules",
    };
    const config: Partial<UrlResolverConfig> = {
      aliases: {
        "branch-alias": {
          context: {
            repo: ["tidb"],
          },
          mappings: {
            "release-*": "v*",
          },
        },
      },
    };
    const result = applyPattern(pattern, variables, config);
    expect(result).toBe("/en/tidb/v8.5/alert-rules");
  });

  it("should handle empty folders variable", () => {
    const pattern = "/{lang}/{repo}/{folders}/{filename}";
    const variables = {
      lang: "en",
      repo: "tidb",
      folders: "",
      filename: "alert-rules",
    };
    const result = applyPattern(pattern, variables);
    expect(result).toBe("/en/tidb/alert-rules");
  });
});
