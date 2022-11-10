import * as React from "react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import LinkComponent from "components/Link";
import { generateDownloadURL, generateContactURL } from "utils";
import { PingcapLogoIcon } from "components/Icons";
import { BuildType } from "static/Type";

const useSelectedNavItem = (language?: string) => {
  const [selectedItem, setSelectedItem] = React.useState<string>("");

  React.useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname === "/" || pathname === `/${language}/`) {
      setSelectedItem("home");
    } else if (pathname.includes("/tidb/")) {
      setSelectedItem("tidb");
    } else if (
      pathname.includes("/tidbcloud/") ||
      pathname.endsWith("/tidbcloud")
    ) {
      setSelectedItem("tidbcloud");
    }
  }, [language]);

  return selectedItem;
};

export default function HeaderNavStack(props: { buildType?: BuildType }) {
  const { language } = useI18next();

  const selectedItem = useSelectedNavItem(language);

  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{
        paddingLeft: "2rem",
        height: "100%",
        display: {
          xs: "none",
          md: "flex",
        },
      }}
    >
      {["en", "zh"].includes(language) && (
        <NavItem
          selected={selectedItem === "home"}
          label={<Trans i18nKey="navbar.home" />}
          to="/"
        />
      )}

      {["en", "ja"].includes(language) && props.buildType !== "archive" && (
        <NavItem
          selected={selectedItem === "tidbcloud"}
          label={<Trans i18nKey="navbar.cloud" />}
          to={`/tidbcloud`}
        />
      )}

      <NavItem
        selected={selectedItem === "tidb"}
        label={<Trans i18nKey="navbar.tidb" />}
        to={`/tidb/stable`}
      />

      <NavItem
        label={<Trans i18nKey="navbar.download" />}
        to={generateDownloadURL(language)}
      />

      <NavItem
        label={<Trans i18nKey="navbar.contactUs" />}
        to={generateContactURL(language)}
      />
    </Stack>
  );
}

const NavItem = (props: {
  selected?: boolean;
  label: string | React.ReactElement;
  to: string;
}) => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          paddingTop: "0.25rem",
          paddingBottom: props.selected ? "0" : "0.25rem",
          borderBottom: props.selected
            ? `4px solid ${theme.palette.website.k1}`
            : ``,
        }}
      >
        <LinkComponent isI18n to={props.to}>
          <Typography variant="body1" component="div" color="website.f1">
            {props.label}
          </Typography>
        </LinkComponent>
      </Box>
    </>
  );
};

export function HeaderNavStackMobile(props: { buildType?: BuildType }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();
  const { language } = useI18next();
  const selectedItem = useSelectedNavItem(language);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      color={theme.palette.website.m5}
      sx={{
        display: {
          md: "none",
        },
      }}
    >
      <Button
        id="header-nav-items"
        aria-controls={open ? "nav-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        color="inherit"
        startIcon={
          <PingcapLogoIcon sx={{ width: "6.75rem", height: "1.5rem" }} />
        }
        endIcon={<KeyboardArrowDownIcon />}
      ></Button>
      <Menu
        id="header-nav-menu"
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
        {["en", "zh"].includes(language) && (
          <MenuItem
            onClick={handleClose}
            disableRipple
            selected={selectedItem === "home"}
          >
            <LinkComponent isI18n to="/" style={{ width: "100%" }}>
              <Typography variant="body1" component="div" color="website.f1">
                <Trans i18nKey="navbar.home" />
              </Typography>
            </LinkComponent>
          </MenuItem>
        )}

        {["en", "ja"].includes(language) && props.buildType !== "archive" && (
          <MenuItem
            onClick={handleClose}
            disableRipple
            selected={selectedItem === "tidbcloud"}
          >
            <LinkComponent isI18n to="/tidbcloud" style={{ width: "100%" }}>
              <Typography variant="body1" component="div" color="website.f1">
                <Trans i18nKey="navbar.cloud" />
              </Typography>
            </LinkComponent>
          </MenuItem>
        )}

        <MenuItem
          onClick={handleClose}
          disableRipple
          selected={selectedItem === "tidb"}
        >
          <LinkComponent isI18n to="/tidb/stable" style={{ width: "100%" }}>
            <Typography variant="body1" component="div" color="website.f1">
              <Trans i18nKey="navbar.tidb" />
            </Typography>
          </LinkComponent>
        </MenuItem>

        <MenuItem onClick={handleClose} disableRipple>
          <LinkComponent
            to={generateDownloadURL(language)}
            style={{ width: "100%" }}
          >
            <Typography variant="body1" component="div" color="website.f1">
              <Trans i18nKey="navbar.download" />
            </Typography>
          </LinkComponent>
        </MenuItem>

        <MenuItem onClick={handleClose} disableRipple>
          <LinkComponent
            to={generateContactURL(language)}
            style={{ width: "100%" }}
          >
            <Typography variant="body1" component="div" color="website.f1">
              <Trans i18nKey="navbar.contactUs" />
            </Typography>
          </LinkComponent>
        </MenuItem>
      </Menu>
    </Box>
  );
}
