import * as React from "react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import StarIcon from "media/icons/star.svg";

import TranslateIcon from "@mui/icons-material/Translate";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloudIcon from "@mui/icons-material/Cloud";

import Search from "components/Search";

import { Locale, BuildType } from "shared/interface";
import { ActionButton } from "components/Card/FeedbackSection/components";
import { Link } from "gatsby";

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
}) {
  const { supportedLocales, docInfo, buildType } = props;
  const { language, t } = useI18next();
  const { showTiDBAIButton, initializingTiDBAI } = useTiDBAIStatus();

  return (
    <Stack
      direction="row"
      spacing={{
        xs: 1,
        lg: 2,
      }}
      sx={{ marginLeft: "auto", alignItems: "center" }}
    >
      {supportedLocales.length > 0 && (
        <LangSwitch supportedLocales={supportedLocales} />
      )}
      {docInfo && language !== "ja" && buildType !== "archive" && (
        <>
          <Stack direction="row" spacing="4px">
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

const LangSwitch = (props: {
  language?: string;
  changeLanguage?: () => void;
  supportedLocales: Locale[];
}) => {
  const { supportedLocales } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();
  const { language, changeLanguage } = useI18next();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleLanguage = (locale: Locale) => () => {
    changeLanguage(locale);
    handleClose();
  };

  return (
    <Box color={theme.palette.carbon[900]}>
      <IconButton
        onClick={handleClick}
        sx={{
          color: "inherit",
          display: {
            lg: "none",
          },
        }}
      >
        <TranslateIcon />
      </IconButton>
      <Button
        id="header-lang-switch"
        aria-controls={open ? "languages-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        color="inherit"
        startIcon={<TranslateIcon sx={{ fill: theme.palette.carbon[900] }} />}
        endIcon={
          <KeyboardArrowDownIcon sx={{ fill: theme.palette.carbon[900] }} />
        }
        sx={{
          display: {
            xs: "none",
            lg: "inline-flex",
          },
        }}
      ></Button>
      <Menu
        id="header-lang-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
        <MenuItem
          onClick={toggleLanguage(Locale.en)}
          disableRipple
          selected={language === Locale.en}
          disabled={!supportedLocales.includes(Locale.en)}
        >
          <Typography component="span" color={theme.palette.carbon[900]}>
            <Trans i18nKey="lang.en" />
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={toggleLanguage(Locale.zh)}
          disableRipple
          selected={language === Locale.zh}
          disabled={!supportedLocales.includes(Locale.zh)}
        >
          <Typography component="span" color={theme.palette.carbon[900]}>
            <Trans i18nKey="lang.zh" />
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={toggleLanguage(Locale.ja)}
          disableRipple
          selected={language === Locale.ja}
          disabled={!supportedLocales.includes(Locale.ja)}
        >
          <Typography component="span" color={theme.palette.carbon[900]}>
            <Trans i18nKey="lang.ja" />
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

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
        spacing={2}
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
