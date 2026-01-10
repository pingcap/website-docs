import * as React from "react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import LinkComponent from "components/Link";
import ChevronDownIcon from "media/icons/chevron-down.svg";
import { usePageType, PageType } from "shared/usePageType";
import { BuildType } from "shared/interface";
import { GTMEvent, gtmTrack } from "shared/utils/gtm";

import TiDBLogo from "media/logo/tidb-logo-withtext.svg";
import { CLOUD_MODE_KEY, useCloudPlan } from "shared/useCloudPlan";

// `pageUrl` comes from server side render (or build): gatsby/path.ts/generateUrl
// it will be `undefined` in client side render
const useSelectedNavItem = (language?: string, pageUrl?: string) => {
  // init in server side
  const [selectedItem, setSelectedItem] = React.useState<PageType>(() =>
    usePageType(language, pageUrl)
  );

  // update in client side
  React.useEffect(() => {
    setSelectedItem(usePageType(language, window.location.pathname));
  }, [language]);

  return selectedItem;
};

export function HeaderNavStackMobile(props: { buildType?: BuildType }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();
  const { language, t } = useI18next();
  const selectedItem = useSelectedNavItem(language);
  const { cloudPlan } = useCloudPlan();
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
        endIcon={<ChevronDownIcon />}
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
            selected={selectedItem === PageType.Home}
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

        {props.buildType !== "archive" && (
          <MenuItem
            onClick={handleClose}
            disableRipple
            selected={selectedItem === PageType.TiDBCloud}
          >
            <LinkComponent
              isI18n
              to={
                cloudPlan === "dedicated" || !cloudPlan
                  ? `/tidbcloud`
                  : `/tidbcloud/${cloudPlan}?${CLOUD_MODE_KEY}=${cloudPlan}`
              }
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
          selected={selectedItem === PageType.TiDB}
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

        {/* {language === "zh" && (
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
              to="https://asktug.com/"
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
        )} */}
      </Menu>
    </Box>
  );
}
