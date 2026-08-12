import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloudIcon from "@mui/icons-material/Cloud";
import { useTheme } from "@mui/material/styles";

import Search from "components/Search";

import { Locale, BuildType, TOCNamespace } from "shared/interface";
import { Link } from "gatsby";
import { useIsAutoTranslation } from "shared/useIsAutoTranslation";

export default function HeaderAction(props: {
  supportedLocales: Locale[];
  docInfo?: { type: string; version: string };
  buildType?: BuildType;
  namespace: TOCNamespace;
}) {
  const { docInfo, buildType, namespace } = props;
  const { language, t } = useI18next();
  const isAutoTranslation = useIsAutoTranslation(namespace);
  // Chinese AI docs are auto-translated but are included in the onsite search index.
  const showSearchOnAutoTranslation =
    language === Locale.zh && namespace === TOCNamespace.AI;

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, md: 2 }}
      sx={{ alignItems: "center" }}
    >
      {docInfo &&
        (!isAutoTranslation || showSearchOnAutoTranslation) &&
        buildType !== "archive" && (
          <Search placeholder={t("navbar.searchDocs")} docInfo={docInfo} />
        )}
      {language === "en" && <TiDBCloudBtnGroup />}
    </Stack>
  );
}

const TiDBCloudBtnGroup = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        display={{
          xs: "none",
          xl: "flex",
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          href={`https://tidbcloud.com/signin`}
          // https://developer.chrome.com/blog/referrer-policy-new-chrome-default/
          referrerPolicy="no-referrer-when-downgrade"
          target="_blank"
          size="medium"
          sx={{
            fontSize: "14px",
          }}
        >
          Sign In
        </Button>
        <Button
          variant="contained"
          color="secondary"
          target="_blank"
          href="https://tidbcloud.com/free-trial"
          // https://developer.chrome.com/blog/referrer-policy-new-chrome-default/
          referrerPolicy="no-referrer-when-downgrade"
          size="medium"
          sx={{
            fontSize: "14px",
          }}
        >
          Start for Free
        </Button>
      </Stack>

      {/* Mobile menu */}
      <IconButton
        id="tidb-cloud-menu-button"
        aria-controls={open ? "tidb-cloud-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          display: {
            xs: "inline-flex",
            xl: "none",
          },
        }}
      >
        <CloudIcon
          sx={{ width: 17, height: 17, fill: theme.palette.carbon[900] }}
        />
      </IconButton>
      <Menu
        id="tidb-cloud-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "idb-cloud-menu-button",
        }}
      >
        <MenuItem
          component={Link}
          to={`https://tidbcloud.com/signin`}
          target="_blank"
          referrerPolicy="no-referrer-when-downgrade"
          sx={{
            textDecoration: "none",
          }}
        >
          <Typography>Sign In</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
          }}
          component={Link}
          to={`https://tidbcloud.com/free-trial`}
          target="_blank"
          referrerPolicy="no-referrer-when-downgrade"
          sx={{
            textDecoration: "none",
          }}
        >
          <Typography>Try Free</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
