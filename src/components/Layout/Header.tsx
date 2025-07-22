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
import { generateDocsHomeUrl, generateUrl } from "shared/utils";
import { useI18next } from "gatsby-plugin-react-i18next";
import { useIsAutoTranslation } from "shared/useIsAutoTranslation";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";

interface HeaderProps {
  bannerEnabled?: boolean;
  menu?: React.ReactNode;
  locales: Locale[];
  docInfo?: { type: string; version: string };
  buildType?: BuildType;
  pageUrl?: string;
  name?: string;
  pathConfig?: PathConfig;
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
        height: props.bannerEnabled ? "7.5rem" : "5rem",
      }}
    >
      <HeaderBanner {...props} />

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
          <LinkComponent
            to={archivedTargetUrl}
            target="_blank"
            sx={{
              color: "secondary.main",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline!important",
              },
            }}
          >
            <Typography component="span" variant="body2" color="inherit">
              {t("banner.archive.viewLatestLTSVersion")} ↗
            </Typography>
          </LinkComponent>,
        ]}
      />
    );
  }

  if (isAutoTranslation) {
    return (
      <Banner
        textList={[
          <Typography component="span" variant="body2" color="inherit">
            {t("lang.machineTransNotice1")}
            <Typography
              component="a"
              href={urlAutoTranslation}
              target="_blank"
              sx={{
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline!important",
                },
              }}
            >
              <Typography component="span" variant="body2" color="secondary">
                {t("lang.machineTransNotice2")}
              </Typography>
            </Typography>
            {t("lang.machineTransNotice3")}
          </Typography>,
        ]}
        bgColor="#FEFBF3"
        textColor="#AE6D0C"
        logo={
          <ErrorOutlineOutlined sx={{ fontSize: "1rem", color: "#F2AA18" }} />
        }
      />
    );
  }

  return props.bannerEnabled ? (
    <Banner
      url={t("banner.campaign.link")}
      logo={"📣"}
      textList={[t("banner.campaign.title")]}
    />
  ) : null;
};
