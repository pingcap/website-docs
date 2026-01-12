import * as React from "react";
import Box from "@mui/material/Box";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";

import { RepoNavLink, RepoNav } from "shared/interface";
import LinkComponent from "components/Link";
import { scrollToElementIfInView } from "shared/utils";
import { alpha, Chip } from "@mui/material";

const calcExpandedIds = (
  data: RepoNavLink[],
  targetLink: string,
  targetId?: string
) => {
  const ids: string[] = [];
  const treeForeach = (data: RepoNavLink[], parents: string[] = []): void => {
    data.forEach((item) => {
      const isMatch = targetId
        ? item.link === targetLink && item.id === targetId
        : item.link === targetLink;
      if (isMatch) {
        ids.push(...parents);
        ids.push(item.id);
        return;
      }
      if (item.children) {
        treeForeach(item.children, [...parents, item.id]);
      }
    });
  };
  treeForeach(data, []);
  return ids;
};

// Session storage key prefix for nav item id
const NAV_ITEM_ID_STORAGE_KEY = "nav_item_id_";
// Session storage key prefix for scroll position
const NAV_SCROLL_POSITION_STORAGE_KEY = "nav_scroll_position_";
// Session storage key prefix for expanded tree nodes
const NAV_EXPANDED_IDS_STORAGE_KEY = "nav_expanded_ids_";

// Get nav item id from session storage for a given path
const getNavItemIdFromStorage = (path: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(`${NAV_ITEM_ID_STORAGE_KEY}${path}`);
  } catch {
    return null;
  }
};

