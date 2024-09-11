import { Locale, Repo, PathConfig } from "../src/shared/interface";
import CONFIG from "../docs/docs.json";

export function generateUrl(filename: string, config: PathConfig) {
  const lang = config.locale === Locale.en ? "" : `/${config.locale}`;

  if (filename === "") {
    return `${lang}/${config.repo}/${config.version ? config.version : ""}`;
  }

  return `${lang}/${config.repo}/${
    config.version ? config.version + "/" : ""
  }${filename}`;
}

export const generateDocHomeUrl = (filename: string, config: PathConfig) => {
  const lang = config.locale === Locale.en ? "" : `/${config.locale}`;

  return `${lang}/`;
};

export function generatePdfUrl(config: PathConfig) {
  return `${config.repo}-${config.version ? config.version + "-" : ""}${
    config.locale
  }-manual.pdf`;
}

export function generateNav(config: PathConfig) {
  return `${config.locale}/${config.repo}/${config.branch}/TOC`;
}

export function generateConfig(slug: string): {
  config: PathConfig;
  filePath: string;
  name: string;
} {
  const [locale, repo, branch, ...rest] = slug.split("/") as [
    Locale,
    Repo,
    string,
    ...string[]
  ];

  const name = rest[rest.length - 1];

  let filePath = rest.join("/") + ".md";
  if (repo === Repo.dm || repo === Repo.operator) {
    filePath = `${locale}/${filePath}`;
  }

  return {
    config: { locale, repo, branch, version: branchToVersion(repo, branch) },
    filePath,
    name: name === "_index" ? "" : name,
  };
}

function branchToVersion(repo: Repo, branch: string) {
  switch (repo) {
    case Repo.tidb:
    case Repo.operator: {
      const stable = CONFIG.docs[repo].stable;
      switch (branch) {
        case "master":
          return "dev";
        case stable:
          return "stable";
        default:
          return branch.replace("release-", "v");
      }
    }
    case Repo.dm:
      return branch.replace("release-", "v");

    case Repo.tidbcloud:
      return null;
  }
}

export const AllVersion = Object.keys(CONFIG.docs).reduce((acc, val) => {
  const repo = val as Repo;
  acc[repo] = Object.keys(CONFIG.docs[repo].languages).reduce((acc, val) => {
    const locale = val as Locale.en;
    acc[locale] = CONFIG.docs[repo].languages[locale].versions.map((v) =>
      branchToVersion(repo, v)
    );
    return acc;
  }, {} as Record<Locale, (string | null)[]>);
  return acc;
}, {} as Record<Repo, Record<Locale, (string | null)[]>>);

export function getRepo(config: PathConfig) {
  const { languages } = CONFIG.docs[config.repo];

  if (config.locale in languages) {
    return languages[config.locale as Locale.en].repo;
  }

  throw new Error(`no ${config.locale} in repo ${config.repo}`);
}
