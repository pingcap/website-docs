import { Repo, Locale } from "../src/shared/interface";
import config from "../docs/docs.json";

export function getRepo(doc: Repo, lang: Locale) {
  const { languages } = config.docs[doc];

  if (lang in languages) {
    return languages[lang as Locale.en].repo;
  }

  throw new Error(`no ${lang} in repo ${doc}`);
}

export function getStable(doc: Repo) {
  const docInfo = config.docs[doc];

  if ("stable" in docInfo) {
    return docInfo.stable;
  }

  return undefined;
}

function renameVersion(version: string, stable: string | undefined) {
  switch (version) {
    case "master":
      return "dev";
    case stable:
      return "stable";
    default:
      return version.replace("release-", "v");
  }
}

export function renameVersionByDoc(doc: Repo, version: string) {
  switch (doc) {
    case "tidb":
    case "tidb-data-migration":
    case "tidb-in-kubernetes":
      return renameVersion(version, getStable(doc));
    case "tidbcloud":
      return;
  }
}

function genDocCategory(slug: string, separator = "/") {
  const [name, branch] = slug.split("/");

  return `${name}${separator}${renameVersionByDoc(name as Repo, branch)}`;
}

export function genTOCSlug(slug: string) {
  return `${slug.split("/").slice(0, 3).join("/")}/TOC`;
}

export function genPDFDownloadURL(slug: string, lang: Locale) {
  return `${genDocCategory(slug, "-")}-${lang}-manual.pdf`;
}

/**
 * Replace disk path to url path.
 *
 * @param {string} slug - mdx slug.
 * @param {string} name - filename.
 * @param {string} lang
 * @param {string} pathWithoutVersion
 * @returns {string} - Replaced path.
 */
export function replacePath(
  slug: string,
  name: string,
  lang: Locale,
  pathWithoutVersion: string
) {
  const docPath = genDocCategory(slug);
  const language = lang === "en" ? "" : "/" + lang;

  if (name === "_index") {
    return `${language}/${docPath}`;
  }

  return `${language}/${docPath}/${pathWithoutVersion}`;
}
