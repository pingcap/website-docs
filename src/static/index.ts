import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import RedditIcon from "@mui/icons-material/Reddit";

import { StackOverflowIcon, SlackIcon, AskTugIcon } from "components/Icons";

import { convertVersionName } from "utils";
import CONFIG from "../../docs/docs.json";

export const DEFAULT_PINGCAP_URL = `https://pingcap.com`;
export const EN_PINGCAP_URL = `https://en.pingcap.com/`;
export const ZH_PINGCAP_URL = `https://pingcap.com/zh/`;
export const JA_PINGCAP_URL = `https://pingcap.co.jp/`;

export const EN_PINGCAP_DOWNLOAD_URL = "https://en.pingcap.com/download";
export const ZH_PINGCAP_DOWNLOAD_URL =
  "https://pingcap.com/zh/product#SelectProduct";
export const JA_PINGCAP_DOWNLOAD_URL = "https://pingcap.co.jp/event/";

export const EN_CONTACT_URL = "https://en.pingcap.com/contact-us/";
export const ZH_CONTACT_URL = "https://pingcap.com/zh/contact/";
export const JA_CONTACT_URL = "https://pingcap.co.jp/contact-us/";

export const ICON_GROUP_CHUNK_SIZE = 3;

export const EN_ICON_GROUP = [
  {
    name: "github",
    href: "https://github.com/pingcap",
    icon: GitHubIcon,
  },
  {
    name: "stackOverflow",
    href: "https://stackoverflow.com/questions/tagged/tidb",
    icon: StackOverflowIcon,
  },
  {
    name: "twitter",
    href: "https://twitter.com/PingCAP",
    icon: TwitterIcon,
  },
  {
    name: "linkedin",
    href: "https://linkedin.com/company/pingcap",
    icon: LinkedInIcon,
  },
  {
    name: "facebook",
    href: "https://facebook.com/pingcap2015",
    icon: FacebookIcon,
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
    name: "reddit",
    href: "https://reddit.com/r/TiDB/",
    icon: RedditIcon,
  },
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
    name: "linkedin",
    href: "https://linkedin.com/company/pingcap",
    icon: LinkedInIcon,
  },
  {
    name: "facebook",
    href: "https://facebook.com/pingcap2015",
    icon: FacebookIcon,
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
];

export const EN_FOOTER_ITEMS = [
  {
    name: "Open Source Ecosystem",
    items: [
      {
        name: "TiDB",
        url: "https://en.pingcap.com/products/tidb",
      },
      {
        name: "TiKV",
        url: "https://github.com/tikv/tikv",
      },
      {
        name: "TiSpark",
        url: "https://github.com/pingcap/tispark",
      },
      {
        name: "Chaos Mesh",
        url: "https://github.com/pingcap/chaos-mesh",
      },
    ],
  },
  {
    name: "Resources",
    items: [
      {
        name: "Quick Start",
        url: "/tidb/stable/quick-start-with-tidb",
      },
      {
        name: "Community",
        url: "https://en.pingcap.com/community",
      },
      {
        name: "Forum",
        url: "https://ask.pingcap.com/",
      },
      {
        name: "Pricing",
        url: "https://en.pingcap.com/tidb-cloud-pricing",
      },
    ],
  },
  {
    name: "Use Cases",
    items: [
      {
        name: "Internet",
        url: "https://en.pingcap.com/customers/?industry=internet",
      },
      {
        name: "Financial services",
        url: "https://en.pingcap.com/customers/?industry=financial-services",
      },
      {
        name: "Gaming",
        url: "https://en.pingcap.com/customers/?industry=gaming",
      },
    ],
  },
  {
    name: "Company",
    items: [
      {
        name: "About",
        url: "https://en.pingcap.com/about-us/",
      },
      {
        name: "Careers",
        url: "https://en.pingcap.com/careers",
      },
      {
        name: "Legal",
        url: "https://en.pingcap.com/legal",
      },
      {
        name: "Blog",
        url: "https://en.pingcap.com/blog",
      },
      {
        name: "Contact Us",
        url: "https://en.pingcap.com/contact-us/",
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
        url: "/tidb/stable",
      },
    ],
  },
  {
    name: "资源",
    items: [
      {
        name: "快速上手",
        url: "/tidb/stable/quick-start-with-tidb",
      },
      {
        name: "最佳实践",
        url: "/tidb/stable/tidb-best-practices",
      },
      {
        name: "常见问题解答",
        url: "/tidb/stable/tidb-faq",
      },
      {
        name: "版本发布",
        url: "/tidb/dev/release-notes",
      },
    ],
  },
  {
    name: "学习",
    items: [
      {
        name: "客户案例",
        url: "https://pingcap.com/zh/case",
      },
      {
        name: "PingCAP Education",
        url: "https://learn.pingcap.com",
      },
      {
        name: "TiDB in Action",
        url: "https://book.tidb.io",
      },
    ],
  },
  {
    name: "支持",
    items: [
      {
        name: "TiDB 社区",
        url: "https://asktug.com",
      },
      {
        name: "联系我们",
        url: "https://pingcap.com/zh/contact/",
      },
    ],
  },
  {
    name: "公司",
    items: [
      {
        name: "关于我们",
        url: "https://pingcap.com/zh/about-us?tab=companyOverview",
      },
      {
        name: "招贤纳士",
        url: "https://careers.pingcap.com",
      },
      {
        name: "新闻报道",
        url: "https://pingcap.com/zh/about-us?tab=news",
      },
      {
        name: "博客",
        url: "https://pingcap.com/zh/blog",
      },
    ],
  },
];

export const JA_FOOTER_ITEMS = [
  {
    name: "エコシステム",
    items: [
      {
        name: "TiDB",
        url: "https://pingcap.co.jp/tidb-overview",
      },
      {
        name: "TiKV",
        url: "https://github.com/tikv/tikv",
      },
      {
        name: "TiSpark",
        url: "https://github.com/pingcap/tispark",
      },
      {
        name: "Chaos Mesh",
        url: "https://github.com/pingcap/chaos-mesh",
      },
    ],
  },
  {
    name: "リソース",
    items: [
      {
        name: "Quick Start",
        url: "/ja/tidb/stable/quick-start-with-tidb",
      },
      {
        name: "イベント",
        url: "https://pingcap.co.jp/event/",
      },
      {
        name: "ニュース&ブログ",
        url: "https://pingcap.co.jp/news-and-blogs/",
      },
      {
        name: "導入実績",
        url: "https://pingcap.co.jp/usecase/",
      },
      {
        name: "価格",
        url: "https://pingcap.co.jp/tidb-cloud/",
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
        name: "規約類",
        url: "https://pingcap.com/legal",
      },
      {
        name: "お問い合わせ",
        url: "https://pingcap.co.jp/contact-us/",
      },
    ],
  },
];

export const TIDB_EN_STABLE_VERSION = CONFIG["docs"]["tidb"]["stable"];
// export const DM_EN_STABLE_VERSION = CONFIG["docs"]["tidb-data-migration"]["stable"];
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
  {
    name: "Cloud",
    match: "tidbcloud",
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
