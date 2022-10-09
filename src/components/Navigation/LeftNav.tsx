import * as React from "react";
import { Link, Trans, useI18next } from "gatsby-plugin-react-i18next";
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
import Divider from "@mui/material/Divider";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { PingcapLogoWithoutTextIcon } from "components/Icons";

import {
  DocLeftNavItem,
  DocLeftNav,
  DocLeftNavItemContent,
  PathConfig,
} from "static/Type";
import LinkComponent from "components/Link";
import LeftNavTree from "components/Navigation/LeftNavTree";
import VersionSelect, {
  NativeVersionSelect,
} from "components/Dropdown/VersionSelect";
import { generatePingcapUrl } from "utils";

interface LeftNavProps {
  data: DocLeftNav;
  current: string;
  name: string;
  pathConfig: PathConfig;
  availIn: string[];
}

export function LeftNavDesktop(props: LeftNavProps) {
  const { data, current, name, pathConfig, availIn } = props;

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
          maxHeight: "calc(100vh - 7rem)",
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        {pathConfig.repo !== "tidbcloud" && (
          <VersionSelect
            name={name}
            pathConfig={pathConfig}
            availIn={availIn}
          />
        )}
        <LeftNavTree data={data} current={current} />
      </Box>
    </Box>
  );
}

export function LeftNavMobile(props: LeftNavProps) {
  const { data, current, name, pathConfig, availIn } = props;

  const [open, setOpen] = React.useState(false);

  const { language } = useI18next();

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
        <Box sx={{ width: "17.125rem", padding: "0.625rem" }}>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              padding: "0 0.5rem",
            }}
          >
            <LinkComponent to={generatePingcapUrl(language)}>
              <PingcapLogoWithoutTextIcon />
            </LinkComponent>
            <Divider
              orientation="vertical"
              sx={{
                height: "3rem",
                paddingLeft: "1.25rem",
              }}
            />
            {pathConfig.repo !== "tidbcloud" && (
              <NativeVersionSelect
                name={name}
                pathConfig={pathConfig}
                availIn={availIn}
              />
            )}
          </Stack>
        </Box>

        <Divider />
        <Box sx={{ width: "17.125rem", padding: "1rem" }}>
          <LeftNavTree data={data} current={current} />
        </Box>
      </Drawer>
    </>
  );
}
