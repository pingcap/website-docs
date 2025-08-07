import * as React from "react";

import MenuItem from "@mui/material/MenuItem";
import CheckIcon from "@mui/icons-material/Check";

import { PathConfig, BuildType } from "shared/interface";
import { AllVersion } from "shared/utils";
import LinkComponent from "components/Link";
import { Box, Typography } from "@mui/material";
import { Chip } from "@mui/material";
import { CLOUD_MODE_KEY, useCloudMode } from "shared/useCloudMode";
import { VersionSelectButton, VersionSelectMenu } from "./SharedSelect";
import { useRef } from "react";

const CLOUD_VERSIONS = [
  {
    label: "Dedicated",
    value: "dedicated",
  },
  {
    label: (
      <span>
        Starter<span style={{ color: "#9FA9AD" }}> (formerly Serverless)</span>
      </span>
    ),
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

const VersionItems = (props: {
  versions: (string | null)[];
  availIn: string[];
  pathConfig: PathConfig;
  name: string;
  onClick: () => void;
}) => {
  const { pathConfig } = props;
  const { cloudMode } = useCloudMode(pathConfig.repo);
  const currentCloudVersion =
    CLOUD_VERSIONS.find((version) => version.value === cloudMode) ||
    CLOUD_VERSIONS[0];

  const getToUrl = (version: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(CLOUD_MODE_KEY, version);
    return version === "dedicated"
      ? `/${pathConfig.repo}/`
      : `/${pathConfig.repo}/${version}/?${searchParams.toString()}`;
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
          <Box sx={{ display: "flex" }}>
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
          </Box>
          <Box display="flex" justifyContent="center">
            {version.value === currentCloudVersion?.value && (
              <CheckIcon
                sx={(theme) => ({ color: theme.palette.primary.main })}
              />
            )}
          </Box>
        </MenuItem>
      ))}
    </>
  );
};

interface VersionSelectProps {
  name: string;
  pathConfig: PathConfig;
  availIn: string[];
  buildType?: BuildType;
}

export default function CloudVersionSelect(props: VersionSelectProps) {
  const { name, pathConfig, availIn } = props;
  const { cloudMode } = useCloudMode(pathConfig.repo);
  const currentCloudVersion =
    CLOUD_VERSIONS.find((version) => version.value === cloudMode) ||
    CLOUD_VERSIONS[0];
  const anchorEl = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <VersionSelectButton open={open} handleClick={handleClick} ref={anchorEl}>
        <Box display="flex">
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
          {currentCloudVersion?.icon}
        </Box>
      </VersionSelectButton>
      <VersionSelectMenu
        id="verison-menu"
        anchorEl={anchorEl.current}
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
      </VersionSelectMenu>
    </>
  );
}
