import * as React from "react";
import { Link, Trans, useI18next } from "gatsby-plugin-react-i18next";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";

import { PingcapLogoIcon } from "components/Icons";
import LinkComponent from "components/Link";
import HeaderNavStack, {
  HeaderNavStackMobile,
} from "components/Layout/HeaderNav";
import HeaderAction from "components/Layout/HeaderAction";

import TiDBLogo from "styles/images/tidb/new-tidb-logo.svg";

import { generatePingcapUrl } from "utils";
import { Locale, BuildType } from "static/Type";
import { GTMEvent, gtmTrack } from "utils/gtm";
import { Banner } from "./Banner";
import { Stack, Typography } from "@mui/material";

export default function Header(props: {
  bannerEnabled?: boolean;
  menu?: React.ReactNode;
  locales: Locale[];
  docInfo?: { type: string; version: string };
  buildType?: BuildType;
  pageUrl?: string;
}) {
  const theme = useTheme();
  const { language } = useI18next();
  return (
    <AppBar
      className="doc-site-header"
      position="fixed"
      sx={{
        zIndex: 9,
        backgroundColor: "carbon.300",
        borderBottom: `1px solid ${theme.palette.website.m4}`,
        boxShadow: `0px 2px 4px rgba(42, 47, 49, 0.1)`,
        height: props.bannerEnabled ? "7rem" : "5rem",
      }}
    >
      {props.bannerEnabled && <Banner />}
      <Toolbar
        sx={{
          height: "100%",
          paddingLeft: { md: "2rem" },
          paddingRight: { md: "2rem" },
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
            to={generatePingcapUrl(language)}
            onClick={() =>
              gtmTrack(GTMEvent.ClickHeadNav, {
                item_name: "logo",
              })
            }
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ textAlign: "center" }}
            >
              <TiDBLogo />
              <Typography fontSize={16} fontWeight={700} color="text.primary">
                Docs
              </Typography>
            </Stack>
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
    </AppBar>
  );
}
