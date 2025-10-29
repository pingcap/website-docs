import * as React from "react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import { graphql, useStaticQuery } from "gatsby";
import { useLocation } from "@reach/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EditIcon from "@mui/icons-material/Edit";
import GitHubIcon from "@mui/icons-material/GitHub";
import SvgIcon from "@mui/material/SvgIcon";

import { TableOfContent, PathConfig, BuildType } from "shared/interface";
import {
  calcPDFUrl,
  getRepoFromPathCfg,
  transformCustomId,
  removeHtmlTag,
} from "shared/utils";
import { sliceVersionMark } from "shared/utils/anchor";
import { getPageType } from "shared/utils";

interface RightNavProps {
  toc?: TableOfContent[];
  pathConfig: PathConfig;
  filePath: string;
  buildType?: BuildType;
  pageUrl?: string;
  bannerVisible?: boolean;
}

export default function RightNav(props: RightNavProps) {
  const {
    toc = [],
    pathConfig,
    filePath,
    buildType,
    pageUrl,
    bannerVisible,
  } = props;

  const theme = useTheme();
  const { language, t } = useI18next();

  const pdfUrlMemo = React.useMemo(() => calcPDFUrl(pathConfig), [pathConfig]);
  const pageType = React.useMemo(
    () => getPageType(language, pageUrl),
    [pageUrl]
  );

  // ! TOREMOVED
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);
  let { pathname } = useLocation();
  if (pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1); // unify client and ssr
  }

  // Track active heading for scroll highlighting
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    // Collect all heading IDs from the TOC
    const headingIds: string[] = [];
    const collectIds = (items: TableOfContent[]) => {
      items.forEach((item) => {
        if (item.url) {
          const id = item.url.replace(/^#/, "");
          if (id) {
            headingIds.push(id);
          }
        }
        if (item.items) {
          collectIds(item.items);
        }
      });
    };
    collectIds(toc);

    if (headingIds.length === 0) return;

    // Create an intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    setTimeout(() => {
      // Observe all heading elements
      headingIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 1000);

    // Cleanup
    return () => {
      headingIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [toc]);

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: bannerVisible ? "7.5rem" : "5rem",
          height: "100%",
          maxHeight: bannerVisible
            ? "calc(100vh - 7.5rem)"
            : "calc(100vh - 5rem)",
          overflowY: "auto",
          padding: "36px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "36px",
        }}
      >
        {language !== "ja" && (
          <Stack spacing={1}>
            {pageType !== "tidbcloud" && (
              <ActionItem
                icon={SimCardDownloadIcon}
                url={`https://docs-download.pingcap.com/pdf/${pdfUrlMemo}`}
                label={t("doc.download-pdf")}
                rel="noreferrer"
                download
              />
            )}
            {buildType !== "archive" && (
              <ActionItem
                icon={GitHubIcon}
                url={`https://github.com/${getRepoFromPathCfg(
                  pathConfig
                )}/issues/new?body=File:%20[/${
                  pathConfig.branch
                }/${filePath}](${site.siteMetadata.siteUrl}${pathname})`}
                label={t("doc.feedback")}
                rel="noreferrer"
              />
            )}
            {buildType !== "archive" &&
              ["zh", "en"].includes(pathConfig.locale) && (
                <ActionItem
                  icon={QuestionAnswerIcon}
                  url={
                    pathConfig.locale === "zh"
                      ? `https://asktug.com/?utm_source=doc`
                      : `https://discord.gg/DQZ2dy3cuc?utm_source=doc`
                  }
                  label={t("doc.feedbackAskTug")}
                  rel="noreferrer"
                />
              )}
            {buildType !== "archive" && pathConfig.version === "dev" && (
              <ActionItem
                icon={EditIcon}
                url={`https://github.com/${getRepoFromPathCfg(
                  pathConfig
                )}/edit/${pathConfig.branch}/${filePath}`}
                label={t("doc.improve")}
                rel="noreferrer"
              />
            )}
          </Stack>
        )}

        <Box id="toc-container" component="nav" aria-label="toc">
          <Typography
            component="div"
            sx={{
              paddingLeft: "0.5rem",
              color: theme.palette.website.f1,
              fontSize: "0.875rem",
              fontWeight: "700",
              lineHeight: "1.25rem",
              paddingBottom: "0.5rem",
            }}
          >
            <Trans i18nKey="doc.toc" />
          </Typography>
          {generateToc(toc, 0, activeId)}
        </Box>
      </Box>
    </>
  );
}

