import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import LinkComponent from "components/Link";
import ChevronDownIcon from "media/icons/chevron-down.svg";
import { BuildType, TOCNamespace } from "shared/interface";
import { GTMEvent, gtmTrack } from "shared/utils/gtm";

import TiDBLogo from "media/logo/tidb-logo-withtext.svg";
import { useCloudPlan } from "shared/useCloudPlan";
import {
  NavConfig,
  NavItemConfig,
  NavGroupConfig,
} from "./HeaderNavConfigType";
import { generateNavConfig } from "./HeaderNavConfigData";
import { clearAllNavStates } from "../LeftNav/LeftNavTree";

export function HeaderNavStackMobile(props: {
  buildType?: BuildType;
  namespace?: TOCNamespace;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();
  const { language, t } = useI18next();
  const { cloudPlan } = useCloudPlan();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Generate navigation config
  const navConfig: NavConfig[] = React.useMemo(() => {
    return generateNavConfig(t, cloudPlan, props.buildType);
  }, [t, cloudPlan, props.buildType]);

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
        PaperProps={{
          sx: {
            maxHeight: "80vh",
            overflowY: "auto",
          },
        }}
      >
        {navConfig
          .filter((config) => {
            // Filter out configs that don't meet condition
            if (
              config.condition &&
              !config.condition(language, props.buildType)
            ) {
              return false;
            }
            return true;
          })
          .map((config, index, filteredArray) => {
            return (
              <React.Fragment key={index}>
                {index > 0 && <Divider />}
                <RenderNavConfig
                  config={config}
                  namespace={props.namespace}
                  onClose={handleClose}
                />
              </React.Fragment>
            );
          })}
      </Menu>
    </Box>
  );
}

// Recursive component to render nav config (item or group)
const RenderNavConfig = (props: {
  config: NavConfig;
  namespace?: TOCNamespace;
  onClose: () => void;
}) => {
  const { config, namespace, onClose } = props;

  if (config.type === "item") {
    return (
      <NavMenuItem item={config} namespace={namespace} onClose={onClose} />
    );
  }

  // Handle group
  if (config.type === "group") {
    const groups = config.children.filter(
      (child) => child.type === "group"
    ) as NavGroupConfig[];
    const items = config.children.filter(
      (child) => child.type === "item"
    ) as NavItemConfig[];

    // Don't render if no children
    if (groups.length === 0 && items.length === 0) {
      return null;
    }

    return (
      <>
        {/* Render group title if it exists */}
        {config.title && (
          <Box
            sx={{
              padding: "12px 16px 8px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {config.titleIcon && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {config.titleIcon}
              </Box>
            )}
            <Typography
              variant="subtitle2"
              component="div"
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "carbon.900",
              }}
            >
              {config.title}
            </Typography>
          </Box>
        )}

        {/* Render nested groups */}
        {groups.map((group, groupIndex) => {
          const groupItems = group.children.filter(
            (child) => child.type === "item"
          ) as NavItemConfig[];

          if (groupItems.length === 0) {
            return null;
          }

          return (
            <React.Fragment key={`group-${groupIndex}`}>
              {groupIndex > 0 && <Divider sx={{ margin: "8px 0" }} />}
              {group.title && (
                <Box
                  sx={{
                    padding: "8px 16px 4px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {group.titleIcon && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {group.titleIcon}
                    </Box>
                  )}
                  <Typography
                    variant="subtitle2"
                    component="div"
                    sx={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "carbon.700",
                    }}
                  >
                    {group.title}
                  </Typography>
                </Box>
              )}
              {groupItems.map((child, childIndex) => (
                <NavMenuItem
                  key={`group-${groupIndex}-item-${childIndex}`}
                  item={child}
                  namespace={namespace}
                  onClose={onClose}
                />
              ))}
            </React.Fragment>
          );
        })}

        {/* Render direct items */}
        {items.map((item, itemIndex) => (
          <NavMenuItem
            key={`item-${itemIndex}`}
            item={item}
            namespace={namespace}
            onClose={onClose}
          />
        ))}
      </>
    );
  }

  return null;
};

// Menu item component
const NavMenuItem = (props: {
  item: NavItemConfig;
  namespace?: TOCNamespace;
  onClose: () => void;
}) => {
  const { item, namespace, onClose } = props;
  const isSelected =
    typeof item.selected === "function"
      ? item.selected(namespace)
      : item.selected ?? false;

  return (
    <LinkComponent
      isI18n={item.isI18n ?? true}
      to={item.to}
      style={{ width: "100%", textDecoration: "none" }}
      onClick={() => {
        gtmTrack(GTMEvent.ClickHeadNav, {
          item_name: item.label || item.alt,
        });
      }}
    >
      <MenuItem
        onClick={() => {
          clearAllNavStates();
          onClose();
          item.onClick?.();
        }}
        disableRipple
        selected={isSelected}
        sx={{
          padding: "10px 16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "100%",
          }}
        >
          {item.startIcon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {item.startIcon}
            </Box>
          )}
          <Typography
            component="span"
            sx={{
              fontSize: "14px",
              fontWeight: isSelected ? 600 : 400,
            }}
          >
            {item.label}
          </Typography>
        </Box>
      </MenuItem>
    </LinkComponent>
  );
};
