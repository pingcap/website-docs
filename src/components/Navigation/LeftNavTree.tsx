import * as React from "react";
import Box from "@mui/material/Box";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import { SvgIconProps } from "@mui/material/SvgIcon";

import { DocLeftNavItem, DocLeftNav, DocLeftNavItemContent } from "static/Type";
import LinkComponent from "components/Link";
import { scrollToElementIfInView } from "utils";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon?: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText?: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  // color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.website.f1,
    // borderTopRightRadius: theme.spacing(2),
    // borderBottomRightRadius: theme.spacing(2),
    borderRadius: theme.spacing(0.5),
    // paddingRight: theme.spacing(1),
    // fontWeight: theme.typography.fontWeightMedium,
    // "&.Mui-expanded": {
    //   fontWeight: theme.typography.fontWeightRegular,
    // },
    "&:hover": {
      backgroundColor: `#EAF6FB!important`,
    },
    "&.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, #EAF6FB)`,
      color: "var(--tree-view-color, #0A85C2)",
      [`& svg.MuiTreeItem-ChevronRightIcon`]: {
        fill: "var(--tree-view-color, #0A85C2)",
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
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
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
            direction="row"
            sx={{
              minHeight: "1.75rem",
              alignItems: "center",
              paddingLeft: `${deepth * 0.5}rem`,
              paddingTop: "0.25rem",
              paddingBottom: "0.25rem",
            }}
          >
            {generateItemLabel(item.content)}
            {hasChildren ? (
              <ChevronRightIcon
                className="MuiTreeItem-ChevronRightIcon"
                sx={{
                  fill: theme.palette.website.f3,
                  height: "1rem",
                  width: "1rem",
                  marginLeft: "auto",
                  transform: isItemExpanded ? "rotate(90deg)" : "none",
                }}
              />
            ) : null}
          </Stack>
        );
      };
      return (
        <LinkComponent
          to={item.link}
          style={{ width: "100%", color: "inherit" }}
          onClick={(e) => e.stopPropagation()}
        >
          <StyledTreeItem
            key={item.id}
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
    <Box sx={{ width: "100%" }}>
      {content.map((content, index) =>
        typeof content === "string" ? (
          <Typography
            key={`${content}-${index}`}
            component="div"
            sx={{
              color: "inherit",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
            }}
          >
            {content}
          </Typography>
        ) : (
          <Typography
            key={`${content.value}-${index}`}
            component="code"
            sx={{
              color: "inherit",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
            }}
          >
            {content.value}
          </Typography>
        )
      )}
    </Box>
  );
};
