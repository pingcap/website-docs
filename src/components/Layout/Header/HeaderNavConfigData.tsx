import { NavConfig } from "./HeaderNavConfigType";
import { CLOUD_MODE_KEY } from "shared/useCloudPlan";
import { CloudPlan, TOCNamespace } from "shared/interface";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import TiDBCloudIcon from "media/icons/cloud-03.svg";
import TiDBIcon from "media/icons/layers-three-01.svg";

/**
 * Default navigation configuration
 */
const getDefaultNavConfig = (
  cloudPlan: CloudPlan | null,
  language?: string
): NavConfig[] => [
  {
    type: "group",
    title: "Product",
    children: [
      {
        type: "group",
        title: "TiDB Cloud",
        titleIcon: <TiDBCloudIcon width="16px" height="16px" />,
        children: [
          {
            type: "item",
            label: "TiDB Cloud Starter",
            to: `/tidbcloud/starter?${CLOUD_MODE_KEY}=starter`,
            selected: (namespace) =>
              namespace === TOCNamespace.TiDBCloud &&
              cloudPlan === CloudPlan.Starter,
            onClick: () => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem(CLOUD_MODE_KEY, "starter");
              }
            },
          },
          {
            type: "item",
            label: "TiDB Cloud Essential",
            to: `/tidbcloud/essential?${CLOUD_MODE_KEY}=essential`,
            selected: (namespace) =>
              namespace === TOCNamespace.TiDBCloud &&
              cloudPlan === CloudPlan.Essential,
            onClick: () => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem(CLOUD_MODE_KEY, "essential");
              }
            },
          },
          // {
          //   type: "item",
          //   label: "TiDB Cloud Premium",
          //   to: `/tidbcloud/premium?${CLOUD_MODE_KEY}=premium`,
          //   selected: (namespace) =>
          //     namespace === TOCNamespace.TiDBCloud &&
          //     cloudPlan === CloudPlan.Premium,
          //   onClick: () => {
          //     if (typeof window !== "undefined") {
          //       sessionStorage.setItem(CLOUD_MODE_KEY, "premium");
          //     }
          //   },
          // },
          {
            type: "item",
            label: "TiDB Cloud Dedicated",
            to:
              cloudPlan === "dedicated" || !cloudPlan
                ? `/tidbcloud`
                : `/tidbcloud?${CLOUD_MODE_KEY}=dedicated`,
            selected: (namespace) =>
              namespace === TOCNamespace.TiDBCloud &&
              cloudPlan === CloudPlan.Dedicated,
            onClick: () => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem(CLOUD_MODE_KEY, "dedicated");
              }
            },
          },
        ],
      },
      {
        type: "group",
        title: "TiDB Self-Managed",
        titleIcon: <TiDBIcon width="16px" height="16px" />,
        children: [
          {
            type: "item",
            label: "Deploy Using TiUP",
            to: "/tidb/stable",
            selected: (namespace) => namespace === TOCNamespace.TiDB,
          },
          {
            type: "item",
            label: "Deploy on Kubernetes",
            to: "/tidb-in-kubernetes/stable",
            selected: (namespace) =>
              namespace === TOCNamespace.TiDBInKubernetes,
            disabled: (lang: string) => lang === "ja",
          },
        ],
      },
    ],
  },
  {
    type: "item",
    label: "Developer",
    to: "/develop",
    selected: (namespace) => namespace === TOCNamespace.Develop,
  },
  {
    type: "item",
    label: "Best Practices",
    to: "/best-practice",
    selected: (namespace) => namespace === TOCNamespace.BestPractice,
  },
  {
    type: "item",
    label: "API",
    to: "/api",
    selected: (namespace) => namespace === TOCNamespace.API,
  },
  {
    type: "group",
    title: "Releases",
    children: [
      {
        type: "item",
        label: "TiDB Cloud Releases",
        to: "/releases/tidb-cloud",
        selected: (namespace) => namespace === TOCNamespace.TidbCloudReleases,
      },
      {
        type: "item",
        label: "TiDB Self-Managed Releases",
        to: "/releases/tidb-self-managed",
        selected: (namespace) => namespace === TOCNamespace.TiDBReleases,
      },
      {
        type: "item",
        label: "TiDB Operator Releases",
        to: "/releases/tidb-operator",
        selected: (namespace) =>
          namespace === TOCNamespace.TiDBInKubernetesReleases,
        disabled: (lang: string) => lang === "ja",
      },
      {
        type: "item",
        label: "TiUP Releases",
        to: "https://github.com/pingcap/tiup/releases",
        selected: () => false,
        endIcon: <OpenInNewIcon sx={{ fontSize: "14px", marginLeft: "4px" }} />,
      },
    ],
  },
];

/**
 * Archive navigation configuration (only TiDB Self-Managed)
 */
const archiveNavConfig: NavConfig[] = [
  {
    type: "item",
    label: "TiDB Self-Managed",
    to: "/tidb/v2.1",
    selected: (namespace) => namespace === TOCNamespace.TiDB,
  },
];

/**
 * Generate navigation configuration
 */
export const generateNavConfig = (
  t: (key: string) => string,
  cloudPlan: CloudPlan | null,
  buildType?: string,
  language?: string
): NavConfig[] => {
  if (buildType === "archive") {
    return archiveNavConfig;
  }
  return getDefaultNavConfig(cloudPlan, language);
};
