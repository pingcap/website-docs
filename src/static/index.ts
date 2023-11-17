import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import RedditIcon from "@mui/icons-material/Reddit";

import { StackOverflowIcon, SlackIcon, AskTugIcon, DiscordIcon } from "components/Icons";

import { convertVersionName } from "utils";
import CONFIG from "../../docs/docs.json";

export const DEFAULT_PINGCAP_URL = `https://www.pingcap.com`;
export const EN_PINGCAP_URL = `https://www.pingcap.com/`;
export const ZH_PINGCAP_URL = `https://cn.pingcap.com/`;
export const JA_PINGCAP_URL = `https://pingcap.co.jp/`;

export const EN_PINGCAP_DOWNLOAD_URL = "https://www.pingcap.com/download/";
export const ZH_PINGCAP_DOWNLOAD_URL =
  "https://cn.pingcap.com/product/#SelectProduct";
export const JA_PINGCAP_DOWNLOAD_URL = "https://pingcap.co.jp/event/";

export const EN_CONTACT_URL = "https://www.pingcap.com/contact-us/";
export const ZH_CONTACT_URL = "https://cn.pingcap.com/contact/";
export const JA_CONTACT_URL = "https://pingcap.co.jp/contact-us/";

export const EN_PRIVACY_POLICY_URL = "https://www.pingcap.com/privacy-policy";
export const ZH_PRIVACY_POLICY_URL = "https://cn.pingcap.com/privacy-policy";
export const JA_PRIVACY_POLICY_URL = "https://pingcap.co.jp/privacy-policy";

export const ICON_GROUP_CHUNK_SIZE = 3;

export const EN_ICON_GROUP = [
  {
    name: "github",
    href: "https://github.com/pingcap",
    icon: GitHubIcon,
  },
  {
    name: "twitter",
    href: "https://twitter.com/PingCAP",
    icon: TwitterIcon,
  },
  {
    name: "facebook",
    href: "https://facebook.com/pingcap2015",
    icon: FacebookIcon,
  },
  {
    name: "linkedin",
    href: "https://linkedin.com/company/pingcap",
    icon: LinkedInIcon,
  },
  {
    name: "slack",
    href: "https://slack.tidb.io/invite?team=tidb-community&channel=everyone&ref=pingcap-docs",
    icon: SlackIcon,
  },
  {
    name: "youtube",
    href: "https://youtube.com/channel/UCuq4puT32DzHKT5rU1IZpIA",
    icon: YouTubeIcon,
  },
  {
    name: "stackOverflow",
    href: "https://stackoverflow.com/questions/tagged/tidb",
    icon: StackOverflowIcon,
  },
  {
    name: "discord",
    href: "https://discord.gg/DQZ2dy3cuc?utm_source=doc",
    icon: DiscordIcon,
  },
  {
    name: "reddit",
    href: "https://reddit.com/r/TiDB/",
    icon: RedditIcon,
  }
];

export const ZH_ICON_GROUP = [
  {
    name: "github",
    href: "https://github.com/pingcap",
    icon: GitHubIcon,
  },
  {
    name: "asktug",
    href: "https://asktug.com/",
    icon: AskTugIcon,
  },
  {
    name: "twitter",
    href: "https://twitter.com/PingCAP",
    icon: TwitterIcon,
  },
  {
    name: "facebook",
    href: "https://facebook.com/pingcap2015",
    icon: FacebookIcon,
  },
  {
    name: "linkedin",
    href: "https://linkedin.com/company/pingcap",
    icon: LinkedInIcon,
  },
  {
    name: "slack",
    href: "https://slack.tidb.io/invite?team=tidb-community&channel=everyone&ref=pingcap-docs",
    icon: SlackIcon,
  },
  {
    name: "youtube",
    href: "https://youtube.com/channel/UCuq4puT32DzHKT5rU1IZpIA",
    icon: YouTubeIcon,
  },
  {
    name: "stackOverflow",
    href: "https://stackoverflow.com/questions/tagged/tidb",
    icon: StackOverflowIcon,
  },
  {
    name: "discord",
    href: "https://discord.gg/DQZ2dy3cuc?utm_source=doc",
    icon: DiscordIcon,
  },
  {
    name: "reddit",
    href: "https://reddit.com/r/TiDB/",
    icon: RedditIcon,
  },
];

export const JA_ICON_GROUP = [
  {
    name: "github",
    href: "https://github.com/pingcap",
    icon: GitHubIcon,
  },
  {
    name: "twitter",
    href: "https://twitter.com/PingCAP_Japan",
    icon: TwitterIcon,
  },
  {
    name: "linkedin",
    href: "https://www.linkedin.com/company/74771520/",
    icon: LinkedInIcon,
  },
  {
    name: "slack",
    href: "https://slack.tidb.io/invite?team=tidb-community&channel=everyone&ref=pingcap-docs",
    icon: SlackIcon,
  },
  {
    name: "youtube",
    href: "https://www.youtube.com/channel/UCatxrGZANSnii2fe7FeEwvg",
    icon: YouTubeIcon,
  },
  {
    name: "discord",
    href: "https://discord.gg/DQZ2dy3cuc?utm_source=doc",
    icon: DiscordIcon,
  },
];

