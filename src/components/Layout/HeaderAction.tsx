import * as React from "react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import LanguageIcon from "@mui/icons-material/Language";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import LinkComponent from "components/Link";
import Search from "components/Search";
import { generateDownloadURL, generateContactURL } from "utils";

import { Locale } from "static/Type";

export default function HeaderAction(props: {
  supportedLocales: Locale[];
  docInfo?: { type: string; version: string };
}) {
  const { supportedLocales, docInfo } = props;
  const { language, t } = useI18next();

  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{ marginLeft: "auto", alignItems: "center" }}
    >
      {supportedLocales.length > 0 && (
        <LangSwitch supportedLocales={supportedLocales} />
      )}
      {docInfo && (
        <Search placeholder={t("navbar.searchDocs")} docInfo={docInfo} />
      )}
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
    <Box color={theme.palette.website.m5}>
      <IconButton
        onClick={handleClick}
        sx={{
          display: {
            lg: "none",
          },
        }}
      >
        <LanguageIcon />
      </IconButton>
      <Button
        id="header-lang-switch"
        aria-controls={open ? "languages-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        color="inherit"
        startIcon={<LanguageIcon sx={{ fill: theme.palette.website.f3 }} />}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          display: {
            xs: "none",
            lg: "inline-flex",
          },
        }}
      >
        <Typography component="span">
          <Trans i18nKey="lang.title" />
        </Typography>
      </Button>
      <Menu
        id="header-lang-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem
          onClick={toggleLanguage(Locale.en)}
          disableRipple
          selected={language === Locale.en}
          disabled={!supportedLocales.includes(Locale.en)}
        >
          <Trans i18nKey="lang.en" />
        </MenuItem>
        <MenuItem
          onClick={toggleLanguage(Locale.zh)}
          disableRipple
          selected={language === Locale.zh}
          disabled={!supportedLocales.includes(Locale.zh)}
        >
          <Trans i18nKey="lang.zh" />
        </MenuItem>
        <MenuItem
          onClick={toggleLanguage(Locale.ja)}
          disableRipple
          selected={language === Locale.ja}
          disabled={!supportedLocales.includes(Locale.ja)}
        >
          <Trans i18nKey="lang.ja" />
        </MenuItem>
      </Menu>
    </Box>
  );
};
