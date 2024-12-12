import {
  DEFAULT_PINGCAP_URL,
  EN_PINGCAP_URL,
  ZH_PINGCAP_URL,
  JA_PINGCAP_URL,
  EN_PINGCAP_DOWNLOAD_URL,
  ZH_PINGCAP_DOWNLOAD_URL,
  JA_PINGCAP_DOWNLOAD_URL,
  EN_CONTACT_URL,
  ZH_CONTACT_URL,
  JA_CONTACT_URL,
  ICON_GROUP_CHUNK_SIZE,
  EN_ICON_GROUP,
  ZH_ICON_GROUP,
  JA_ICON_GROUP,
  EN_FOOTER_ITEMS,
  ZH_FOOTER_ITEMS,
  JA_FOOTER_ITEMS,
  EN_PRIVACY_POLICY_URL,
  ZH_PRIVACY_POLICY_URL,
  JA_PRIVACY_POLICY_URL,
  ZH_LEARNING_CENTER_URL,
  EN_LEARNING_CENTER_URL,
  ZH_LEGAL_URL,
  JA_LEGAL_URL,
  EN_LEGAL_URL,
} from "shared/resources";
import { PathConfig, Locale, Repo } from "shared/interface";
import CONFIG from "../../../docs/docs.json";
import {
  PabloBookLoverSVG,
  TiDBBanner,
  TiDBCloudBanner,
} from "components/Icons/LearingPathIcon";

export function generateDocsHomeUrl(lang?: string) {
  switch (lang) {
    case "ja":
      return "/ja/";
    case "zh":
      return "/zh/";
    case "en":
    default:
      return "/";
  }
}

export function generatePingcapUrl(lang?: string) {
  switch (lang) {
    case "ja":
      return JA_PINGCAP_URL;
    case "zh":
      return ZH_PINGCAP_URL;
    case "en":
      return EN_PINGCAP_URL;
    default:
      return DEFAULT_PINGCAP_URL;
  }
}

export function generateDownloadURL(lang?: string) {
  switch (lang) {
    case "zh":
      return ZH_PINGCAP_DOWNLOAD_URL;
    case "ja":
      return JA_PINGCAP_DOWNLOAD_URL;
    case "en":
    default:
      return EN_PINGCAP_DOWNLOAD_URL;
  }
}

export function generateLearningCenterURL(lang?: string) {
  switch (lang) {
    case "zh":
      return ZH_LEARNING_CENTER_URL;
    case "en":
    default:
      return EN_LEARNING_CENTER_URL;
  }
}

export function generateContactURL(lang?: string) {
  switch (lang) {
    case "zh":
      return ZH_CONTACT_URL;
    case "ja":
      return JA_CONTACT_URL;
    case "en":
    default:
      return EN_CONTACT_URL;
  }
}

export function splitArrayIntoChunks(array: any[], chunkSize?: number) {
  if (array.length === 0) {
    return array;
  }
  const chunks = [];
  chunkSize = chunkSize || ICON_GROUP_CHUNK_SIZE;
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export function generateIconGroup(lang?: string) {
  switch (lang) {
    case "zh":
      return ZH_ICON_GROUP;
    case "ja":
      return JA_ICON_GROUP;
    case "en":
    default:
      return EN_ICON_GROUP;
  }
}

export function generateFooterItems(lang?: string) {
  switch (lang) {
    case "zh":
      return ZH_FOOTER_ITEMS;
    case "ja":
      return JA_FOOTER_ITEMS;
    case "en":
    default:
      return EN_FOOTER_ITEMS;
  }
}

export function generatePrivacyPolicy(lang?: string) {
  switch (lang) {
    case "zh":
      return ZH_PRIVACY_POLICY_URL;
    case "ja":
      return JA_PRIVACY_POLICY_URL;
    case "en":
    default:
      return EN_PRIVACY_POLICY_URL;
  }
}

export function generateLegalUrl(lang?: string) {
  switch (lang) {
    case "zh":
      return ZH_LEGAL_URL;
    case "ja":
      return JA_LEGAL_URL;
    case "en":
    default:
      return EN_LEGAL_URL;
  }
}

export function calcPDFUrl(config: PathConfig) {
  return `${config.repo}-${config.version ? config.version + "-" : ""}${
    config.locale
  }-manual.pdf`;
}

export function getRepoFromPathCfg(config: PathConfig) {
  const { languages } = CONFIG.docs[config.repo];

  if (config.locale in languages) {
    return languages[config.locale as Locale.en].repo;
  }

  throw new Error(`no ${config.locale} in repo ${config.repo}`);
}

export function getBannerByType(type: "home" | "tidb" | "tidb-cloud") {
  switch (type) {
    case "tidb":
      return TiDBBanner;
    case "tidb-cloud":
      return TiDBCloudBanner;
    case "home":
    default:
      return PabloBookLoverSVG;
  }
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

export function convertVersionName(version: string, stable: string) {
  switch (version) {
    case "master":
      return "dev";
    case stable:
      return "stable";
    default:
      return version.replace("release-", "v");
  }
}

// Support {#custom-id}
// Now `#origin-id {#custom-id}` will be transformed to `#custom-id`
export const transformCustomId = (
  label: string,
  anchor: string
): { label: string; anchor: string } => {
  if (!label || !anchor) {
    return { label, anchor };
  }
  const customIdMatches = label.match(/(.+) *\{(#.+)\}$/);
  if (customIdMatches?.length) {
    const [, newLabel, newAnchor] = customIdMatches;
    return { label: newLabel, anchor: newAnchor };
  }
  return { label, anchor };
};

export function removeHtmlTag(str: string) {
  if (!str) {
    return str;
  }
  const result = str
    .replace(/<[^>]*>/g, " ")
    .replace(/\\s+/g, " ")
    .trim();
  if (!result) {
    return str;
  }
  return result;
}

export function getStable(doc: Repo) {
  const docInfo = CONFIG.docs[doc];

  if ("stable" in docInfo) {
    return docInfo.stable;
  }

  return undefined;
}

export function generateUrl(filename: string, config: PathConfig) {
  const lang = config.locale === Locale.en ? "" : `/${config.locale}`;

  if (filename === "") {
    return `${lang}/${config.repo}/${config.version ? config.version : ""}`;
  }

  return `${lang}/${config.repo}/${
    config.version ? config.version + "/" : ""
  }${filename}`;
}

export function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  );
}

export function scrollToElementIfInView(
  element: HTMLElement & { scrollIntoViewIfNeeded: () => void }
) {
  const isVisiable = isInViewport(element);
  if (isVisiable) {
    return;
  }
  if (element.scrollIntoViewIfNeeded) {
    element.scrollIntoViewIfNeeded();
  } else {
    element.scrollIntoView({ block: "end" });
  }
}

export type PageType = "home" | "tidb" | "tidbcloud" | undefined;

export const getPageType = (language?: string, pageUrl?: string): PageType => {
  if (pageUrl === "/" || pageUrl === `/${language}/`) {
    return "home";
  } else if (pageUrl?.includes("/tidb/")) {
    return "tidb";
  } else if (
    pageUrl?.includes("/tidbcloud/") ||
    pageUrl?.endsWith("/tidbcloud")
  ) {
    return "tidbcloud";
  }
  return;
};