export const EN_FOOTER_ITEMS = [
  {
    name: "Products",
    items: [
      {
        name: "TiDB",
        url: "https://www.pingcap.com/tidb/",
      },
      {
        name: "TiDB Dedicated",
        url: "https://www.pingcap.com/tidb-dedicated/",
      },
      {
        name: "TiDB Serverless",
        url: "https://www.pingcap.com/tidb-serverless/",
      },
      {
        name: "Pricing",
        url: "https://www.pingcap.com/pricing/",
      },
      {
        name: "Get Demo",
        url: "https://www.pingcap.com/demo/",
      },
      {
        name: "Get Started",
        url: "https://www.pingcap.com/get-started/",
      },
    ],
  },
  {
    name: "Ecosystem",
    items: [
      {
        name: "Integrations",
        url: "https://www.pingcap.com/integrations/",
      },
      {
        name: "TiKV",
        url: "https://github.com/tikv/tikv",
      },
      {
        name: "TiFlash",
        url: "https://github.com/pingcap/tiflash",
      },
      {
        name: "OSS Insight",
        url: "https://ossinsight.io/",
      },
    ],
  },
  {
    name: "Resources",
    items: [
      {
        name: "TiDB Cloud Roadmap",
        url: "https://docs.pingcap.com/tidbcloud/tidb-cloud-roadmap",
      },
      {
        name: "TiDB Roadmap",
        url: "https://docs.pingcap.com/tidb/dev/tidb-roadmap",
      },
      {
        name: "FAQs",
        url: "/tidb/stable/faq-overview",
      },
      {
        name: "Blog",
        url: "https://www.pingcap.com/blog/",
      },
      {
        name: "Education",
        url: "https://www.pingcap.com/education/",
      },
    ],
  },
  {
    name: "Support",
    items: [
      {
        name: "Discord",
        url: "https://discord.gg/DQZ2dy3cuc?utm_source=doc",
      },
      {
        name: "Forum",
        url: "https://ask.pingcap.com/",
      },
      {
        name: "Slack",
        url: "https://slack.tidb.io/invite?team=tidb-community&channel=everyone&ref=docs",
      },
      {
        name: "Support Portal",
        url: "https://support.pingcap.com/hc/en-us",
      },
    ],
  },
  {
    name: "Company",
    items: [
      {
        name: "About Us",
        url: "https://www.pingcap.com/about-us/",
      },
      {
        name: "Careers",
        url: "https://www.pingcap.com/careers/",
      },
      {
        name: "Legal",
        url: "https://www.pingcap.com/legal/",
      },
      {
        name: "Contact Us",
        url: "https://www.pingcap.com/contact-us/",
      },
    ],
  },
];

export const ZH_FOOTER_ITEMS = [
  {
    name: "产品",
    items: [
      {
        name: "TiDB",
        url: "https://cn.pingcap.com/product/#SelectProduct",
      },
      {
        name: "TiDB Cloud",
        url: "https://www.pingcap.com/tidb-cloud",
      },
    ],
  },
  {
    name: "生态",
    items: [
      {
        name: "TiKV",
        url: "https://github.com/tikv/tikv",
      },
      {
        name: "TiFlash",
        url: "https://github.com/pingcap/tiflash",
      },
      {
        name: "OSS Insight",
        url: "https://ossinsight.io/",
      },
    ],
  },
  {
    name: "资源",
    items: [
      {
        name: "TiDB 路线图",
        url: "https://docs.pingcap.com/zh/tidb/dev/tidb-roadmap",
      },
      {
        name: "常见问题解答",
        url: "/tidb/stable/faq-overview",
      },
      {
        name: "开发者手册",
        url: "/tidb/stable/dev-guide-overview",
      },
      {
        name: "博客",
        url: "https://cn.pingcap.com/blog/",
      },
      {
        name: "Education",
        url: "https://cn.pingcap.com/education/",
      },
    ],
  },
  {
    name: "支持",
    items: [
      {
        name: "社区",
        url: "https://asktug.com",
      },
      {
        name: "联系我们",
        url: "https://cn.pingcap.com/contact/",
      },
    ],
  },
  {
    name: "公司",
    items: [
      {
        name: "关于我们",
        url: "https://cn.pingcap.com/about-us?tab=companyOverview",
      },
      {
        name: "招贤纳士",
        url: "https://careers.pingcap.com",
      },
      {
        name: "新闻报道",
        url: "https://cn.pingcap.com/about-us?tab=news",
      },
    ],
  },
];

