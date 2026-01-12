import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";

import LinkComponent from "components/Link";
import { usePageType, PageType } from "shared/usePageType";
import { BuildType } from "shared/interface";
import { GTMEvent, gtmTrack } from "shared/utils/gtm";
import { useCloudPlan } from "shared/useCloudPlan";
import ChevronDownIcon from "media/icons/chevron-down.svg";
import { NavConfig, NavGroupConfig, NavItemConfig } from "./HeaderNavConfig";
import { generateNavConfig } from "./HeaderNavConfigData";
import { clearAllNavStates } from "../LeftNav/LeftNavTree";

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

// Helper function to find selected item recursively
const findSelectedItem = (
  configs: NavConfig[],
  selectedItem: PageType
): NavItemConfig | null => {
  for (const config of configs) {
    if (config.type === "item") {
      const isSelected =
        typeof config.selected === "function"
          ? config.selected(selectedItem)
          : config.selected ?? false;
      if (isSelected) {
        return config;
      }
    } else if (config.type === "group" && config.children) {
      const item = findSelectedItem(config.children, selectedItem);
      if (item) {
        return item;
      }
    }
  }
  return null;
};

export default function HeaderNavStack(props: {
  buildType?: BuildType;
  pageUrl?: string;
  config?: NavConfig[];
  onSelectedNavItemChange?: (item: NavItemConfig | null) => void;
}) {
  const { language, t } = useI18next();
  const selectedItem = useSelectedNavItem(language, props.pageUrl);
  const { cloudPlan } = useCloudPlan();

  // Default configuration (backward compatible)
  const defaultConfig: NavConfig[] = React.useMemo(() => {
    if (props.config) {
      return props.config;
    }
    // Use new config generator
    return generateNavConfig(t, cloudPlan, props.buildType);
  }, [props.config, props.buildType, cloudPlan, t]);

  // Find and notify selected item
  React.useEffect(() => {
    if (props.onSelectedNavItemChange) {
      const selectedNavItem = findSelectedItem(defaultConfig, selectedItem);
      props.onSelectedNavItemChange(selectedNavItem);
    }
  }, [defaultConfig, selectedItem, props.onSelectedNavItemChange]);

  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{
        height: "100%",
        flexShrink: 0,
        display: {
          xs: "none",
          md: "flex",
        },
      }}
    >
      {defaultConfig.map((navConfig, index) => {
        // Check condition
        if (
          navConfig.condition &&
          !navConfig.condition(language, props.buildType)
        ) {
          return null;
        }

        return (
          <NavGroup
            key={index}
            config={navConfig}
            selectedItem={selectedItem}
          />
        );
      })}
    </Stack>
  );
}