// Save nav item id to session storage for a given path
const saveNavItemIdToStorage = (path: string, id: string): void => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${NAV_ITEM_ID_STORAGE_KEY}${path}`, id);
  } catch {
    // Ignore storage errors
  }
};

// Get scroll position from session storage for a given path
const getScrollPositionFromStorage = (path: string): number | null => {
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem(
      `${NAV_SCROLL_POSITION_STORAGE_KEY}${path}`
    );
    return value ? parseInt(value, 10) : null;
  } catch {
    return null;
  }
};

// Save scroll position to session storage for a given path
const saveScrollPositionToStorage = (path: string, scrollTop: number): void => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      `${NAV_SCROLL_POSITION_STORAGE_KEY}${path}`,
      scrollTop.toString()
    );
  } catch {
    // Ignore storage errors
  }
};

// Get expanded IDs from session storage for a given path
const getExpandedIdsFromStorage = (path: string): string[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem(
      `${NAV_EXPANDED_IDS_STORAGE_KEY}${path}`
    );
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

// Save expanded IDs to session storage for a given path
const saveExpandedIdsToStorage = (
  path: string,
  expandedIds: string[]
): void => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      `${NAV_EXPANDED_IDS_STORAGE_KEY}${path}`,
      JSON.stringify(expandedIds)
    );
  } catch {
    // Ignore storage errors
  }
};

// Get the scrollable container element
const getScrollableContainer = (): HTMLElement | null => {
  if (typeof document === "undefined") return null;
  const treeView = document.querySelector("#left-nav-treeview");
  if (!treeView) return null;

  // Find the nearest scrollable parent
  let parent = treeView.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    if (style.overflowY === "auto" || style.overflowY === "scroll") {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
};

export default function ControlledTreeView(props: {
  data: RepoNav;
  current: string;
}) {
  const { data, current: currentUrl } = props;

  const [expanded, setExpanded] = React.useState<string[]>(() => {
    return calcExpandedIds(data, currentUrl);
  });
  const [selected, setSelected] = React.useState<string[]>(() => {
    const expandedIds = calcExpandedIds(data, currentUrl);
    if (expandedIds.length) {
      return [expandedIds[expandedIds.length - 1]];
    }
    return [];
  });

  const theme = useTheme();
  const [disableTransition, setDisableTransition] = React.useState(false);
  const previousUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const storedId = getNavItemIdFromStorage(currentUrl);
    // Try to get saved expanded IDs first
    const savedExpandedIds = getExpandedIdsFromStorage(currentUrl);

    let expandedIds: string[];
    let selectedId: string | undefined;
    const isUrlChanged = previousUrlRef.current !== currentUrl;
    previousUrlRef.current = currentUrl;

    if (savedExpandedIds && savedExpandedIds.length > 0) {
      // Use saved expanded IDs if available
      expandedIds = savedExpandedIds;
      // Use storedId for selected if available, otherwise use the last expanded ID
      selectedId =
        storedId ||
        (expandedIds.length > 0
          ? expandedIds[expandedIds.length - 1]
          : undefined);

      // Disable transition animation only when restoring saved state and URL changed
      if (isUrlChanged) {
        setDisableTransition(true);
        // Re-enable transitions after a short delay
        setTimeout(() => {
          setDisableTransition(false);
        }, 100);
      }
    } else {
      // Fallback to calculating from current URL
      expandedIds = calcExpandedIds(data, currentUrl, storedId || undefined);
      selectedId =
        storedId ||
        (expandedIds.length > 0
          ? expandedIds[expandedIds.length - 1]
          : undefined);
    }

    setExpanded(expandedIds);
    if (selectedId) {
      setSelected([selectedId]);
    }
  }, [data, currentUrl]);

  // ! Add "auto scroll" to left nav is not recommended.
  React.useEffect(() => {
    const targetActiveItem:
      | (HTMLElement & { scrollIntoViewIfNeeded: () => void })
      | null = document?.querySelector(".MuiTreeView-root .Mui-selected");
    if (targetActiveItem) {
      // Check if there's a saved scroll position for this URL
      const savedScrollPosition = getScrollPositionFromStorage(currentUrl);
      const scrollContainer = getScrollableContainer();

      if (savedScrollPosition !== null && scrollContainer) {
        // Restore scroll position
        scrollContainer.scrollTop = savedScrollPosition;
      } else {
        // Fallback to original behavior
        scrollToElementIfInView(targetActiveItem);
      }
    }
  }, [selected, currentUrl]);

  const renderNavs = (items: RepoNavLink[]) => {
    return items.map((item) => {
      if (item.type === "heading") {
        return (
          <Box
            key={item.id || `heading-${item.content[0]}`}
            sx={{
              display: "flex",
              alignItems: "center",
              my: "16px",
            }}
          >
            <Typography
              pl="8px"
              fontWeight={300}
              fontSize="14px"
              color="carbon.700"
              sx={{ textTransform: "uppercase", flexShrink: 0 }}
            >
              {item.content[0] as string}
            </Typography>
            <Divider sx={{ flexGrow: 1, ml: "10px" }} />
          </Box>
        );
      } else {
        return renderTreeItems([item]);
      }
    });
  };

  const renderTreeItems = (items: RepoNavLink[], deepth = 0) => {
    return items.map((item: RepoNavLink) => {
      const hasChildren = item.children && item.children.length > 0;
      const isItemExpanded = expanded.includes(item.id);
      const LabelEle = () => {
        return (
          <Stack
            key={`${deepth}_${item.id}`}
            direction="row"
            sx={{
              minHeight: "1.75rem",
              alignItems: "center",
              paddingLeft: `${deepth * 8}px`,
              paddingTop: "0.25rem",
              paddingBottom: "0.25rem",
            }}
          >
            {hasChildren ? (
              <ChevronRightIcon
                className="MuiTreeItem-ChevronRightIcon"
                sx={{
                  flexShrink: 0,
                  fill: theme.palette.website.f3,
                  height: "16px",
                  width: "16px",
                  marginLeft: "auto",
                  transform: `translateX(-4px) ${
                    isItemExpanded ? "rotate(90deg)" : ""
                  }`,
                }}
              />
            ) : (
              <Box sx={{ flexShrink: 0 }} width={16} height={16} />
            )}
            {generateItemLabel(item)}
          </Stack>
        );
      };
      return (
        <LinkComponent
          key={item.id}
          to={item.link}
          style={{ width: "100%", color: "inherit" }}
          onClick={(e) => {
            e.stopPropagation();
            // Save nav item id to session storage when clicked
            if (item.link) {
              saveNavItemIdToStorage(item.link, item.id);

              // Save scroll position to session storage
              const scrollContainer = getScrollableContainer();
              if (scrollContainer) {
                saveScrollPositionToStorage(
                  item.link,
                  scrollContainer.scrollTop
                );
              }

              // Save expanded IDs to session storage
              saveExpandedIdsToStorage(item.link, expanded);
            }
          }}
        >
          <TreeItem
            nodeId={item.id}
            label={<LabelEle />}
            ContentProps={{
              style: { width: "inherit" },
            }}
          >
            {hasChildren
              ? renderTreeItems(item.children as RepoNavLink[], deepth + 1)
              : null}
          </TreeItem>
        </LinkComponent>
      );
    });
  };

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
    // Save expanded IDs to session storage when toggled
    if (currentUrl) {
      saveExpandedIdsToStorage(currentUrl, nodeIds);
    }
  };

  return (
    <TreeView
      id="left-nav-treeview"
      aria-label="left navigation"
      expanded={expanded}
      selected={selected}
      onNodeToggle={handleToggle}
      sx={{
        ...(disableTransition && {
          "& .MuiTreeItem-group": {
            transition: "none !important",
          },
          "& .MuiCollapse-root": {
            transition: "none !important",
          },
        }),
      }}
    >
      {renderNavs(data)}
    </TreeView>
  );
}

const generateItemLabel = ({ content: contents, tag }: RepoNavLink) => {
  const tagQuery = new URLSearchParams(tag?.query);
  const tagColor = tagQuery.get("color");
  const tagColor02 = tagColor && alpha(tagColor, 0.2);
  return (
    <Stack sx={{ width: "100%" }} direction="row" gap="4px">
      <Box
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          flexShrink: 1,
          flexGrow: 0,
        }}
      >
        {contents.map((content, index) => {
          const isContentString = typeof content === "string";
          const c = isContentString ? content : content.value;
          return (
            <Typography
              component={typeof content === "string" ? "div" : "code"}
              sx={{
                color: "inherit",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                wordBreak: "break-word",
              }}
            >
              {c}
            </Typography>
          );
        })}
      </Box>
      {tag && (
        <Chip
          label={tag.value}
          variant="outlined"
          size="small"
          sx={{
            flexShrink: 0,
            textTransform: "uppercase",
            pointerEvents: "none",
            fontSize: "10px",
            height: "20px",
            borderColor: tagColor ? tagColor02 : "#c0e1f1",
            color: tagColor || "#2d9cd2",
            fontWeight: 500,
          }}
        />
      )}
    </Stack>
  );
};
