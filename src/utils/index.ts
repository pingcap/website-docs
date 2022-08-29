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
} from "static";
import { PathConfig, Locale } from "static/Type";
import CONFIG from "../../docs.json";
import {
  PabloBookLoverSVG,
  TiDBBanner,
  TiDBCloudBanner,
} from "components/Icons/LearingPathIcon";

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
      return EN_FOOTER_ITEMS;
    case "ja":
      return JA_FOOTER_ITEMS;
    case "en":
    default:
      return EN_FOOTER_ITEMS;
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
