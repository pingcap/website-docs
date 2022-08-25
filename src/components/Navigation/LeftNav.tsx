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
import Drawer from "@mui/material/Drawer";

import IconButton from "@mui/material/IconButton";

import MenuIcon from "@mui/icons-material/Menu";

import { DocLeftNavItem, DocLeftNav, DocLeftNavItemContent } from "static/Type";
import LinkComponent from "components/Link";
import LeftNavTree from "components/Navigation/LeftNavTree";

export function LeftNavDesktop(props: { data: DocLeftNav; current: string }) {
  return (
    <Box
      component="aside"
      sx={{
        width: "18.75rem",
        borderRight: "1px solid #E5E4E4",
        display: {
          xs: "none",
          lg: "block",
        },
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: "5rem",
          height: "100%",
          maxHeight: "calc(100vh - 5rem)",
          overflowY: "auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <LeftNavTree data={props.data} current={props.current} />
      </Box>
    </Box>
  );
}

export function LeftNavMobile(props: { data: DocLeftNav; current: string }) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(open);
    };

  return (
    <>
      <IconButton
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{
          display: {
            lg: "none",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: "17.125rem", padding: "1rem" }}>
          <LeftNavTree data={props.data} current={props.current} />
        </Box>
      </Drawer>
    </>
  );
}
