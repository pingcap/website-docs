import * as React from "react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import { graphql, useStaticQuery } from "gatsby";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "@reach/router";

import { TableOfContent, PathConfig } from "static/Type";
import { calcPDFUrl, getRepoFromPathCfg } from "utils";
import LinkComponent from "components/Link";

export default function RightNav(props: {
  toc?: TableOfContent[];
  pathConfig: PathConfig;
  filePath: string;
}) {
  const { toc = [], pathConfig, filePath } = props;

  const theme = useTheme();
  const { language, t } = useI18next();

  const pdfUrlMemo = React.useMemo(() => calcPDFUrl(pathConfig), [pathConfig]);

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

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: "6rem",
          height: "100%",
          maxHeight: "calc(100vh - 8rem)",
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        <Stack spacing={1} sx={{ padding: "2rem" }}>
          <ActionItem
            url={`https://download.pingcap.org/${pdfUrlMemo}`}
            label={t("doc.download-pdf")}
            rel="noreferrer"
            download
          />
          <ActionItem
            url={`https://github.com/${getRepoFromPathCfg(
              pathConfig
            )}/issues/new?body=File:%20[/${pathConfig.branch}/${filePath}](${
              site.siteMetadata.siteUrl
            }${pathname})`}
            label={t("doc.feedback")}
            rel="noreferrer"
          />
          <ActionItem
            url={`https://asktug.com/?utm_source=doc`}
            label={t("doc.feedbackAskTug")}
            rel="noreferrer"
          />
          <ActionItem
            url={`https://github.com/${getRepoFromPathCfg(pathConfig)}/edit/${
              pathConfig.branch
            }/${filePath}`}
            label={t("doc.improve")}
            rel="noreferrer"
          />
        </Stack>

        <Box component="nav" aria-label="toc">
          <Typography
            component="div"
            sx={{
              paddingLeft: "0.5rem",
              color: theme.palette.website.m5,
              fontSize: "13px",
              lineHeight: "1.25rem",
            }}
          >
            <Trans i18nKey="doc.toc" />
          </Typography>
          {generateToc(toc)}
        </Box>
      </Box>
    </>
  );
}

const generateToc = (items: TableOfContent[], level = 0) => {
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
        return (
          <Typography key={`${level}-${item.title}`} component="li">
            <Typography
              component="a"
              href={item.url}
              sx={{
                display: "flex",
                textDecoration: "none",
                fontSize: "13px",
                lineHeight: "1.25rem",
                borderLeft: `1px solid transparent`,
                paddingLeft: `${0.5 + 1 * level}rem`,
                paddingTop: "0.25rem",
                paddingBottom: "0.25rem",
                "&:hover": {
                  color: theme.palette.website.f3,
                  borderLeft: `1px solid ${theme.palette.website.f3}`,
                },
              }}
            >
              {item.title}
            </Typography>
            {item.items && generateToc(item.items, level + 1)}
          </Typography>
        );
      })}
    </Typography>
  );
};

const ActionItem = (props: {
  url: string;
  label: string;
  [key: string]: any;
}) => {
  const { url, label, sx, ...rest } = props;
  return (
    <Typography
      component="a"
      href={url}
      target="_blank"
      sx={{
        width: "fit-content",
        textDecoration: "none",
        fontSize: "13px",
        lineHeight: "1.25rem",
        ...sx,
      }}
      {...rest}
    >
      {label}
    </Typography>
  );
};