const NavGroup = (props: { config: NavConfig; selectedItem: PageType }) => {
  const { config, selectedItem } = props;
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Check if this is an item or a group without children
  const isItem = config.type === "item";
  const isGroupWithoutChildren =
    config.type === "group" &&
    (!config.children || config.children.length === 0);
  const shouldShowPopover = !isItem && !isGroupWithoutChildren;

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    // Add a small delay before closing to allow moving to the popover
    closeTimeoutRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, 100);
  };

  const handlePopoverKeepOpen = () => {
    // Clear any pending close timeout when mouse enters popover
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => {
      // Cleanup timeout on unmount
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Check if this item/group is selected
  const isSelected: boolean =
    isItem && typeof config.selected === "function"
      ? config.selected(selectedItem)
      : isItem
      ? ((config.selected ?? false) as boolean)
      : false;

  // Check if any child is selected (recursively check nested groups)
  const hasSelectedChild =
    !isItem && config.type === "group" && config.children
      ? config.children.some((child) => {
          if (child.type === "item") {
            const childSelected =
              typeof child.selected === "function"
                ? child.selected(selectedItem)
                : child.selected ?? false;
            return childSelected;
          } else {
            // For nested groups, check if any nested child is selected
            return child.children.some((nestedChild) => {
              if (nestedChild.type === "item") {
                const nestedSelected =
                  typeof nestedChild.selected === "function"
                    ? nestedChild.selected(selectedItem)
                    : nestedChild.selected ?? false;
                return nestedSelected;
              }
              return false;
            });
          }
        })
      : false;

  return (
    <>
      <NavButton
        config={config}
        isItem={isItem}
        selected={isSelected}
        hasSelectedChild={hasSelectedChild}
        shouldShowPopover={shouldShowPopover}
        open={open}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />

      {shouldShowPopover && (
        <Popover
          id="mouse-over-popover"
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
          sx={{ pointerEvents: "none" }}
          PaperProps={{
            onMouseEnter: handlePopoverKeepOpen,
            onMouseLeave: handlePopoverClose,
            sx: {
              border: "1px solid #F4F4F4",
              boxShadow: "0px 8px 32px 0px rgba(0, 0, 0, 0.08)",
              pointerEvents: "auto",
              padding: "16px",
              marginTop: "8px",
            },
          }}
        >
          {(() => {
            if (config.type !== "group" || !config.children) {
              return null;
            }
            const groups = config.children.filter(
              (child) => child.type === "group"
            );
            const items = config.children.filter(
              (child) => child.type === "item"
            );

            return (
              <>
                {groups.length > 0 && (
                  <Box display="flex" flexDirection="row" gap="0">
                    {groups.map((child, index) => (
                      <React.Fragment key={index}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap="4px"
                          minWidth="200px"
                        >
                          <GroupTitle
                            title={child.title}
                            titleIcon={child.titleIcon}
                          />
                          {child.children.map((nestedChild, nestedIndex) => {
                            if (nestedChild.type === "item") {
                              return (
                                <NavMenuItem
                                  key={`${index}-${nestedIndex}`}
                                  item={nestedChild}
                                  groupTitle={child.title}
                                  selectedItem={selectedItem}
                                  onClose={handlePopoverClose}
                                />
                              );
                            }
                            return null;
                          })}
                        </Box>
                        {index < groups.length - 1 && (
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                              borderColor: theme.palette.carbon[400],
                              margin: "0 16px",
                            }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                )}
                {items.length > 0 && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="4px"
                    minWidth="200px"
                  >
                    {items.map((child, index) => (
                      <NavMenuItem
                        key={index}
                        item={child}
                        selectedItem={selectedItem}
                        onClose={handlePopoverClose}
                      />
                    ))}
                  </Box>
                )}
              </>
            );
          })()}
        </Popover>
      )}
    </>
  );
};

// Group title component
const GroupTitle = (props: {
  title: string | React.ReactNode;
  titleIcon?: React.ReactNode;
}) => {
  const theme = useTheme();
  if (!props.title) return null;
  return (
    <Typography
      variant="subtitle2"
      component="div"
      sx={{
        padding: "12px 8px",
        color: theme.palette.carbon[900],
        fontSize: "16px",
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {props.titleIcon && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {props.titleIcon}
        </Box>
      )}
      {props.title}
    </Typography>
  );
};

// Menu item component
const NavMenuItem = (props: {
  item: NavItemConfig;
  groupTitle?: string | React.ReactNode;
  selectedItem: PageType;
  onClose: () => void;
}) => {
  const { item, groupTitle, selectedItem, onClose } = props;
  const isSelected =
    typeof item.selected === "function"
      ? item.selected(selectedItem)
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
          padding: groupTitle ? "10px 12px" : "8px 12px",
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
          <Typography component="span" sx={{ fontSize: "14px" }}>
            {item.label}
          </Typography>
        </Box>
      </MenuItem>
    </LinkComponent>
  );
};

// Nav button component (for both item and group)
const NavButton = (props: {
  config: NavConfig;
  isItem: boolean;
  selected: boolean;
  hasSelectedChild: boolean;
  shouldShowPopover: boolean;
  open: boolean;
  onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: () => void;
}) => {
  const {
    config,
    isItem,
    selected,
    hasSelectedChild,
    shouldShowPopover,
    open,
    onMouseEnter,
    onMouseLeave,
  } = props;
  const theme = useTheme();
  const label = isItem
    ? (config as NavItemConfig).label
    : (config as NavGroupConfig).title;
  const to = isItem ? (config as NavItemConfig).to : undefined;
  const startIcon = isItem
    ? (config as NavItemConfig).startIcon
    : (config as NavGroupConfig).titleIcon;
  const alt = isItem ? (config as NavItemConfig).alt : undefined;
  const isI18n = isItem ? (config as NavItemConfig).isI18n ?? true : true;

  // Determine selected state for border styling
  const isSelectedState = isItem ? selected : hasSelectedChild;

  return (
    <>
      {isItem && to ? (
        // Render as link for item
        <LinkComponent
          isI18n={isI18n}
          to={to}
          onClick={() => {
            clearAllNavStates();
            gtmTrack(GTMEvent.ClickHeadNav, {
              item_name: label || alt,
            });
            if (isItem) {
              (config as NavItemConfig).onClick?.();
            }
          }}
        >
          <Typography
            variant="body1"
            component="div"
            padding="0 12px 4px"
            sx={{
              display: "inline-flex",
              boxSizing: "border-box",
              alignItems: "center",
              gap: 0.5,
              fontSize: "14px",
              color: theme.palette.carbon[900],
              height: "100%",
              paddingBottom: isSelectedState ? "0" : "4px",
              borderBottom: isSelectedState
                ? `4px solid ${theme.palette.primary.main}`
                : ``,
            }}
          >
            {startIcon}
            {label}
          </Typography>
        </LinkComponent>
      ) : (
        // Render as button for group (with or without popover)
        <Box
          aria-owns={
            shouldShowPopover && open ? "mouse-over-popover" : undefined
          }
          aria-haspopup={shouldShowPopover ? "true" : undefined}
          onMouseEnter={shouldShowPopover ? onMouseEnter : undefined}
          onMouseLeave={shouldShowPopover ? onMouseLeave : undefined}
          sx={{
            cursor: shouldShowPopover ? "pointer" : "default",
            display: "inline-flex",
            boxSizing: "border-box",
            alignItems: "center",
            gap: 0.5,
            padding: "0 12px 4px",
            height: "100%",
            paddingBottom: isSelectedState ? "0" : "4px",
            borderBottom: isSelectedState
              ? `4px solid ${theme.palette.primary.main}`
              : ``,
          }}
        >
          {startIcon && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {startIcon}
            </Box>
          )}
          {label && (
            <Typography
              variant="body1"
              component="div"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: 14,
                fontWeight: hasSelectedChild ? 700 : 400,
                color: theme.palette.carbon[900],
              }}
            >
              {label}
            </Typography>
          )}
          {shouldShowPopover && (
            <ChevronDownIcon
              sx={{
                fill: theme.palette.carbon[900],
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          )}
        </Box>
      )}
    </>
  );
};
