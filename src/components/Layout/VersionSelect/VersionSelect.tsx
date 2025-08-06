import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import { navigate as gatsbyNavigate } from "gatsby";

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

import { PathConfig, BuildType } from "shared/interface";
import { ARCHIVE_WEBSITE_URL } from "shared/resources";
import { AllVersion } from "shared/utils";
import CONFIG from "../../../../docs/docs.json";
import LinkComponent from "components/Link";
import { Box, Divider, Typography } from "@mui/material";

function renderVersion(
  version: string | null,
  pathConfig: PathConfig,
  isArchive: boolean = false
) {
  const { docs } = CONFIG;
  const isDmr =
    (docs[pathConfig.repo] as { dmr: string[] }).dmr?.includes(version || "") ??
    false;
  if (isDmr) {
    return isArchive ? `${version} (DMR)` : version;
  }
  if (version !== "stable") return version;
  return (docs[pathConfig.repo] as { stable: string }).stable.replace(
    "release-",
    "v"
  );
}

export const VersionSelectMenu = styled((props: MenuProps) => (
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
      padding: "8px",
    },
    "& .MuiMenuItem-root": {
      height: "40px",
      padding: "10px 12px",
      justifyContent: "space-between",
      "& .MuiSvgIcon-root": {
        fontSize: 18,
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

  const { t, language } = useI18next();

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

  const shouldHideDevMemo = React.useMemo(() => {
    const targetRepo = CONFIG.docs[pathConfig.repo];
    return !targetRepo.languages.en.versions.includes(`master`);
  }, [pathConfig.repo]);

  return (
    <>
      <MenuItem
        key={`menu-dev`}
        value={`menu-dev`}
        hidden={shouldHideDevMemo}
        disabled={!availIn.includes(`dev` || "")}
        component={LinkComponent}
        isI18n
        to={`/${pathConfig.repo}/dev/${name}`}
      >
        <Typography
          component="div"
          sx={{
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          }}
        >
          {renderVersion(`Dev`, pathConfig)}
        </Typography>
      </MenuItem>

      <Divider sx={{ margin: "4px 0" }} />

      {pathConfig.repo === "tidb" && (
        <FormLabel
          sx={{
            display: "inline-block",
            fontSize: "12px",
            lineHeight: "1.25rem",
            color: "#6F787B",
            pl: "12px",
            mb: "8px",
          }}
        >
          Long-Term Support
        </FormLabel>
      )}
      {LTSVersions.map((version) => (
        <MenuItem
          key={`menu-${version}`}
          value={`menu-${version}`}
          disabled={!availIn.includes(version || "")}
          component={LinkComponent}
          isI18n
          to={`/${pathConfig.repo}/${version}/${name}`}
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
        </MenuItem>
      ))}

      <Divider sx={{ margin: "4px 0" }} />

      {pathConfig.repo === "tidb" && DMRVersions.length > 0 && (
        <>
          <FormLabel
            sx={{
              display: "inline-block",
              fontSize: "12px",
              lineHeight: "1.25rem",
              color: "#6F787B",
              pl: "12px",
              mb: "8px",
            }}
          >
            DMR
          </FormLabel>
          {DMRVersions.map((version) => (
            <MenuItem
              key={`menu-${version}`}
              value={`menu-${version}`}
              disabled={!availIn.includes(version || "")}
              component={LinkComponent}
              isI18n
              to={`/${pathConfig.repo}/${version}/${name}`}
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
            </MenuItem>
          ))}
        </>
      )}

      <Divider sx={{ margin: "4px 0" }} />
      <MenuItem
        component={LinkComponent}
        isI18n
        to={generateArchivedWebsiteUrlByLangAndType(language, pathConfig.repo)}
      >
        <Typography
          component="div"
          sx={{
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          }}
        >
          {t("navbar.archive-label")}
        </Typography>
      </MenuItem>
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
          component={LinkComponent}
          isI18n
          to={`/${pathConfig.repo}/${version}/${name}`}
        >
          <Typography
            component="div"
            sx={{
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
            }}
          >
            {renderVersion(version, pathConfig, true)}
          </Typography>
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
    <Box
      sx={{
        position: "sticky",
        top: "-20px",
        backgroundColor: "#fff",
        marginTop: "-20px",
        marginLeft: "-16px",
        marginRight: "-16px",
        paddingTop: "20px",
        paddingLeft: "16px",
        paddingRight: "16px",
        zIndex: 1000,
      }}
    >
      <Button
        sx={{
          width: "100%",
          height: "40px",
          justifyContent: "space-between",
          borderStyle: "solid",
          borderWidth: "2px",
          marginBottom: "1rem",
          borderColor: open ? "#1E2426" : "#DCE3E5",
          "&:hover": {
            borderColor: "#9FA9AD",
            backgroundColor: "#fff",
          },
        }}
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
      >
        <Typography
          component="div"
          sx={{
            padding: "0 0.25rem",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          }}
        >
          {buildType === "archive"
            ? renderVersion(pathConfig.version, pathConfig, true)
            : renderVersion(pathConfig.version, pathConfig)}
        </Typography>
      </Button>
      <VersionSelectMenu
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
      </VersionSelectMenu>
    </Box>
  );
}

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    // border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

export function NativeVersionSelect(props: VersionSelectProps) {
  const { name, pathConfig, availIn, buildType } = props;

  const { navigate: i18nNavigate, t, language } = useI18next();

  const handleChange = (event: { target: { value: string } }) => {
    if (event.target.value === "archive") {
      gatsbyNavigate(
        generateArchivedWebsiteUrlByLangAndType(language, pathConfig.repo)
      );
      return;
    }
    // setSelectedVersion(event.target.value);
    i18nNavigate(`/${pathConfig.repo}/${event.target.value}/${name}`);
  };

  return (
    <>
      <FormControl sx={{ m: 1 }} variant="standard">
        <NativeSelect
          id="version-select-native"
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
          {buildType !== "archive" && (
            <option key="archive" value="archive">
              {t("navbar.archive-label")}
            </option>
          )}
        </NativeSelect>
      </FormControl>
    </>
  );
}

function generateArchivedWebsiteUrlByLangAndType(lang?: string, type?: string) {
  let url = ARCHIVE_WEBSITE_URL;

  switch (lang) {
    case "zh":
      url = `${ARCHIVE_WEBSITE_URL}/zh`;
      break;
    case "jp":
      url = `${ARCHIVE_WEBSITE_URL}/jp`;
      break;
    default:
      break;
  }
  switch (type) {
    case "tidb-in-kubernetes":
      url = `${url}/tidb-in-kubernetes/v1.0`;
      break;
    default:
      break;
  }

  return url;
}
