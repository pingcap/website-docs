import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import { useStaticQuery, graphql } from "gatsby";
import copy from "copy-to-clipboard";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "media/icons/edit.svg";
import CopyIcon from "media/icons/copy.svg";
import MarkdownIcon from "media/icons/markdown.svg";
import FileIcon from "media/icons/file.svg";
import ChevronDownIcon from "media/icons/chevron-down.svg";

import { BuildType, PathConfig, TOCNamespace } from "shared/interface";
import { calcPDFUrl, getRepoFromPathCfg } from "shared/utils";
import { Tooltip, Divider } from "@mui/material";

interface TitleActionProps {
  pathConfig: PathConfig;
  filePath: string;
  pageUrl: string;
  buildType: BuildType;
  language: string;
  namespace?: TOCNamespace;
}

export const TitleAction = (props: TitleActionProps) => {
  const { pathConfig, filePath, pageUrl, buildType, language, namespace } =
    props;
  const { t } = useI18next();
  const theme = useTheme();
  const [contributeAnchorEl, setContributeAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [copied, setCopied] = React.useState(false);
  const isArchive = buildType === "archive";

  const contributeOpen = Boolean(contributeAnchorEl);

  // Get site metadata for feedback URL
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);

  const handleContributeClick = (event: React.MouseEvent<HTMLElement>) => {
    setContributeAnchorEl(event.currentTarget);
  };

  const handleContributeClose = () => {
    setContributeAnchorEl(null);
  };

  const handleCopyMarkdown = async () => {
    if (!pageUrl) return;

    try {
      // Fetch markdown content from public path
      const markdownUrl = `${pageUrl}.md`;
      const response = await fetch(markdownUrl);
      if (response.ok) {
        const markdownContent = await response.text();
        copy(markdownContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error("Failed to copy markdown:", e);
    }
  };

  const handleViewMarkdown = () => {
    if (!pageUrl) return;
    window.open(`${pageUrl}.md`, "_blank");
  };

  const handleDownloadPDF = () => {
    if (!pathConfig) return;
    const pdfUrl = `https://docs-download.pingcap.com/pdf/${calcPDFUrl(
      pathConfig
    )}`;
    window.open(pdfUrl, "_blank");
  };

  // Generate feedback URL
  const feedbackUrl = React.useMemo(() => {
    if (!pathConfig || !filePath) return null;
    try {
      return `https://github.com/${getRepoFromPathCfg(
        pathConfig
      )}/issues/new?body=File:%20[/${pathConfig.branch}/${filePath}](${
        site.siteMetadata.siteUrl
      }${pageUrl})`;
    } catch (e) {
      return null;
    }
  }, [pathConfig, filePath, pageUrl, site.siteMetadata.siteUrl]);

  const improveUrl = React.useMemo(() => {
    if (!pathConfig || !filePath) return null;
    return `https://github.com/${getRepoFromPathCfg(pathConfig)}/edit/${
      pathConfig.branch
    }/${filePath}`;
  }, [pathConfig.branch, filePath]);

  return (
    <Stack
      direction="row"
      spacing={3}
      alignItems="center"
      justifyItems="center"
      flexWrap="wrap"
      divider={
        <Divider
          orientation="vertical"
          sx={{
            alignSelf: "center",
            width: "1px",
            height: "20px !important",
            backgroundColor: `${theme.palette.carbon[400]} !important`,
          }}
        />
      }
    >
      {/* Contribute Menu */}
      {!isArchive && (
        <Box>
          <Button
            id="title-contribute-button"
            aria-controls={contributeOpen ? "contribute-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={contributeOpen ? "true" : undefined}
            onClick={handleContributeClick}
            startIcon={<EditIcon sx={{ fill: theme.palette.carbon[700] }} />}
            endIcon={
              <ChevronDownIcon
                sx={{ fill: theme.palette.carbon[700], marginLeft: "-4px" }}
              />
            }
            color="inherit"
            sx={{
              textTransform: "none",
              color: theme.palette.carbon[700],
            }}
          >
            {t("doc.contribute")}
          </Button>
          <Menu
            id="contribute-menu"
            anchorEl={contributeAnchorEl}
            open={contributeOpen}
            onClose={handleContributeClose}
            elevation={0}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              sx: {
                border: "1px solid #F4F4F4",
                filter: "drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.08))",
              },
            }}
          >
            {feedbackUrl && (
              <MenuItem
                component="a"
                href={feedbackUrl}
                target="_blank"
                rel="noreferrer"
                onClick={handleContributeClose}
                disableRipple
                sx={{
                  textDecoration: "none",
                }}
              >
                <Typography component="span" color={theme.palette.carbon[900]}>
                  {t("doc.feedback")}
                </Typography>
              </MenuItem>
            )}
            {improveUrl && (
              <MenuItem
                component="a"
                href={improveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={handleContributeClose}
                disableRipple
                sx={{
                  textDecoration: "none",
                }}
              >
                <Typography component="span" color={theme.palette.carbon[900]}>
                  {t("doc.improve")}
                </Typography>
              </MenuItem>
            )}
          </Menu>
        </Box>
      )}

      {/* Copy Markdown for LLM */}
      {!isArchive && (
        <Tooltip title={copied ? "Copied!" : ""}>
          <Button
            onClick={handleCopyMarkdown}
            startIcon={<CopyIcon sx={{ fill: theme.palette.carbon[700] }} />}
            color="inherit"
            sx={{
              textTransform: "none",
              color: theme.palette.carbon[700],
            }}
          >
            {t("doc.copy-for-llm")}
          </Button>
        </Tooltip>
      )}

      {/* View as Markdown */}
      {!isArchive && (
        <Button
          onClick={handleViewMarkdown}
          startIcon={<MarkdownIcon sx={{ fill: theme.palette.carbon[700] }} />}
          color="inherit"
          sx={{
            textTransform: "none",
            color: theme.palette.carbon[700],
          }}
        >
          {t("doc.view-as-markdown")}
        </Button>
      )}

      {/* Download PDF */}
      {namespace === TOCNamespace.TiDB && language !== "ja" && (
        <Button
          onClick={handleDownloadPDF}
          startIcon={<FileIcon sx={{ fill: theme.palette.carbon[700] }} />}
          color="inherit"
          sx={{
            textTransform: "none",
            color: theme.palette.carbon[700],
          }}
        >
          {t("doc.download-pdf")}
        </Button>
      )}
    </Stack>
  );
};
