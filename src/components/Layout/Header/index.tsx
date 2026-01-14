import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";

import LinkComponent, { BlueAnchorLink } from "components/Link";
import HeaderNavStack from "components/Layout/Header/HeaderNav";
import { HeaderNavStackMobile } from "components/Layout/Header/HeaderNavMobile";
import HeaderAction from "components/Layout/Header/HeaderAction";
import { LangSwitch } from "components/Layout/Header/LangSwitch";

import TiDBLogo from "media/logo/tidb-logo-withtext.svg";

import { Locale, BuildType, PathConfig, TOCNamespace } from "shared/interface";
import { GTMEvent, gtmTrack } from "shared/utils/gtm";
import { Banner } from "components/Layout/Banner";
import { generateDocsHomeUrl, generateUrl } from "shared/utils";
import { useI18next } from "gatsby-plugin-react-i18next";
import { useIsAutoTranslation } from "shared/useIsAutoTranslation";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { getHeaderHeight, HEADER_HEIGHT } from "shared/headerHeight";

import { NavItemConfig } from "./HeaderNavConfigType";

interface HeaderProps {
  bannerEnabled?: boolean;
  menu?: React.ReactNode;
  locales: Locale[];
  docInfo?: { type: string; version: string };
  buildType?: BuildType;
  pageUrl?: string;
  name?: string;
  pathConfig?: PathConfig;
  namespace?: TOCNamespace;
  onSelectedNavItemChange?: (item: NavItemConfig | null) => void;
}

export default function Header(props: HeaderProps) {
  const { language } = useI18next();
  const theme = useTheme();

  return (
    <AppBar
      className="doc-site-header"
      position="fixed"
      sx={{
        zIndex: 9,
        backgroundColor: "carbon.50",
        boxShadow: "none",
        height: getHeaderHeight(props.bannerEnabled || false),
      }}
    >
      <HeaderBanner {...props} />

      <Toolbar
        sx={{
          height: "100%",
          paddingLeft: "24px",
          paddingRight: "24px",
          flexDirection: {
            xs: "column-reverse",
            md: "column",
          },
          alignItems: "stretch",
          borderBottom: `1px solid ${theme.palette.carbon[400]}`,
        }}
      >
        {/* First row: Logo and HeaderAction */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: HEADER_HEIGHT.FIRST_ROW,
          }}
        >
          {props.menu}
          <Box
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <LinkComponent
              to={generateDocsHomeUrl(language)}
              onClick={() =>
                gtmTrack(GTMEvent.ClickHeadNav, {
                  item_name: "logo",
                })
              }
            >
              <TiDBLogo />
            </LinkComponent>
          </Box>

          <HeaderAction
            supportedLocales={props.locales}
            docInfo={props.docInfo}
            buildType={props.buildType}
            pageUrl={props.pageUrl}
          />
        </Box>

        {/* Second row: HeaderNavStack, HeaderNavStackMobile, and LangSwitch */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: HEADER_HEIGHT.SECOND_ROW,
          }}
        >
          <HeaderNavStack
            buildType={props.buildType}
            pageUrl={props.pageUrl}
            namespace={props.namespace}
            onSelectedNavItemChange={props.onSelectedNavItemChange}
          />
          <HeaderNavStackMobile
            buildType={props.buildType}
            namespace={props.namespace}
          />

          {props.locales.length > 0 && (
            <Box sx={{ marginLeft: "auto" }}>
              <LangSwitch supportedLocales={props.locales} />
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

const HeaderBanner = (props: HeaderProps) => {
  const { t } = useI18next();
  const isAutoTranslation = useIsAutoTranslation(props.pageUrl || "");
  const urlAutoTranslation =
    props.pathConfig?.repo === "tidbcloud"
      ? `/tidbcloud/${props.name === "_index" ? "" : props.name}`
      : `/${props.pathConfig?.repo}/${props.pathConfig?.version || "stable"}/${
          props.name === "_index" ? "" : props.name
        }`;

  let archivedTargetUrl = "";
  if (props.name && props.pathConfig) {
    const stableCfg = { ...props.pathConfig, version: "stable" };
    const path = generateUrl(props.name, stableCfg);
    archivedTargetUrl = `https://docs.pingcap.com${path}`;
  } else {
    const lang =
      props.pathConfig?.locale === Locale.en
        ? ""
        : `/${props.pathConfig?.locale}`;
    archivedTargetUrl = `https://docs.pingcap.com${lang}/tidb/stable/`;
  }

  if (props.buildType === "archive") {
    return (
      <Banner
        bgColor="#FEFBF3"
        textColor="#AE6D0C"
        logo={
          <ErrorOutlineOutlined sx={{ fontSize: "1rem", color: "#F2AA18" }} />
        }
        textList={[
          t("banner.archive.title"),
          <BlueAnchorLink to={archivedTargetUrl} target="_blank">
            {t("banner.archive.viewLatestLTSVersion")} ↗
          </BlueAnchorLink>,
        ]}
      />
    );
  }

  if (isAutoTranslation) {
    return (
      <Banner
        // bgColor="#FEFBF3"
        // textColor="#AE6D0C"
        // logo={
        //   <ErrorOutlineOutlined sx={{ fontSize: "1rem", color: "#F2AA18" }} />
        // }
        logo={"📣"}
        textList={[
          <BlueAnchorLink
            to="https://www.pingcap.com/blog/tidb-cloud-essential-now-available-public-preview-aws-alibaba-cloud/"
            target="_blank"
          >
            {t("banner.autoTrans.title1")}
          </BlueAnchorLink>,
          t("banner.autoTrans.title2"),
          <BlueAnchorLink to={urlAutoTranslation} target="_blank">
            {t("banner.autoTrans.end")}
          </BlueAnchorLink>,
        ]}
      />
    );
  }

  return props.bannerEnabled ? (
    <Banner
      logo={"📣"}
      textList={[
        <BlueAnchorLink
          to="https://www.pingcap.com/blog/tidb-cloud-essential-now-available-public-preview-aws-alibaba-cloud/"
          target="_blank"
        >
          {t("banner.campaign.title1")}
        </BlueAnchorLink>,
        t("banner.campaign.title2"),
        <BlueAnchorLink to={t("banner.campaign.link")} target="_blank">
          {t("banner.campaign.end")}
        </BlueAnchorLink>,
      ]}
    />
  ) : null;
};
