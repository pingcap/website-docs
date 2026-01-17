import * as React from "react";
import Box from "@mui/material/Box";
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
import { HEADER_HEIGHT } from "shared/headerHeight";

import { NavItemConfig } from "./HeaderNavConfigType";

interface HeaderProps {
  bannerEnabled?: boolean;
  children?: React.ReactNode;
  menu?: React.ReactNode;
  locales: Locale[];
  docInfo?: { type: string; version: string };
  buildType?: BuildType;
  name?: string;
  pathConfig?: PathConfig;
  namespace: TOCNamespace;
  onSelectedNavItemChange?: (item: NavItemConfig | null) => void;
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

const LOGO_GAP = 24;

export default function Header(props: HeaderProps) {
  const { language } = useI18next();
  const theme = useTheme();
  const isAutoTranslation = useIsAutoTranslation(props.namespace);
  const bannerVisible =
    props.buildType === "archive" || isAutoTranslation || !!props.bannerEnabled;

  const firstRowHeightPx = React.useMemo(() => {
    return Number.parseInt(HEADER_HEIGHT.FIRST_ROW, 10);
  }, []);

  const leftClusterRef = React.useRef<HTMLDivElement | null>(null);
  const logoMeasureRef = React.useRef<HTMLDivElement | null>(null);
  const [leftClusterWidth, setLeftClusterWidth] = React.useState(0);
  const [logoWidth, setLogoWidth] = React.useState(0);
  const [collapseProgress, setCollapseProgress] = React.useState(0);

  const updateLeftClusterSizes = React.useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const clusterElement = leftClusterRef.current;
    if (clusterElement) {
      const rect = clusterElement.getBoundingClientRect();
      if (rect.width !== 0) {
        setLeftClusterWidth(rect.width);
      }
    }

    const logoElement = logoMeasureRef.current;
    if (logoElement) {
      const rect = logoElement.getBoundingClientRect();
      if (rect.width !== 0) {
        setLogoWidth(rect.width);
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let rafId: number | null = null;
    const measure = () => {
      updateLeftClusterSizes();
    };
    rafId = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);

    return () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("resize", measure);
    };
  }, [updateLeftClusterSizes]);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let ticking = false;
    const update = () => {
      const y = window.scrollY || 0;
      setCollapseProgress(clamp(y / firstRowHeightPx, 0, 1));
      ticking = false;
    };

    update();
    const onScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [firstRowHeightPx]);

  const logoScale = 1 - collapseProgress * 0.2;
  const menuWidth = Math.max(0, leftClusterWidth - logoWidth);
  const scaledLogoWidth = logoWidth ? logoWidth * logoScale : undefined;
  const translateX =
    collapseProgress * (menuWidth + logoWidth * logoScale + LOGO_GAP);

  return (
    <>
      {bannerVisible && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <HeaderBanner {...props} />
        </Box>
      )}

      <Box
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
          position: "fixed",
          top: bannerVisible ? HEADER_HEIGHT.BANNER : 0,
          left: 0,
          right: 0,
          height: HEADER_HEIGHT.SECOND_ROW,
          zIndex: 11,
          alignItems: "center",
          paddingLeft: "24px",
          paddingRight: "24px",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            pointerEvents: "auto",
          }}
        >
          {props.menu}
          <Box
            height="34px"
            sx={{
              display: "block",
              width: scaledLogoWidth,
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
              <TiDBLogo height="100%" width="100%" />
            </LinkComponent>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          paddingTop: bannerVisible ? HEADER_HEIGHT.BANNER : 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* First row: Logo and HeaderAction */}
        <Box
          sx={{
            order: {
              xs: 1,
              md: 0,
            },
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            width: "100%",
            height: HEADER_HEIGHT.FIRST_ROW,
            flexShrink: 0,
            paddingLeft: { xs: "12px", md: "24px" },
            paddingRight: { xs: "12px", md: "24px" },
            backgroundColor: "carbon.50",
            boxSizing: "border-box",
          }}
        >
          <Box
            ref={leftClusterRef}
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              alignItems: "center",
              height: "100%",
              visibility: "hidden",
              pointerEvents: "none",
            }}
          >
            {props.menu}
            <Box ref={logoMeasureRef} height="34px" sx={{ display: "block" }}>
              <LinkComponent
                to={generateDocsHomeUrl(language)}
                onClick={() =>
                  gtmTrack(GTMEvent.ClickHeadNav, {
                    item_name: "logo",
                  })
                }
              >
                <TiDBLogo height="100%" width="100%" />
              </LinkComponent>
            </Box>
          </Box>

          <Box sx={{ marginLeft: "auto" }}>
            <HeaderAction
              supportedLocales={props.locales}
              docInfo={props.docInfo}
              buildType={props.buildType}
              namespace={props.namespace}
            />
          </Box>
        </Box>

        {/* Second row: sticky */}
        <Box
          className="doc-site-header"
          sx={{
            order: {
              xs: 0,
              md: 1,
            },
            position: "sticky",
            top: bannerVisible ? HEADER_HEIGHT.BANNER : 0,
            zIndex: 9,
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: HEADER_HEIGHT.SECOND_ROW,
            paddingLeft: { xs: "12px", md: "24px" },
            paddingRight: { xs: "12px", md: "24px" },
            backgroundColor: "carbon.50",
            borderBottom: `1px solid ${theme.palette.carbon[400]}`,
            boxSizing: "border-box",
          }}
        >
          {props.menu && (
            <Box
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },
                alignItems: "center",
                mr: 1,
              }}
            >
              {props.menu}
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              transform: {
                xs: "none",
                md: `translateX(${translateX}px)`,
              },
              willChange: {
                xs: "auto",
                md: "transform",
              },
            }}
          >
            <HeaderNavStack
              buildType={props.buildType}
              namespace={props.namespace}
              onSelectedNavItemChange={props.onSelectedNavItemChange}
            />
            <HeaderNavStackMobile
              buildType={props.buildType}
              namespace={props.namespace}
            />
          </Box>

          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <HeaderAction
                supportedLocales={props.locales}
                docInfo={props.docInfo}
                buildType={props.buildType}
                namespace={props.namespace}
              />
            </Box>
            {props.locales.length > 0 && (
              <LangSwitch supportedLocales={props.locales} />
            )}
          </Box>
        </Box>

        <Box sx={{ order: 2 }}>{props.children}</Box>
      </Box>
    </>
  );
}

const HeaderBanner = (props: HeaderProps) => {
  const { t } = useI18next();
  const isAutoTranslation = useIsAutoTranslation(props.namespace);
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
