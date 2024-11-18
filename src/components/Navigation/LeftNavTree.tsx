import * as React from "react";
import Box from "@mui/material/Box";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import { SvgIconProps } from "@mui/material/SvgIcon";

import {
  DocLeftNavItem,
  DocLeftNav,
  DocLeftNavItemContent,
} from "shared/interface";
import LinkComponent from "components/Link";
import { scrollToElementIfInView } from "shared/utils";
import { Tooltip } from "@mui/material";

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
    },
    [`& .${treeItemClasses.iconContainer}`]: {
      display: "none",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
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
      // label={
      //   <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
      //     <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
      //     <Typography
      //       variant="body2"
      //       sx={{ fontWeight: "inherit", flexGrow: 1 }}
      //     >
      //       {labelText}
      //     </Typography>
      //     <Typography variant="caption" color="inherit">
      //       {labelInfo}
      //     </Typography>
      //   </Box>
      // }
      style={{
        marginTop: "0.1875rem",
        marginBottom: "0.1875rem",
      }}
      {...other}
    />
  );
}

const calcExpandedIds = (data: DocLeftNavItem[], targetLink: string) => {
  const ids: string[] = [];
  const treeForeach = (
    data: DocLeftNavItem[],
    parents: string[] = []
  ): void => {
    data.forEach((item) => {
      if (item.link === targetLink) {
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

export default function ControlledTreeView(props: {
  data: DocLeftNav;
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
    const expandedIds = calcExpandedIds(data, currentUrl);
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

  const renderTreeItems = (items: DocLeftNavItem[], deepth = 0) => {
    return items.map((item: DocLeftNavItem) => {
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
              <Box width={16} height={16} />
            )}
            {generateItemLabel(item.content)}
          </Stack>
        );
      };
      return (
        <LinkComponent
          key={item.id}
          to={item.link}
          style={{ width: "100%", color: "inherit" }}
          onClick={(e) => e.stopPropagation()}
        >
          <StyledTreeItem
            nodeId={item.id}
            label={<LabelEle />}
            // onClick={() => {
            //   console.log(item.id);
            // }}
            ContentProps={{
              style: { width: "inherit" },
            }}
          >
            {hasChildren
              ? renderTreeItems(item.children as DocLeftNavItem[], deepth + 1)
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
      {renderTreeItems(data)}
    </TreeView>
  );
}

const generateItemLabel = (content: DocLeftNavItemContent) => {
  return (
    <Box sx={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>
      {content.map((content, index) =>
        typeof content === "string" ? (
          <Tooltip
            key={`${content}-${index}`}
            title={content}
            enterDelay={1000}
          >
            <Typography
              component="div"
              sx={{
                color: "inherit",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
              }}
            >
              {content}
            </Typography>
          </Tooltip>
        ) : (
          <Tooltip
            key={`${content}-${index}`}
            title={content.value}
            enterDelay={1000}
          >
            <Typography
              component="code"
              sx={{
                color: "inherit",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
              }}
            >
              {content.value}
            </Typography>
          </Tooltip>
        )
      )}
    </Box>
  );
};
