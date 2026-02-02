import {
  Locale,
  PathConfig,
  Repo,
  TOCNamespace,
} from "../../src/shared/interface";
import CONFIG from "../../docs/docs.json";

export function generateNavTOCPath(config: PathConfig, postSlug: string) {
  return `${config.locale}/${config.repo}/${config.branch}/TOC${
    postSlug ? `-${postSlug}` : ""
  }`;
}

/**
 * Namespace matching rule configuration
 */
export interface NamespaceRule {
  /** Target namespace to return when matched */
  namespace: TOCNamespace;
  /** Repo to match against (optional, matches all if not specified) */
  repo?: Repo | Repo[];
  /** Branch to match against (optional, matches all if not specified) */
  branch?: string | string[] | ((branch: string) => boolean);
  /** Folder name to match against (optional, matches all if not specified) */
  folder?: string | string[];
  /** Rest path segments to match against (optional) */
  restPath?: string | string[] | ((rest: string[]) => boolean);
  /** Minimum number of rest path segments required */
  minRestLength?: number;
}

/**
 * Configuration for shared namespace rules
 * Add new rules here to extend namespace matching logic
 */
const SHARED_NAMESPACE_RULES: NamespaceRule[] = [
  {
    namespace: TOCNamespace.AI,
    repo: Repo.tidb,
    branch: CONFIG.docs.tidb.stable,
    folder: "ai",
    minRestLength: 1,
  },
  {
    namespace: TOCNamespace.Develop,
    repo: Repo.tidb,
    branch: CONFIG.docs.tidb.stable,
    folder: "develop",
    minRestLength: 1,
  },
  {
    namespace: TOCNamespace.BestPractices,
    repo: Repo.tidb,
    branch: CONFIG.docs.tidb.stable,
    folder: "best-practices",
    minRestLength: 1,
  },
  {
    namespace: TOCNamespace.API,
    repo: Repo.tidb,
    branch: CONFIG.docs.tidb.stable,
    folder: "api",
    minRestLength: 1,
  },
  {
    namespace: TOCNamespace.TiDBReleases,
    repo: Repo.tidb,
    branch: CONFIG.docs.tidb.stable,
    folder: "releases",
    minRestLength: 1,
  },
  {
    namespace: TOCNamespace.TidbCloudReleases,
    repo: Repo.tidbcloud,
    folder: "tidb-cloud",
    restPath: (rest) => rest[0] === "releases",
  },
  {
    namespace: TOCNamespace.TiDBInKubernetesReleases,
    repo: Repo.operator,
    branch: "main",
    folder: "releases",
    minRestLength: 1,
  },
  {
    namespace: TOCNamespace.TiDB,
    repo: Repo.tidb,
  },
  {
    namespace: TOCNamespace.TiDBCloud,
    repo: Repo.tidbcloud,
  },
  {
    namespace: TOCNamespace.TiDBInKubernetes,
    repo: Repo.operator,
  },
];

/**
 * Check if a value matches the rule condition
 */
function matchesValue(
  value: string | undefined,
  condition?: string | string[] | ((val: string) => boolean)
): boolean {
  if (condition === undefined) {
    return true;
  }

  if (typeof condition === "function") {
    return value !== undefined && condition(value);
  }

  if (typeof condition === "string") {
    return value === condition;
  }

  return condition.includes(value!);
}

/**
 * Check if an array matches the rule condition
 */
function matchesArray(
  value: string[],
  condition?: string | string[] | ((arr: string[]) => boolean)
): boolean {
  if (condition === undefined) {
    return true;
  }

  if (typeof condition === "function") {
    return condition(value);
  }

  if (typeof condition === "string") {
    return value.includes(condition);
  }

  return condition.some((c) => value.includes(c));
}

/**
 * Check if a rule matches the given path segments
 */
function matchesRule(
  rule: NamespaceRule,
  repo: Repo,
  branch: string,
  folder: string | undefined,
  rest: string[]
): boolean {
  // Check repo
  if (rule.repo !== undefined) {
    const repos = Array.isArray(rule.repo) ? rule.repo : [rule.repo];
    if (!repos.includes(repo)) {
      return false;
    }
  }

  // Check branch
  if (!matchesValue(branch, rule.branch)) {
    return false;
  }

  // Check folder
  if (!matchesValue(folder, rule.folder)) {
    return false;
  }

  // Check minimum rest length
  if (rule.minRestLength !== undefined && rest.length < rule.minRestLength) {
    return false;
  }

  // Check rest path
  if (rule.restPath !== undefined) {
    if (!matchesArray(rest, rule.restPath)) {
      return false;
    }
  }

  return true;
}

/**
 * Get shared namespace from slug based on configured rules
 * Returns the first matching namespace or empty string if no match
 */
export const getTOCNamespace = (slug: string): TOCNamespace | undefined => {
  const [locale, repo, branch, folder, ...rest] = slug.split("/") as [
    Locale,
    Repo,
    string,
    string,
    ...string[]
  ];

  // Find the first matching rule
  for (const rule of SHARED_NAMESPACE_RULES) {
    if (matchesRule(rule, repo, branch, folder, rest)) {
      return rule.namespace;
    }
  }

  return;
};
