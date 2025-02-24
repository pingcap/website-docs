import { ErrorOutlineOutlined, OpenInNewOutlined } from "@mui/icons-material";
import { Box, Icon, Stack, Typography } from "@mui/material";
import LinkComponent from "components/Link";
import { PathConfig } from "shared/interface";
import { generateUrl } from "shared/utils";

interface ArchiveBannerProps {
  name?: string;
  pathConfig?: PathConfig;
}

export function ArchiveBanner({ name, pathConfig }: ArchiveBannerProps) {
  let targetUrl = `https://docs.pingcap.com`;
  if (name && pathConfig) {
    const stableCfg = { ...pathConfig, version: "stable" };
    const path = generateUrl(name, stableCfg);
    targetUrl = `https://docs.pingcap.com${path}`;
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
          You are viewing the archived documentation of TiDB, which no longer
          receives updates.
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
              View latest LTS version docs
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
