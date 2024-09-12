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
import DownloadIcon from "@mui/icons-material/Download";

import LinkComponent from "components/Link";
import {
  generateDownloadURL,
  generateContactURL,
  generateLearningCenterURL,
  generateDocsHomeUrl,
  getPageType,
  PageType,
} from "shared/utils";
import { BuildType } from "shared/interface";
import { GTMEvent, gtmTrack } from "shared/utils/gtm";

import TiDBLogo from "media/logo/tidb-logo-withtext.svg";

// `pageUrl` comes from server side render (or build): gatsby/path.ts/generateUrl
// it will be `undefined` in client side render
const useSelectedNavItem = (language?: string, pageUrl?: string) => {
  // init in server side
  const [selectedItem, setSelectedItem] = React.useState<PageType>(
    () => getPageType(language, pageUrl) || "home"
  );

  // update in client side
  React.useEffect(() => {
    setSelectedItem(getPageType(language, window.location.pathname));
  }, [language]);

  return selectedItem;
};

export default function HeaderNavStack(props: {
  buildType?: BuildType;
  pageUrl?: string;
}) {
  const { language, t } = useI18next();

  const selectedItem = useSelectedNavItem(language, props.pageUrl);

  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{
        paddingLeft: "20px",
        height: "100%",
        display: {
          xs: "none",
          md: "flex",
        },
      }}
    >
      {["en", "ja"].includes(language) && props.buildType !== "archive" && (
        <NavItem
          selected={selectedItem === "tidbcloud"}
          label={t("navbar.cloud")}
          to={`/tidbcloud`}
        />
      )}

      <NavItem
        selected={selectedItem === "tidb"}
        label={t("navbar.tidb")}
        to={props.buildType === "archive" ? "/tidb/v2.1" : "/tidb/stable"}
      />

      {["zh"].includes(language) && (
        <NavItem label={t("navbar.asktug")} to={generateAskTugUrl(language)} />
      )}

      {["en", "ja"].includes(language) && (
        <NavItem
          label={t("navbar.learningCenter")}
          to={generateLearningCenterURL(language)}
        />
      )}

      <NavItem
        label={t("navbar.contactUs")}
        to={generateContactURL(language)}
      />

      {language === "zh" && (
        <NavItem
          // label={<Trans i18nKey="navbar.download" />}
          to={generateDownloadURL(language)}
          alt="download"
          startIcon={<DownloadIcon fontSize="inherit" color="inherit" />}
        />
      )}
    </Stack>
  );
}

const NavItem = (props: {
  selected?: boolean;
  label?: string | React.ReactElement;
  to: string;
  startIcon?: React.ReactNode;
  alt?: string;
  onClick?: () => void;
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
            ? `4px solid ${theme.palette.primary.main}`
            : ``,
        }}
      >
        <LinkComponent
          isI18n
          to={props.to}
          onClick={() => {
            gtmTrack(GTMEvent.ClickHeadNav, {
              item_name: props.label || props.alt,
            });

            props.onClick?.();
          }}
        >
          <Typography
            variant="body1"
            component="div"
            color="website.f1"
            padding="12px 0"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {props.startIcon}
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
  const { language, t } = useI18next();
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
        startIcon={<TiDBLogo />}
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
            <LinkComponent
              isI18n
              to="/"
              style={{ width: "100%" }}
              onClick={() =>
                gtmTrack(GTMEvent.ClickHeadNav, {
                  item_name: "home",
                })
              }
            >
              <Typography variant="body1" component="div" color="website.f1">
                {props.buildType === "archive" ? (
                  <Trans i18nKey="navbar.archive-home" />
                ) : (
                  <Trans i18nKey="navbar.home" />
                )}
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
            <LinkComponent
              isI18n
              to="/tidbcloud"
              style={{ width: "100%" }}
              onClick={() =>
                gtmTrack(GTMEvent.ClickHeadNav, {
                  item_name: t("navbar.cloud"),
                })
              }
            >
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
          <LinkComponent
            isI18n
            to={props.buildType === "archive" ? "/tidb/v2.1" : "/tidb/stable"}
            style={{ width: "100%" }}
            onClick={() =>
              gtmTrack(GTMEvent.ClickHeadNav, {
                item_name: t("navbar.tidb"),
              })
            }
          >
            <Typography variant="body1" component="div" color="website.f1">
              <Trans i18nKey="navbar.tidb" />
            </Typography>
          </LinkComponent>
        </MenuItem>

        {language === "zh" && (
          <MenuItem onClick={handleClose} disableRipple>
            <LinkComponent
              to={generateDownloadURL(language)}
              style={{ width: "100%" }}
              onClick={() =>
                gtmTrack(GTMEvent.ClickHeadNav, {
                  item_name: t("navbar.download"),
                })
              }
            >
              <Typography variant="body1" component="div" color="website.f1">
                <Trans i18nKey="navbar.download" />
              </Typography>
            </LinkComponent>
          </MenuItem>
        )}

        {["ja", "en"].includes(language) && (
          <MenuItem onClick={handleClose} disableRipple>
            <LinkComponent
              to={generateLearningCenterURL(language)}
              style={{ width: "100%" }}
              onClick={() =>
                gtmTrack(GTMEvent.ClickHeadNav, {
                  item_name: t("navbar.learningCenter"),
                })
              }
            >
              <Typography variant="body1" component="div" color="website.f1">
                <Trans i18nKey="navbar.learningCenter" />
              </Typography>
            </LinkComponent>
          </MenuItem>
        )}

        {["zh"].includes(language) && (
          <MenuItem onClick={handleClose} disableRipple>
            <LinkComponent
              to={generateAskTugUrl(language)}
              style={{ width: "100%" }}
              onClick={() =>
                gtmTrack(GTMEvent.ClickHeadNav, {
                  item_name: t("navbar.asktug"),
                })
              }
            >
              <Typography variant="body1" component="div" color="website.f1">
                <Trans i18nKey="navbar.asktug" />
              </Typography>
            </LinkComponent>
          </MenuItem>
        )}

        <MenuItem onClick={handleClose} disableRipple>
          <LinkComponent
            to={generateContactURL(language)}
            style={{ width: "100%" }}
            onClick={() =>
              gtmTrack(GTMEvent.ClickHeadNav, {
                item_name: t("navbar.contactUs"),
              })
            }
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

function generateAskTugUrl(language: string) {
  switch (language) {
    case "zh":
      return "https://asktug.com/";
    case "en":
      return "https://ask.pingcap.com/";
    default:
      break;
  }
  return "https://asktug.com/";
}
