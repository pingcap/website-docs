import * as React from "react";

import CheckIcon from "@mui/icons-material/Check";
import MenuItem from "@mui/material/MenuItem";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "gatsby-plugin-react-i18next";

import { CloudCompatibility, CloudPlan, PathConfig } from "shared/interface";
import {
  CLOUD_MODE_KEY,
  CLOUD_COMPATIBILITY_KEY,
  useCloudPlan,
} from "shared/useCloudPlan";
import LinkComponent from "components/Link";
import PreviewBadge from "components/Badge/PreviewBadge";
import { VersionSelectButton, VersionSelectMenu } from "./SharedSelect";

const COMPATIBILITY_VERSIONS = [
  {
    label: "MySQL Compatible",
    value: CloudCompatibility.MySQL,
  },
  {
    label: "PostgreSQL Compatible",
    value: CloudCompatibility.PostgreSQL,
  },
];

interface CompatibilitySelectProps {
  disableStickyContainer?: boolean;
  pathConfig: PathConfig;
}

export default function CloudCompatibilitySelect(
  props: CompatibilitySelectProps
) {
  const { disableStickyContainer } = props;
  const { t } = useTranslation();
  const { cloudCompatibility, setCloudCompatibility } = useCloudPlan();
  const currentCompatibility =
    COMPATIBILITY_VERSIONS.find(
      (version) => version.value === cloudCompatibility
    ) || COMPATIBILITY_VERSIONS[0];
  const anchorEl = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const getToUrl = (compatibility: CloudCompatibility) => {
    const searchParams = new URLSearchParams();
    searchParams.set(CLOUD_MODE_KEY, CloudPlan.Starter);
    searchParams.set(CLOUD_COMPATIBILITY_KEY, compatibility);

    return `/${props.pathConfig.repo}/starter/?${searchParams.toString()}`;
  };

  return (
    <>
      <VersionSelectButton
        open={open}
        handleClick={handleClick}
        ref={anchorEl}
        disableStickyContainer={disableStickyContainer}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "0 0.25rem",
            whiteSpace: "nowrap",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "0.75rem",
              lineHeight: "1.25rem",
              fontWeight: 700,
            }}
          >
            {currentCompatibility.label}
          </Typography>
          {currentCompatibility.value === CloudCompatibility.PostgreSQL && (
            <PreviewBadge label={t("navbar.badge.preview")} />
          )}
        </Box>
      </VersionSelectButton>
      <VersionSelectMenu
        id="cloud-compatibility-menu"
        anchorEl={anchorEl.current}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "version-select-button",
        }}
      >
        {COMPATIBILITY_VERSIONS.map((version) => (
          <MenuItem
            key={version.value}
            value={version.value}
            selected={version.value === currentCompatibility.value}
            component={LinkComponent}
            isI18n
            to={getToUrl(version.value)}
            onClick={() => {
              setCloudCompatibility(version.value);
              handleClose();
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Typography
                component="div"
                sx={{
                  fontSize: "0.75rem",
                  lineHeight: "1.25rem",
                }}
              >
                {version.label}
              </Typography>
              {version.value === CloudCompatibility.PostgreSQL && (
                <PreviewBadge label={t("navbar.badge.preview")} />
              )}
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              sx={{ marginLeft: "8px", flexShrink: 0 }}
            >
              {version.value === currentCompatibility.value && (
                <CheckIcon
                  sx={(theme) => ({ color: theme.palette.primary.main })}
                />
              )}
            </Box>
          </MenuItem>
        ))}
      </VersionSelectMenu>
    </>
  );
}
