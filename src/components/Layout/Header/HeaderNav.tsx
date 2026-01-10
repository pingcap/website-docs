import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

import LinkComponent from "components/Link";
import { usePageType, PageType } from "shared/usePageType";
import { BuildType } from "shared/interface";
import { GTMEvent, gtmTrack } from "shared/utils/gtm";
import { CLOUD_MODE_KEY, useCloudPlan } from "shared/useCloudPlan";

// `pageUrl` comes from server side render (or build): gatsby/path.ts/generateUrl
// it will be `undefined` in client side render
const useSelectedNavItem = (language?: string, pageUrl?: string) => {
  // init in server side
  const [selectedItem, setSelectedItem] = React.useState<PageType>(() =>
    usePageType(language, pageUrl)
  );

  // update in client side
  React.useEffect(() => {
    setSelectedItem(usePageType(language, window.location.pathname));
  }, [language]);

  return selectedItem;
};

export default function HeaderNavStack(props: {
  buildType?: BuildType;
  pageUrl?: string;
}) {
  const { language, t } = useI18next();
  const selectedItem = useSelectedNavItem(language, props.pageUrl);
  const { cloudPlan } = useCloudPlan();

  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{
        paddingLeft: "20px",
        height: "100%",
        display: {
          xs: "none",
          md: "flex",
        },
      }}
    >
      {props.buildType !== "archive" && (
        <NavItem
          selected={selectedItem === PageType.TiDBCloud}
          label={t("navbar.cloud")}
          to={
            cloudPlan === "dedicated" || !cloudPlan
              ? `/tidbcloud`
              : `/tidbcloud/${cloudPlan}?${CLOUD_MODE_KEY}=${cloudPlan}`
          }
        />
      )}

      <NavItem
        selected={selectedItem === PageType.TiDB}
        label={t("navbar.tidb")}
        to={props.buildType === "archive" ? "/tidb/v2.1" : "/tidb/stable"}
      />

      {/* {["zh"].includes(language) && (
        <NavItem label={t("navbar.asktug")} to="https://asktug.com/" />
      )}

      {["en", "ja"].includes(language) && (
        <NavItem
          label={t("navbar.learningCenter")}
          to={generateLearningCenterURL(language)}
        />
      )} */}

      {/* {language === "zh" && (
        <NavItem
          // label={<Trans i18nKey="navbar.download" />}
          to={generateDownloadURL(language)}
          alt="download"
          startIcon={<DownloadIcon fontSize="inherit" color="inherit" />}
        />
      )} */}
    </Stack>
  );
}

const NavItem = (props: {
  selected?: boolean;
  label?: string | React.ReactElement;
  to: string;
  startIcon?: React.ReactNode;
  alt?: string;
  onClick?: () => void;
}) => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          paddingTop: "0.25rem",
          paddingBottom: props.selected ? "0" : "0.25rem",
          borderBottom: props.selected
            ? `4px solid ${theme.palette.primary.main}`
            : ``,
        }}
      >
        <LinkComponent
          isI18n
          to={props.to}
          onClick={() => {
            gtmTrack(GTMEvent.ClickHeadNav, {
              item_name: props.label || props.alt,
            });

            props.onClick?.();
          }}
        >
          <Typography
            variant="body1"
            component="div"
            color="website.f1"
            padding="12px 0"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {props.startIcon}
            {props.label}
          </Typography>
        </LinkComponent>
      </Box>
    </>
  );
};
