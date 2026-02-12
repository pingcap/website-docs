import { NavConfig } from "./HeaderNavConfigType";
import { CLOUD_MODE_KEY } from "shared/useCloudPlan";
import { CloudPlan, TOCNamespace } from "shared/interface";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";

import TiDBCloudIcon from "media/icons/cloud-03.svg";
import TiDBIcon from "media/icons/layers-three-01.svg";

const PreviewBadge = (props: { label: string }) => {
  const theme = useTheme();
  return (
    <Chip
      label={props.label}
      size="small"
      variant="outlined"
      sx={{
        height: "20px",
        fontSize: "12px",
        fontWeight: 400,
        borderRadius: "10px",
        pointerEvents: "none",
        "& .MuiChip-label": {
          paddingLeft: "8px",
          paddingRight: "8px",
          lineHeight: "20px",
          color: theme.palette.carbon[700],
        },
      }}
    />
  );
};

/**
 * Default navigation configuration
 */
const getDefaultNavConfig = (
  t: (key: string) => string,
  cloudPlan: CloudPlan | null
): NavConfig[] => [
  {
    type: "group",
    title: t("navbar.product"),
    children: [
      {
        type: "group",
        title: t("navbar.cloud"),
        titleIcon: <TiDBCloudIcon width="16px" height="16px" />,
        children: [
          {
            type: "item",
            label: t("navbar.tidbCloudStarter"),
            to: `/tidbcloud/starter?${CLOUD_MODE_KEY}=${CloudPlan.Starter}`,
            selected: (namespace) =>
              namespace === TOCNamespace.TiDBCloud &&
              cloudPlan === CloudPlan.Starter,
            onClick: () => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem(CLOUD_MODE_KEY, CloudPlan.Starter);
              }
            },
          },
          {
            type: "item",
            label: t("navbar.tidbCloudEssential"),
            endIcon: <PreviewBadge label={t("navbar.badge.preview")} />,
            to: `/tidbcloud/essential?${CLOUD_MODE_KEY}=${CloudPlan.Essential}`,
            selected: (namespace) =>
              namespace === TOCNamespace.TiDBCloud &&
              cloudPlan === CloudPlan.Essential,
            onClick: () => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem(CLOUD_MODE_KEY, CloudPlan.Essential);
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
            label: t("navbar.tidbCloudDedicated"),
            to:
              cloudPlan === CloudPlan.Dedicated || !cloudPlan
                ? `/tidbcloud`
                : `/tidbcloud?${CLOUD_MODE_KEY}=${CloudPlan.Dedicated}`,
            selected: (namespace) =>
              namespace === TOCNamespace.TiDBCloud &&
              cloudPlan === CloudPlan.Dedicated,
            onClick: () => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem(CLOUD_MODE_KEY, CloudPlan.Dedicated);
              }
            },
          },
        ],
      },
      {
        type: "group",
        title: t("navbar.tidb"),
        titleIcon: <TiDBIcon width="16px" height="16px" />,
        children: [
          {
            type: "item",
            label: t("navbar.tidbShortTerm"),
            leftNavLabel: t("navbar.tidb"),
            to: "/tidb/stable",
            selected: (namespace) => namespace === TOCNamespace.TiDB,
          },
          {
            type: "item",
            label: t("navbar.tidbOnKubernetes"),
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
    label: t("navbar.ai"),
    leftNavLabel: t("navbar.tidbForAI"),
    to: "/ai",
    selected: (namespace) => namespace === TOCNamespace.AI,
  },
  {
    type: "item",
    label: t("navbar.developer"),
    to: "/developer",
    selected: (namespace) => namespace === TOCNamespace.Develop,
  },
  {
    type: "item",
    label: t("navbar.bestPractices"),
    to: "/best-practices",
    selected: (namespace) => namespace === TOCNamespace.BestPractices,
  },
  {
    type: "item",
    label: t("navbar.api"),
    to: "/api",
    selected: (namespace) => namespace === TOCNamespace.API,
  },
  {
    type: "group",
    title: t("navbar.releases"),
    children: [
      {
        type: "item",
        label: t("navbar.tidbCloudReleases"),
        to: "/releases/tidb-cloud",
        selected: (namespace) => namespace === TOCNamespace.TidbCloudReleases,
      },
      {
        type: "item",
        label: t("navbar.tidbSelfManagedReleases"),
        to: "/releases/tidb-self-managed",
        selected: (namespace) => namespace === TOCNamespace.TiDBReleases,
      },
      {
        type: "item",
        label: t("navbar.tidbOperatorReleases"),
        to: "/releases/tidb-operator",
        selected: (namespace) =>
          namespace === TOCNamespace.TiDBInKubernetesReleases,
        disabled: (lang: string) => lang === "ja",
      },
      {
        type: "item",
        label: t("navbar.tiupReleases"),
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
  return getDefaultNavConfig(t, cloudPlan);
};
