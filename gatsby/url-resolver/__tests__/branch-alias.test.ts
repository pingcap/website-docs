/**
 * Tests for branch-alias.ts
 */

import { getAlias, getVariableAlias } from "../branch-alias";
import type { AliasMapping, UrlResolverConfig } from "../types";

describe("getAlias", () => {
  it("should return exact match", () => {
    const mappings: AliasMapping = {
      master: "stable",
      main: "stable",
    };
    expect(getAlias(mappings, "master")).toBe("stable");
    expect(getAlias(mappings, "main")).toBe("stable");
  });

  it("should return null for non-existent key", () => {
    const mappings: AliasMapping = {
      master: "stable",
    };
    expect(getAlias(mappings, "unknown")).toBeNull();
  });

  it("should handle wildcard pattern matching", () => {
    const mappings: AliasMapping = {
      "release-*": "v*",
    };
    expect(getAlias(mappings, "release-8.5")).toBe("v8.5");
    expect(getAlias(mappings, "release-8.1")).toBe("v8.1");
    expect(getAlias(mappings, "release-7.5")).toBe("v7.5");
  });

  it("should handle multiple wildcards in pattern", () => {
    const mappings: AliasMapping = {
      "release-*-*": "v*-*",
    };
    expect(getAlias(mappings, "release-8-5")).toBe("v8-5");
  });

  it("should handle regex pattern matching", () => {
    const mappings: AliasMapping = {
      pattern: {
        pattern: "release-(.*)",
        replacement: "v$1",
        useRegex: true,
      },
    };
    expect(getAlias(mappings, "release-8.5")).toBe("v8.5");
    expect(getAlias(mappings, "release-8.1")).toBe("v8.1");
  });

  it("should prioritize exact match over pattern match", () => {
    const mappings: AliasMapping = {
      "release-8.5": "v8.5-specific",
      "release-*": "v*",
    };
    expect(getAlias(mappings, "release-8.5")).toBe("v8.5-specific");
    expect(getAlias(mappings, "release-8.1")).toBe("v8.1");
  });

  it("should return null for non-matching pattern", () => {
    const mappings: AliasMapping = {
      "release-*": "v*",
    };
    expect(getAlias(mappings, "master")).toBeNull();
  });
});

describe("getVariableAlias", () => {
  it("should return alias when context matches", () => {
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
    const contextVariables = {
      repo: "tidb",
    };
    expect(
      getVariableAlias("branch-alias", "master", config, contextVariables)
    ).toBe("stable");
  });

  it("should return null when context doesn't match", () => {
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
    const contextVariables = {
      repo: "other-repo",
    };
    expect(
      getVariableAlias("branch-alias", "master", config, contextVariables)
    ).toBeNull();
  });

  it("should return alias when no context is specified", () => {
    const config: Partial<UrlResolverConfig> = {
      aliases: {
        "branch-alias": {
          mappings: {
            master: "stable",
          },
        },
      },
    };
    const contextVariables = {};
    expect(
      getVariableAlias("branch-alias", "master", config, contextVariables)
    ).toBe("stable");
  });

  it("should handle multiple context conditions", () => {
    const config: Partial<UrlResolverConfig> = {
      aliases: {
        "branch-alias": {
          context: {
            repo: ["tidb"],
            lang: ["en"],
          },
          mappings: {
            master: "stable",
          },
        },
      },
    };
    const contextVariables1 = {
      repo: "tidb",
      lang: "en",
    };
    const contextVariables2 = {
      repo: "tidb",
      lang: "zh",
    };
    expect(
      getVariableAlias("branch-alias", "master", config, contextVariables1)
    ).toBe("stable");
    expect(
      getVariableAlias("branch-alias", "master", config, contextVariables2)
    ).toBeNull();
  });

  it("should return null for non-existent alias name", () => {
    const config: Partial<UrlResolverConfig> = {
      aliases: {},
    };
    const contextVariables = {};
    expect(
      getVariableAlias("non-existent", "master", config, contextVariables)
    ).toBeNull();
  });
});
