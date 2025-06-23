import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";

import LinkComponent from "components/Link";
import HeaderNavStack, {
  HeaderNavStackMobile,
} from "components/Layout/HeaderNav";
import HeaderAction from "components/Layout/HeaderAction";

import TiDBLogo from "media/logo/tidb-logo-withtext.svg";

import { Locale, BuildType, PathConfig } from "shared/interface";
import { GTMEvent, gtmTrack } from "shared/utils/gtm";
import { Banner } from "./Banner";
import { generateDocsHomeUrl } from "shared/utils";
import { useI18next } from "gatsby-plugin-react-i18next";
import { ArchiveBanner } from "./Banner/ArchiveBanner";
import { useIsAutoTranslation } from "shared/useIsAutoTranslation";

export default function Header(props: {
  bannerEnabled?: boolean;
  menu?: React.ReactNode;
  locales: Locale[];
  docInfo?: { type: string; version: string };
  buildType?: BuildType;
  pageUrl?: string;
  name?: string;
  pathConfig?: PathConfig;
}) {
  const { language, t } = useI18next();
  const theme = useTheme();
  const isAutoTranslation = useIsAutoTranslation(props.pageUrl || "");
  const { url, logo, textList } = useBannerEvents(
    ["title"],
    "link",
    "banner.campaign"
  );
  const textListAutoTranslation = t("lang.machineTransNotice");
  const urlAutoTranslation =
    props.pathConfig?.repo === "tidbcloud"
      ? `/tidbcloud`
      : `/${props.pathConfig?.repo}/${props.pathConfig?.version || "stable"}/${
          props.name === "_index" ? "" : props.name
        }`;

  return (
    <AppBar
      className="doc-site-header"
      position="fixed"
      sx={{
        zIndex: 9,
        backgroundColor: "carbon.50",
        boxShadow: "none",
        height: props.bannerEnabled ? "7.5rem" : "5rem",
      }}
    >
      <Toolbar
        sx={{
          height: "100%",
          paddingLeft: "24px",
          paddingRight: "24px",
          borderBottom: `1px solid ${theme.palette.carbon[400]}`,
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

        <HeaderNavStack buildType={props.buildType} pageUrl={props.pageUrl} />
        <HeaderNavStackMobile buildType={props.buildType} />

        <HeaderAction
          supportedLocales={props.locales}
          docInfo={props.docInfo}
          buildType={props.buildType}
          pageUrl={props.pageUrl}
        />
      </Toolbar>
      {!isAutoTranslation &&
        props.bannerEnabled &&
        props.buildType !== "archive" && (
          <Banner url={url} logo={logo} textList={textList} />
        )}
      {isAutoTranslation && props.buildType !== "archive" && (
        <Banner url={urlAutoTranslation} textList={[textListAutoTranslation]} />
      )}
      {props.buildType === "archive" && (
        <ArchiveBanner name={props.name} pathConfig={props.pathConfig} />
      )}
    </AppBar>
  );
}

const useBannerEvents = (
  textKeys: string[],
  linkKey: string,
  prefix: string = ""
) => {
  const { t } = useI18next();
  const validTextKeys = prefix
    ? textKeys.map((k) => `${prefix}.${k}`)
    : textKeys;

  const urlKey = prefix ? `${prefix}.${linkKey}` : linkKey;
  const url = t(urlKey);
  const textList = validTextKeys.map((k) => t(k));
  const logo = "🚀";
  // const logo = (
  //   <Box
  //     component="img"
  //     alt="TiDB"
  //     src={require("media/logo/tidb-logo.svg")?.default}
  //     sx={{
  //       width: "1.25rem",
  //       height: "1.25rem",
  //     }}
  //   />
  // );
  const bgImgSrc =
    "https://static.pingcap.com/files/2023/11/15190759/20231116-105219.png";

  return {
    bgImgSrc,
    url,
    logo,
    textList,
  };
};
