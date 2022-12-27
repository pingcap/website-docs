import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";

import { styled, alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import FormLabel from "@mui/material/FormLabel";
import { useTheme } from "@mui/material/styles";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { PathConfig, BuildType } from "static/Type";
import { AllVersion } from "utils";
import CONFIG from "../../../docs/docs.json";
import LinkComponent from "components/Link";
import { Typography } from "@mui/material";

function renderVersion(version: string | null, pathConfig: PathConfig) {
  const { docs } = CONFIG;
  const isDmr =
    (docs[pathConfig.repo] as { dmr: string[] }).dmr?.includes(version || "") ??
    false;
  if (isDmr) return `${version}`;
  if (version !== "stable") return version;
  return (docs[pathConfig.repo] as { stable: string }).stable.replace(
    "release-",
    "v"
  );
}

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
    borderRadius: 6,
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
}) => {
  const { versions, availIn, pathConfig, name } = props;

  const repoCfg = CONFIG.docs[pathConfig.repo] as {
    [key: string]: any;
  };
  const dmrList = (repoCfg && (repoCfg?.dmr as string[])) || [];
  const archiveList = (repoCfg?.archived as string[]) || [];

  const LTSVersions = versions.filter((v) => {
    return (
      !dmrList.includes(v || "") &&
      !archiveList.includes(v || "") &&
      v !== "dev"
    );
  });
  const DMRVersions = versions.filter((v) => dmrList.includes(v || ""));

  return (
    <>
      <MenuItem
        key={`menu-dev`}
        value={`menu-dev`}
        disabled={!availIn.includes(`dev` || "")}
      >
        <LinkComponent
          isI18n
          to={`/${pathConfig.repo}/dev/${name}`}
          style={{
            width: "100%",
            color: "#666666",
          }}
        >
          <Typography
            component="div"
            sx={{
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
            }}
          >
            {renderVersion(`dev`, pathConfig)}
          </Typography>
        </LinkComponent>
      </MenuItem>
      <FormLabel
        sx={{
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          fontWeight: "bold",
          pl: "0.5rem",
        }}
      >
        LTS
      </FormLabel>
      {LTSVersions.map((version) => (
        <MenuItem
          key={`menu-${version}`}
          value={`menu-${version}`}
          disabled={!availIn.includes(version || "")}
        >
          <LinkComponent
            isI18n
            to={`/${pathConfig.repo}/${version}/${name}`}
            style={{
              width: "100%",
              color: "#666666",
            }}
          >
            <Typography
              component="div"
              sx={{
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
              }}
            >
              {renderVersion(version, pathConfig)}
            </Typography>
          </LinkComponent>
        </MenuItem>
      ))}
      <FormLabel
        sx={{
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          fontWeight: "bold",
          pl: "0.5rem",
        }}
      >
        DMR
      </FormLabel>
      {DMRVersions.map((version) => (
        <MenuItem
          key={`menu-${version}`}
          value={`menu-${version}`}
          disabled={!availIn.includes(version || "")}
        >
          <LinkComponent
            isI18n
            to={`/${pathConfig.repo}/${version}/${name}`}
            style={{
              width: "100%",
              color: "#666666",
            }}
          >
            <Typography
              component="div"
              sx={{
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
              }}
            >
              {renderVersion(version, pathConfig)}
            </Typography>
          </LinkComponent>
        </MenuItem>
      ))}
    </>
  );
};

const VersionItemsArchived = (props: {
  versions: (string | null)[];
  availIn: string[];
  pathConfig: PathConfig;
  name: string;
}) => {
  const { versions, availIn, pathConfig, name } = props;

  const repoCfg = CONFIG.docs[pathConfig.repo] as {
    [key: string]: any;
  };
  const archiveList = (repoCfg?.archived as string[]) || [];

  return (
    <>
      <FormLabel
        sx={{
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          fontWeight: "bold",
          pl: "0.5rem",
        }}
      >
        Archive
      </FormLabel>
      {archiveList.map((version) => (
        <MenuItem
          key={`menu-${version}`}
          value={`menu-${version}`}
          disabled={!availIn.includes(version || "")}
        >
          <LinkComponent
            isI18n
            to={`/${pathConfig.repo}/${version}/${name}`}
            style={{
              width: "100%",
              color: "#666666",
            }}
          >
            <Typography
              component="div"
              sx={{
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
              }}
            >
              {renderVersion(version, pathConfig)}
            </Typography>
          </LinkComponent>
        </MenuItem>
      ))}
    </>
  );
};

export default function VersionSelect(props: VersionSelectProps) {
  const { name, pathConfig, availIn, buildType } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
              height: "1.5rem",
              width: "1.5rem",
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
          {renderVersion(pathConfig.version, pathConfig)}
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
        {buildType === "archive" ? (
          <VersionItemsArchived
            versions={AllVersion[pathConfig.repo][pathConfig.locale]}
            availIn={availIn}
            pathConfig={pathConfig}
            name={name}
          />
        ) : (
          <VersionItems
            versions={AllVersion[pathConfig.repo][pathConfig.locale]}
            availIn={availIn}
            pathConfig={pathConfig}
            name={name}
          />
        )}
      </StyledMenu>
    </>
  );
}

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    // border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    // fontFamily: [
    //   "-apple-system",
    //   "BlinkMacSystemFont",
    //   '"Segoe UI"',
    //   "Roboto",
    //   '"Helvetica Neue"',
    //   "Arial",
    //   "sans-serif",
    //   '"Apple Color Emoji"',
    //   '"Segoe UI Emoji"',
    //   '"Segoe UI Symbol"',
    // ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

export function NativeVersionSelect(props: VersionSelectProps) {
  const { name, pathConfig, availIn } = props;

  const { navigate: i18nNavigate } = useI18next();

  const handleChange = (event: { target: { value: string } }) => {
    // setSelectedVersion(event.target.value);
    i18nNavigate(`/${pathConfig.repo}/${event.target.value}/${name}`);
  };

  return (
    <>
      <FormControl sx={{ m: 1 }} variant="standard">
        <NativeSelect
          id="demo-customized-select-native"
          value={`${pathConfig.version}`}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          {AllVersion[pathConfig.repo][pathConfig.locale].map((version) => (
            <option
              key={`${version}`}
              value={`${version}`}
              disabled={!availIn.includes(version || "")}
            >
              {renderVersion(version, pathConfig)}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </>
  );
}