export const JA_FOOTER_ITEMS = [
  {
    name: "製品",
    items: [
      {
        name: "TiDB Cloud",
        url: "https://pingcap.co.jp/tidb-cloud/",
      },
      {
        name: "TiDB",
        url: "https://pingcap.co.jp/tidb-overview",
      },
      {
        name: "価格",
        url: "https://pingcap.co.jp/tidb-cloud-pricing/",
      },
      {
        name: "PoC お問い合わせ",
        url: "https://pingcap.co.jp/apply-for-poc/",
      },
    ],
  },
  {
    name: "エコシステム",
    items: [
      {
        name: "TiKV",
        url: "https://github.com/tikv/tikv",
      },
      {
        name: "TiFlash",
        url: "https://github.com/pingcap/tiflash",
      },
      {
        name: "OSS Insight",
        url: "https://ossinsight.io/",
      },
    ],
  },
  {
    name: "リソース",
    items: [
      {
        name: "よくあるご質問",
        url: "/tidb/stable/faq-overview",
      },
      {
        name: "開発者ガイド",
        url: "/tidb/stable/dev-guide-overview",
      },
      {
        name: "ニュース&ブログ",
        url: "https://pingcap.co.jp/news-and-blogs/",
      },
      {
        name: "Education",
        url: "https://www.pingcap.com/education/",
      },
      {
        name: "導入実績",
        url: "https://pingcap.co.jp/usecase/",
      },
    ],
  },
  {
    name: "サポート",
    items: [
      {
        name: "Discord",
        url: "https://discord.gg/DQZ2dy3cuc?utm_source=doc",
      },
      {
        name: "Forum",
        url: "https://ask.pingcap.com/",
      },
      {
        name: "Slack",
        url: "https://tidbcommunity.slack.com/join/shared_invite/zt-9vpzdqh2-8LsybcK0US_nqwvfAjSU5A#/shared-invite/email",
      },
      {
        name: "Support Portal",
        url: "https://support.pingcap.com/hc/en-us",
      },
    ],
  },
  {
    name: "会社関連",
    items: [
      {
        name: "会社概要",
        url: "https://pingcap.co.jp/company/",
      },
      {
        name: "キャリア",
        url: "https://pingcap.co.jp/キャリア/",
      },
      {
        name: "規約類",
        url: "https://pingcap.co.jp/legal/",
      },
      {
        name: "お問い合わせ",
        url: "https://pingcap.co.jp/contact-us/",
      },
    ],
  },
];

export const TIDB_EN_STABLE_VERSION = CONFIG["docs"]["tidb"]["stable"];
export const TIDB_EN_DMR_PRETTY_VERSION = CONFIG["docs"]["tidb"]["dmr"];
export const TIDB_EN_SEARCH_INDEX_VERSION =
  CONFIG["docs"]["tidb"]["searchIndex"] || [];
export const DM_EN_LATEST_VERSION =
  CONFIG["docs"]["tidb-data-migration"]["languages"]["en"]["versions"][0];
export const DM_EN_STABLE_VERSION = "";
export const OP_EN_STABLE_VERSION =
  CONFIG["docs"]["tidb-in-kubernetes"]["stable"];

export const TIDB_EN_VERSIONS = CONFIG["docs"]["tidb"]["languages"]["en"][
  "versions"
].map((d) => convertVersionName(d, TIDB_EN_STABLE_VERSION));

export const DM_EN_VERSIONS = CONFIG["docs"]["tidb-data-migration"][
  "languages"
]["en"]["versions"].map((d) => convertVersionName(d, DM_EN_STABLE_VERSION));

export const OP_EN_VERSIONS = CONFIG["docs"]["tidb-in-kubernetes"]["languages"][
  "en"
]["versions"].map((d) => convertVersionName(d, OP_EN_STABLE_VERSION));

export const CLOUD_EN_VERSIONS = [];

export const EN_DOC_TYPE_LIST = [
  {
    name: "TiDB Cloud",
    match: "tidbcloud",
  },
  {
    name: "TiDB",
    match: "tidb",
  },
  {
    name: "TiDB in Kubernetes",
    match: "tidb-in-kubernetes",
  },
  {
    name: "TiDB Data Migration (DM)",
    match: "tidb-data-migration",
  },
] as const;

export const ZH_DOC_TYPE_LIST = [
  {
    name: "TiDB",
    match: "tidb",
  },
  {
    name: "TiDB in Kubernetes",
    match: "tidb-in-kubernetes",
  },
  {
    name: "TiDB Data Migration (DM)",
    match: "tidb-data-migration",
  },
];

export const ARCHIVE_WEBSITE_URL = "https://docs-archive.pingcap.com";
