import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import StarIcon from "media/icons/star.svg";

import CloudIcon from "@mui/icons-material/Cloud";

import Search from "components/Search";

import { Locale, BuildType } from "shared/interface";
import { ActionButton } from "components/Card/FeedbackSection/components";
import { Link } from "gatsby";
import { useIsAutoTranslation } from "shared/useIsAutoTranslation";

const useTiDBAIStatus = () => {
  const [showTiDBAIButton, setShowTiDBAIButton] = React.useState(true);
  const [initializingTiDBAI, setInitializingTiDBAI] = React.useState(true);

  React.useEffect(() => {
    if (!!window.tidbai) {
      setInitializingTiDBAI(false);
    }

    const onTiDBAIInitialized = () => {
      setInitializingTiDBAI(false);
    };
    const onTiDBAIError = () => {
      setInitializingTiDBAI(false);
      setShowTiDBAIButton(false);
    };
    window.addEventListener("tidbaiinitialized", onTiDBAIInitialized);
    window.addEventListener("tidbaierror", onTiDBAIError);

    const timer = setTimeout(() => {
      if (!window.tidbai) {
        setInitializingTiDBAI(false);
        setShowTiDBAIButton(false);
      }
    }, 10000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("tidbaiinitialized", onTiDBAIInitialized);
      window.removeEventListener("tidbaierror", onTiDBAIError);
    };
  }, []);

  return { showTiDBAIButton, initializingTiDBAI };
};

export default function HeaderAction(props: {
  supportedLocales: Locale[];
  docInfo?: { type: string; version: string };
  buildType?: BuildType;
  pageUrl?: string;
}) {
  const { docInfo, buildType, pageUrl } = props;
  const { language, t } = useI18next();
  const { showTiDBAIButton, initializingTiDBAI } = useTiDBAIStatus();
  const isAutoTranslation = useIsAutoTranslation(pageUrl || "");

  return (
    <Stack
      direction="row"
      spacing={{
        xs: 1,
        lg: 2,
      }}
      sx={{ marginLeft: "auto", alignItems: "center" }}
    >
      {docInfo && !isAutoTranslation && buildType !== "archive" && (
        <>
          <Stack direction="row" spacing={1}>
            <Search placeholder={t("navbar.searchDocs")} docInfo={docInfo} />
            {language === "en" && showTiDBAIButton && (
              <ActionButton
                id="header-ask-ai"
                variant="outlined"
                startIcon={<StarIcon />}
                disabled={initializingTiDBAI}
                sx={{
                  display: {
                    xs: "none",
                    xl: "flex",
                  },
                }}
                onClick={() => {
                  window.tidbai.open = true;
                }}
              >
                Ask AI
              </ActionButton>
            )}
          </Stack>
        </>
      )}
      {language === "en" && <TiDBCloudBtnGroup />}
    </Stack>
  );
}

const TiDBCloudBtnGroup = () => {
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
        spacing={1}
        display={{
          xs: "none",
          xl: "flex",
        }}
      >
        <Button
          variant="text"
          href={`https://tidbcloud.com/signin`}
          // https://developer.chrome.com/blog/referrer-policy-new-chrome-default/
          referrerPolicy="no-referrer-when-downgrade"
          target="_blank"
        >
          Sign In
        </Button>
        <Button
          variant="contained"
          target="_blank"
          href="https://tidbcloud.com/free-trial"
          // https://developer.chrome.com/blog/referrer-policy-new-chrome-default/
          referrerPolicy="no-referrer-when-downgrade"
        >
          Start for Free
        </Button>
      </Stack>

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
        <CloudIcon />
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
