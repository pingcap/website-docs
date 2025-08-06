import * as React from "react";

import { styled, alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import { useTheme } from "@mui/material/styles";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { PathConfig, BuildType } from "shared/interface";
import { AllVersion } from "shared/utils";
import LinkComponent from "components/Link";
import { Typography } from "@mui/material";
import { Chip } from "@mui/material";
import { CLOUD_MODE_KEY, useCloudMode } from "shared/useCloudMode";

const CLOUD_VERSIONS = [
  {
    label: "Dedicated",
    value: "dedicated",
  },
  {
    label: "Starter",
    value: "starter",
  },
  {
    label: "Essential",
    value: "essential",
    icon: (
      <Chip
        label="Preview"
        variant="outlined"
        size="small"
        sx={{
          fontSize: "12px",
          height: "20px",
          pointerEvents: "none",
          borderColor: "#DCE3E5",
          color: "#6F787B",
        }}
      />
    ),
  },
];

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    marginTop: theme.spacing(1),
    minWidth: 268,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

interface VersionSelectProps {
  name: string;
  pathConfig: PathConfig;
  availIn: string[];
  buildType?: BuildType;
}

const VersionItems = (props: {
  versions: (string | null)[];
  availIn: string[];
  pathConfig: PathConfig;
  name: string;
  onClick: () => void;
}) => {
  const { pathConfig } = props;

  const getToUrl = (version: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(CLOUD_MODE_KEY, version);
    return version === "dedicated"
      ? `/${pathConfig.repo}/`
      : `/${pathConfig.repo}/?${searchParams.toString()}`;
  };
  const onClick = (version: string) => {
    sessionStorage.setItem(CLOUD_MODE_KEY, version);
    props.onClick();
  };

  return (
    <>
      {CLOUD_VERSIONS.map((version) => (
        <MenuItem
          key={`menu-${version.value}`}
          value={`menu-${version.value}`}
          component={LinkComponent}
          isI18n
          to={getToUrl(version.value)}
          clearCloudMode={version.value === "dedicated"}
          onClick={() => onClick(version.value)}
        >
          <Typography
            component="div"
            sx={{
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              marginRight: "0.2rem",
            }}
          >
            {version.label}
          </Typography>
          {version.icon}
        </MenuItem>
      ))}
    </>
  );
};

export default function CloudVersionSelect(props: VersionSelectProps) {
  const { name, pathConfig, availIn } = props;
  const { cloudMode } = useCloudMode();
  const currentCloudVersion =
    CLOUD_VERSIONS.find((version) => version.value === cloudMode) ||
    CLOUD_VERSIONS[0];
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();

  return (
    <>
      <Button
        id="version-select-button"
        aria-controls={open ? "verison-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={
          <ChevronRightIcon
            sx={{
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              height: "16px",
              width: "16px",
              fill: theme.palette.website.f3,
              marginRight: "0.25rem",
            }}
          />
        }
        sx={{
          width: "100%",
          height: "2rem",
          justifyContent: "space-between",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "website.m4",
          marginBottom: "1rem",
        }}
      >
        <Typography
          component="div"
          sx={{
            padding: "0 0.25rem",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          }}
        >
          {currentCloudVersion?.label}
        </Typography>
      </Button>
      <StyledMenu
        id="verison-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "version-select-button",
        }}
      >
        <VersionItems
          versions={AllVersion[pathConfig.repo][pathConfig.locale]}
          availIn={availIn}
          pathConfig={pathConfig}
          name={name}
          onClick={handleClose}
        />
      </StyledMenu>
    </>
  );
}
