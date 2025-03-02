import { ErrorOutlineOutlined, OpenInNewOutlined } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import LinkComponent from "components/Link";
import { Locale, PathConfig } from "shared/interface";
import { generateUrl } from "shared/utils";
import { useTranslation } from "react-i18next";
interface ArchiveBannerProps {
  name?: string;
  pathConfig?: PathConfig;
}

export function ArchiveBanner({ name, pathConfig }: ArchiveBannerProps) {
  const { t } = useTranslation();
  let targetUrl = "";
  if (name && pathConfig) {
    const stableCfg = { ...pathConfig, version: "stable" };
    const path = generateUrl(name, stableCfg);
    targetUrl = `https://docs.pingcap.com${path}`;
  } else {
    const lang =
      pathConfig?.locale === Locale.en ? "" : `/${pathConfig?.locale}`;
    targetUrl = `https://docs.pingcap.com${lang}/tidb/stable`;
  }

  return (
    <Box
      sx={{
        flexShrink: 0,
        minHeight: "1.5rem",
        backgroundColor: "#FEFBF3",
        backgroundPosition: "bottom left",
        backgroundSize: "400px auto",
        backgroundRepeat: "no-repeat",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        flexWrap="nowrap"
        spacing={1}
        sx={(theme) => ({
          color: "#AE6D0C",
          height: "100%",
          px: 2,
          [theme.breakpoints.down("md")]: {
            px: 1,
          },
        })}
      >
        <ErrorOutlineOutlined sx={{ fontSize: "1rem", color: "#F2AA18" }} />

        <Typography component="span" variant="body2" color="inherit">
          {t("banner.archive.title")}
        </Typography>

        <LinkComponent
          to={targetUrl}
          sx={{
            "&:hover": {
              textDecoration: "underline!important",
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing="4px">
            <Typography variant="body2" color="secondary">
              {t("banner.archive.viewLatestLTSVersion")}
            </Typography>
            <OpenInNewOutlined
              sx={{
                fontSize: "1rem",
                color: "var(--tiui-palette-secondary)",
              }}
            />
          </Stack>
        </LinkComponent>
      </Stack>
    </Box>
  );
}
