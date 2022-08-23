import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import { SvgIconProps } from "@mui/material/SvgIcon";

import { DocLeftNavItem, DocLeftNav, DocLeftNavItemContent } from "static/Type";
import LinkComponent from "components/Link";

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
    color: theme.palette.text.secondary,
    // borderTopRightRadius: theme.spacing(2),
    // borderBottomRightRadius: theme.spacing(2),
    borderRadius: theme.spacing(0.5),
    // paddingRight: theme.spacing(1),
    // fontWeight: theme.typography.fontWeightMedium,
    // "&.Mui-expanded": {
    //   fontWeight: theme.typography.fontWeightRegular,
    // },
    "&:hover": {
      backgroundColor: "#EFF4F7",
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, #EAF6FB)`,
      color: "var(--tree-view-color, #0A85C2)",
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
    // marginLeft: 0,
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
  const [selected, setSelected] = React.useState<string[]>([]);

  const theme = useTheme();

  React.useEffect(() => {
    console.log("currentUrl", currentUrl);
    const expandedIds = calcExpandedIds(data, currentUrl);
    setExpanded(expandedIds);
    expandedIds.length && setSelected([expandedIds[expandedIds.length - 1]]);
  }, [data, currentUrl]);

  const renderTreeItems = (items: DocLeftNavItem[]) => {
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
            }}
          >
            {item.link ? (
              <LinkComponent
                to={item.link}
                style={{ width: "100%", color: "inherit" }}
              >
                {generateItemLabel(item.content)}
              </LinkComponent>
            ) : (
              generateItemLabel(item.content)
            )}
            {hasChildren ? (
              <ChevronRightIcon
                sx={{
                  fill: theme.palette.website.k1,
                  marginLeft: "auto",
                  transform: isItemExpanded ? "rotate(90deg)" : "none",
                }}
              />
            ) : null}
          </Stack>
        );
      };
      return (
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
            ? renderTreeItems(item.children as DocLeftNavItem[])
            : null}
        </StyledTreeItem>
      );
    });
  };

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? ["1", "5", "6", "7"] : []
    );
  };

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length === 0
        ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
        : []
    );
  };

  return (
    <Box
      component="aside"
      sx={{
        width: "18.75rem",
        borderRight: "1px solid #E5E4E4",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: "6rem",
          height: "100%",
          maxHeight: "calc(100vh - 8rem)",
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        <TreeView
          aria-label="left navigation"
          // defaultCollapseIcon={<ExpandMoreIcon />}
          // defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          selected={selected}
          onNodeToggle={handleToggle}
          // onNodeSelect={handleSelect}
        >
          {renderTreeItems(data)}
        </TreeView>
      </Box>
    </Box>
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
            sx={{ color: "inherit" }}
          >
            {content}
          </Typography>
        ) : (
          <Typography
            key={`${content.value}-${index}`}
            component="code"
            sx={{ color: "inherit" }}
          >
            {content.value}
          </Typography>
        )
      )}
    </Box>
  );
};
