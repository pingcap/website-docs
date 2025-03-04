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
        />
      </Toolbar>
      {props.bannerEnabled && props.buildType !== "archive" && <Banner />}
      {props.buildType === "archive" && (
        <ArchiveBanner name={props.name} pathConfig={props.pathConfig} />
      )}
    </AppBar>
  );
}
