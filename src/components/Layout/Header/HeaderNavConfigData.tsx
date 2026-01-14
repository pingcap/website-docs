import { NavConfig } from "./HeaderNavConfigType";
import { PageType } from "shared/usePageType";
import { CLOUD_MODE_KEY } from "shared/useCloudPlan";
import { CloudPlan } from "shared/interface";

import TiDBCloudIcon from "media/icons/cloud-03.svg";
import TiDBIcon from "media/icons/layers-three-01.svg";

/**
 * Default navigation configuration
 */
const getDefaultNavConfig = (cloudPlan: CloudPlan | null): NavConfig[] => [
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
            selected: (pageType) =>
              pageType === PageType.TiDBCloud &&
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
            selected: (pageType) =>
              pageType === PageType.TiDBCloud &&
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
          //   selected: (pageType) =>
          //     pageType === PageType.TiDBCloud &&
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
            selected: (pageType) =>
              pageType === PageType.TiDBCloud &&
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
            label: "TiDB Self-Managed",
            to: "/tidb/stable",
            selected: (pageType) => pageType === PageType.TiDB,
          },
          {
            type: "item",
            label: "TiDB Self-Managed on Kubernetes",
            to: "/tidb-in-kubernetes/stable",
            selected: (pageType) => pageType === PageType.TiDBInKubernetes,
          },
        ],
      },
    ],
  },
  {
    type: "item",
    label: "Developer",
    to: "/develop",
    selected: (pageType) => pageType === PageType.Develop,
  },
  {
    type: "item",
    label: "Best Practices",
    to: "/best-practice",
    selected: (pageType) => pageType === PageType.BestPractice,
  },
  {
    type: "item",
    label: "API",
    to: "/api",
    selected: (pageType) => pageType === PageType.Api,
  },
  {
    type: "group",
    title: "Releases",
    children: [
      {
        type: "item",
        label: "TiDB Cloud Releases",
        to: "/release/tidbcloud",
        selected: (pageType) => pageType === PageType.Releases,
      },
      {
        type: "item",
        label: "TiDB Self-Managed Releases",
        to: "/releases",
        selected: (pageType) => pageType === PageType.Releases,
      },
      {
        type: "item",
        label: "TiDB Operator Releases",
        to: "/release/tidb-in-kubernetes",
        selected: (pageType) => pageType === PageType.Releases,
      },
      {
        type: "item",
        label: "TiUP Releases",
        to: "/release/tiup",
        selected: (pageType) => pageType === PageType.Releases,
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
    selected: (pageType) => pageType === PageType.TiDB,
  },
];

/**
 * Generate navigation configuration
 */
export const generateNavConfig = (
  t: (key: string) => string,
  cloudPlan: CloudPlan | null,
  buildType?: string
): NavConfig[] => {
  if (buildType === "archive") {
    return archiveNavConfig;
  }
  return getDefaultNavConfig(cloudPlan);
};
