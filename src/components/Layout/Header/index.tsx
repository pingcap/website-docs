import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
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
import { ErrorOutlineOutlined, ArrowUpward } from "@mui/icons-material";
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
const CSS_VAR_TRANSLATE_X = "--pc-docs-header-translate-x";
const CSS_VAR_LOGO_SCALE = "--pc-docs-header-logo-scale";

export default function Header(props: HeaderProps) {
  const { language } = useI18next();
  const theme = useTheme();
  const isAutoTranslation = useIsAutoTranslation(props.namespace);
  const bannerVisible =
    props.buildType === "archive" || isAutoTranslation || !!props.bannerEnabled;

  const firstRowHeightPx = React.useMemo(() => {
    return Number.parseInt(HEADER_HEIGHT.FIRST_ROW, 10);
  }, []);

  const cssVarRootRef = React.useRef<HTMLDivElement | null>(null);
  const leftClusterRef = React.useRef<HTMLDivElement | null>(null);
  const logoMeasureRef = React.useRef<HTMLDivElement | null>(null);
  const leftClusterWidthRef = React.useRef(0);
  const logoWidthRef = React.useRef(0);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const showBackToTopRef = React.useRef(false);

  const handleBackToTop = React.useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const syncScrollStyles = React.useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    const root = cssVarRootRef.current;
    if (!root) {
      return;
    }

    const y = window.scrollY || 0;
    const progress = clamp(y / firstRowHeightPx, 0, 1);
    const logoScale = 1 - progress * 0.2;

    const logoWidth = logoWidthRef.current;
    const leftClusterWidth = leftClusterWidthRef.current;
    root.style.setProperty(CSS_VAR_LOGO_SCALE, `${logoScale}`);
    if (logoWidth === 0 || leftClusterWidth === 0) {
      // Keep the last known translateX (or SSR value) until we have sizes.
      return;
    }

    const menuWidth = Math.max(0, leftClusterWidth - logoWidth);
    const translateX =
      progress * (menuWidth + logoWidth * logoScale + LOGO_GAP);

    root.style.setProperty(CSS_VAR_TRANSLATE_X, `${translateX}px`);
  }, [firstRowHeightPx]);

  const updateLeftClusterSizes = React.useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const clusterElement = leftClusterRef.current;
    if (clusterElement) {
      const rect = clusterElement.getBoundingClientRect();
      if (rect.width !== 0) {
        leftClusterWidthRef.current = rect.width;
      }
    }

    const logoElement = logoMeasureRef.current;
    if (logoElement) {
      const rect = logoElement.getBoundingClientRect();
      if (rect.width !== 0) {
        logoWidthRef.current = rect.width;
      }
    }
    syncScrollStyles();
  }, [firstRowHeightPx, syncScrollStyles]);

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
    let rafId: number | null = null;
    const update = () => {
      syncScrollStyles();
      const y = window.scrollY || 0;
      const shouldShowBackToTop = y >= firstRowHeightPx;
      if (shouldShowBackToTop !== showBackToTopRef.current) {
        showBackToTopRef.current = shouldShowBackToTop;
        setShowBackToTop(shouldShowBackToTop);
      }
      ticking = false;
    };

    update();
    const onScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      rafId = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, [syncScrollStyles]);

  return (
    <Box
      ref={cssVarRootRef}
      data-pc-docs-header-root="true"
      sx={{
        [CSS_VAR_TRANSLATE_X]: "0px",
        [CSS_VAR_LOGO_SCALE]: "1",
      }}
    >
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
            pointerEvents: "none",
          }}
        >
          {props.menu && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pointerEvents: "auto",
              }}
            >
              {props.menu}
            </Box>
          )}
          <Box
            height="34px"
            sx={{
              display: "block",
              pointerEvents: "auto",
              transform: `scale(var(${CSS_VAR_LOGO_SCALE}))`,
              transformOrigin: "left center",
              willChange: "transform",
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
            data-pc-docs-header-left-cluster="true"
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
            <Box
              ref={logoMeasureRef}
              data-pc-docs-header-logo-measure="true"
              height="34px"
              sx={{ display: "block" }}
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
                md: `translate3d(var(${CSS_VAR_TRANSLATE_X}), 0, 0)`,
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
            {showBackToTop && (
              <IconButton
                aria-label="Back to top"
                size="small"
                onClick={handleBackToTop}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  color: theme.palette.carbon[700],
                }}
              >
                <ArrowUpward fontSize="small" />
              </IconButton>
            )}
            {props.locales.length > 0 && (
              <LangSwitch supportedLocales={props.locales} />
            )}
          </Box>
        </Box>

        <Box sx={{ order: 2 }}>{props.children}</Box>
      </Box>
    </Box>
  );
}

const HeaderBanner = (props: HeaderProps) => {
  const { t } = useI18next();
  const { namespace } = props;
  const isAutoTranslation = useIsAutoTranslation(namespace);
  const trailPath = props.name === "_index" ? "" : props.name;
  const urlAutoTranslation =
    namespace === TOCNamespace.TidbCloudReleases && props.name === "_index"
      ? `/releases/tidb-cloud/`
      : namespace === TOCNamespace.AI
      ? `/ai/${trailPath}`
      : namespace === TOCNamespace.TiDBCloud
      ? `/tidbcloud/${trailPath}`
      : `/${props.pathConfig?.repo}/${
          props.pathConfig?.version || "stable"
        }/${trailPath}`;

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