const generateToc = (items: TableOfContent[], level = 0, activeId = "") => {
  const theme = useTheme();

  return (
    <Typography
      component="ul"
      sx={{
        listStyle: "none",
        padding: 0,
      }}
    >
      {items.map((item) => {
        const { url, title, items } = item;
        const { label: newLabel, anchor: newAnchor } = transformCustomId(
          title,
          url
        );
        const itemId = url?.replace(/^#/, "") || "";
        const isActive = itemId && itemId === activeId;

        return (
          <Typography key={`${level}-${item.title}`} component="li">
            <Typography
              component="a"
              href={newAnchor?.replace(sliceVersionMark, "")}
              sx={{
                display: "flex",
                textDecoration: "none",
                fontSize: "14px",
                lineHeight: "1.25rem",
                borderLeft: `1px solid transparent`,
                paddingLeft: `${0.5 + 1 * level}rem`,
                paddingTop: "0.25rem",
                paddingBottom: "0.25rem",
                fontWeight: isActive ? "700" : "400",
                color: isActive ? theme.palette.website.f1 : "inherit",
                "&:hover": {
                  color: theme.palette.website.f3,
                  borderLeft: `1px solid ${theme.palette.website.f3}`,
                },
              }}
            >
              {removeHtmlTag(newLabel)}
            </Typography>
            {items && generateToc(items, level + 1, activeId)}
          </Typography>
        );
      })}
    </Typography>
  );
};

const ActionItem = (props: {
  url: string;
  label: string;
  icon?: typeof SvgIcon;
  [key: string]: any;
}) => {
  const { url, label, sx, ...rest } = props;
  const theme = useTheme();
  return (
    <Typography
      component="a"
      href={url}
      target="_blank"
      sx={{
        width: "fit-content",
        textDecoration: "none",
        fontSize: "14px",
        lineHeight: "1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        "&:hover, &:focus, &:active": {
          color: theme.palette.secondary.main,
        },
        ...sx,
      }}
      {...rest}
    >
      {props.icon && (
        <props.icon
          sx={{
            width: "1.25rem",
            height: "1.25rem",
          }}
        />
      )}
      {label}
    </Typography>
  );
};

export function RightNavMobile(props: RightNavProps) {
  const { toc = [], pathConfig, filePath, buildType } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const generateMobileTocList = (items: TableOfContent[], level = 0) => {
    const result: { label: string; anchor: string; depth: number }[] = [];
    items.forEach((item) => {
      const { url, title, items: children } = item;
      const { label: newLabel, anchor: newAnchor } = transformCustomId(
        title,
        url
      );
      result.push({
        label: newLabel,
        anchor: newAnchor,
        depth: level,
      });
      if (children) {
        const childrenresult = generateMobileTocList(children, level + 1);
        result.push(...childrenresult);
      }
    });
    return result;
  };

  return (
    <Box>
      <Button
        id="toc-mobile-button"
        variant="outlined"
        aria-controls={open ? "toc-mobile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          width: "100%",
        }}
      >
        <Trans i18nKey="doc.toc" />
      </Button>
      <Menu
        id="toc-mobile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "toc-mobile-button",
        }}
      >
        {generateMobileTocList(toc).map((item) => {
          return (
            <MenuItem
              key={`${item.depth}-${item.label}`}
              onClick={handleClose}
              dense
              sx={{
                width: "calc(100vw - 2rem)",
              }}
            >
              <Typography
                component="a"
                href={item.anchor}
                sx={{
                  width: "100%",
                  textDecoration: "none",
                  paddingLeft: `${0.5 + 1 * item.depth}rem`,
                }}
              >
                {item.label}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
