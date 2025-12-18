import * as React from "react";
import Box from "@mui/material/Box";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import { SvgIconProps } from "@mui/material/SvgIcon";

import { RepoNavLink, RepoNav } from "shared/interface";
import LinkComponent from "components/Link";
import { scrollToElementIfInView } from "shared/utils";
import { alpha, Chip } from "@mui/material";

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon?: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText?: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.website.f1,
    "&:hover": {
      backgroundColor: theme.palette.carbon[200],
    },
    "&.Mui-selected, &.Mui-selected.Mui-focused, &.Mui-selected:hover": {
      backgroundColor: theme.palette.carbon[300],
      color: theme.palette.secondary.main,
      [`& svg.MuiTreeItem-ChevronRightIcon`]: {
        fill: theme.palette.carbon[700],
      },
    },
    "&.Mui-focused": {
      backgroundColor: `#f9f9f9`,
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
      paddingLeft: 0,
    },
    [`& .${treeItemClasses.iconContainer}`]: {
      display: "none",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
  },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      style={{
        marginTop: "4px",
        marginBottom: "4px",
      }}
      {...other}
    />
  );
}

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

  React.useEffect(() => {
    const storedId = getNavItemIdFromStorage(currentUrl);
    const expandedIds = calcExpandedIds(
      data,
      currentUrl,
      storedId || undefined
    );
    setExpanded(expandedIds);
    expandedIds.length && setSelected([expandedIds[expandedIds.length - 1]]);
  }, [data, currentUrl]);

  // ! Add "auto scroll" to left nav is not recommended.
  React.useEffect(() => {
    const targetActiveItem:
      | (HTMLElement & { scrollIntoViewIfNeeded: () => void })
      | null = document?.querySelector(".MuiTreeView-root .Mui-selected");
    if (targetActiveItem) {
      scrollToElementIfInView(targetActiveItem);
    }
  }, [selected]);

  const renderNavs = (items: RepoNavLink[]) => {
    return items.map((item) => {
      if (item.type === "heading") {
        return (
          <Typography
            pl="8px"
            mb="8px"
            mt="16px"
            fontWeight={700}
            fontSize="12px"
            lineHeight="1.15rem"
            color="#666"
            sx={{ textTransform: "uppercase" }}
          >
            {item.content[0] as string}
          </Typography>
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
            }
          }}
        >
          <StyledTreeItem
            nodeId={item.id}
            label={<LabelEle />}
            ContentProps={{
              style: { width: "inherit" },
            }}
          >
            {hasChildren
              ? renderTreeItems(item.children as RepoNavLink[], deepth + 1)
              : null}
          </StyledTreeItem>
        </LinkComponent>
      );
    });
  };

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  return (
    <TreeView
      id="left-nav-treeview"
      aria-label="left navigation"
      expanded={expanded}
      selected={selected}
      onNodeToggle={handleToggle}
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
