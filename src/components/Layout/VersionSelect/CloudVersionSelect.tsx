import * as React from "react";

import MenuItem from "@mui/material/MenuItem";
import CheckIcon from "@mui/icons-material/Check";

import { PathConfig, BuildType } from "shared/interface";
import { AllVersion } from "shared/utils";
import LinkComponent from "components/Link";
import { Box, Typography } from "@mui/material";
import { Chip } from "@mui/material";
import { CLOUD_MODE_KEY, useCloudPlan } from "shared/useCloudPlan";
import { VersionSelectButton, VersionSelectMenu } from "./SharedSelect";
import { useEffect, useRef, useState } from "react";

export const CLOUD_PLAN_LABEL_ELEMENT_ID = "cloud-plan-label";

export const CLOUD_PLAN_LABEL_STRINGS = {
  dedicated: "Dedicated",
  starter: "Starter (formerly Serverless)",
  essential: "Essential",
  premium: "Premium",
};

const CLOUD_VERSIONS: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}[] = [
  {
    label: "Premium",
    value: "premium",
  },
];

const VersionItems = (props: {
  versions: (string | null)[];
  availIn: string[];
  pathConfig: PathConfig;
  name: string;
  onClick: () => void;
  availablePlans: string[];
}) => {
  const { pathConfig } = props;
  // const { cloudPlan, setCloudPlan } = useCloudPlan();
  // const currentCloudVersion =
  //   CLOUD_VERSIONS.find((version) => version.value === cloudPlan) ||
  //   CLOUD_VERSIONS[0];

  const getToUrl = (version: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(CLOUD_MODE_KEY, version);
    return version === "premium"
      ? `/${pathConfig.repo}/`
      : `/${pathConfig.repo}/${version}/?${searchParams.toString()}`;
  };
  const onClick = (version: string) => {
    // setCloudPlan(version);
    props.onClick();
  };

  return (
    <>
      {CLOUD_VERSIONS.filter((version) =>
        props.availablePlans.includes(version.value)
      ).map((version) => (
        <MenuItem
          key={`menu-${version.value}`}
          value={`menu-${version.value}`}
          component={LinkComponent}
          isI18n
          to={getToUrl(version.value)}
          clearCloudMode={version.value === "premium"}
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
            {/* {version.value === currentCloudVersion?.value && ( */}
            <CheckIcon
              sx={(theme) => ({ color: theme.palette.primary.main })}
            />
            {/* )} */}
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
  availablePlans: string[];
}

export default function CloudVersionSelect(props: VersionSelectProps) {
  const { name, pathConfig, availIn, availablePlans } = props;
  const currentCloudVersion = CLOUD_VERSIONS[0];
  const anchorEl = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

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
              fontWeight: 700,
            }}
          >
            {isClient ? (
              currentCloudVersion.label
            ) : (
              <span id={CLOUD_PLAN_LABEL_ELEMENT_ID} ref={labelRef} />
            )}
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
          availablePlans={availablePlans}
        />
      </VersionSelectMenu>
    </>
  );
}
