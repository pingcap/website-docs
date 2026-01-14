import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { RepoNav, PathConfig, BuildType, TOCNamespace } from "shared/interface";
import { NavItemConfig } from "../Header/HeaderNavConfigType";
import LinkComponent from "components/Link";
import LeftNavTree, { clearAllNavStates } from "./LeftNavTree";
import VersionSelect, {
  NativeVersionSelect,
} from "../VersionSelect/VersionSelect";
import { getHeaderHeight } from "shared/headerHeight";

import TiDBLogoWithoutText from "media/logo/tidb-logo.svg";

interface LeftNavProps {
  data: RepoNav;
  current: string;
  name: string;
  pathConfig: PathConfig;
  availIn: string[];
  buildType?: BuildType;
  bannerEnabled?: boolean;
  availablePlans: string[];
  selectedNavItem?: NavItemConfig | null;
  language?: string;
  namespace?: TOCNamespace;
}

export function LeftNavDesktop(props: LeftNavProps) {
  const {
    data,
    current,
    name,
    pathConfig,
    availIn,
    buildType,
    selectedNavItem,
    namespace,
  } = props;
  const theme = useTheme();

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
          top: getHeaderHeight(props.bannerEnabled || false),
          height: "100%",
          maxHeight: `calc(100vh - ${getHeaderHeight(
            props.bannerEnabled || false
          )})`,
          boxSizing: "border-box",
          overflowY: "auto",
          padding: "20px 16px",
        }}
      >
        {selectedNavItem && (
          <Box
            sx={{
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: theme.palette.carbon[200],
              },
            }}
          >
            <LinkComponent
              isI18n={selectedNavItem.isI18n ?? true}
              to={selectedNavItem.to}
              style={{ textDecoration: "none", display: "block" }}
              onClick={() => {
                clearAllNavStates();
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: theme.palette.carbon[900],
                  padding: "8px",
                }}
              >
                {selectedNavItem.label}
              </Typography>
            </LinkComponent>
          </Box>
        )}

        {namespace === TOCNamespace.TiDB && (
          <VersionSelect
            name={name}
            pathConfig={pathConfig}
            availIn={availIn}
            buildType={buildType}
          />
        )}
        {/* {pathConfig.repo === "tidbcloud" && (
          <CloudVersionSelect
            name={name}
            pathConfig={pathConfig}
            availIn={availIn}
            buildType={buildType}
            availablePlans={availablePlans}
          />
        )} */}
        <LeftNavTree data={data} current={current} />
      </Box>
    </Box>
  );
}

export function LeftNavMobile(props: LeftNavProps) {
  const { data, current, name, pathConfig, availIn, buildType } = props;

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
            <LinkComponent to="/">
              <TiDBLogoWithoutText />
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
                buildType={buildType}
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
