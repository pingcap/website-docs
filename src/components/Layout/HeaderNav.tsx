import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";

import LinkComponent from "components/Link";
import { generateDownloadURL, generateContactURL } from "utils";

export default function HeaderNavStack() {
  const { language } = useI18next();
  const [selectedItem, setSelectedItem] = React.useState<string>("");

  React.useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname === "/" || pathname === `/${language}/`) {
      setSelectedItem("home");
    } else if (pathname.includes("/tidb/")) {
      setSelectedItem("tidb");
    } else if (pathname.includes("/tidbcloud/")) {
      setSelectedItem("tidbcloud");
    }
  }, [window.location.pathname, language]);

  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{ paddingLeft: "2rem", height: "100%" }}
    >
      {["en", "zh"].includes(language) && (
        <NavItem
          selected={selectedItem === "home"}
          label={<Trans i18nKey="navbar.home" />}
          to="/"
        />
      )}

      <NavItem
        selected={selectedItem === "tidb"}
        label={<Trans i18nKey="navbar.tidb" />}
        to={`/tidb/stable`}
      />

      {["en", "ja"].includes(language) && (
        <NavItem
          selected={selectedItem === "tidbcloud"}
          label={<Trans i18nKey="navbar.cloud" />}
          to={`/tidbcloud`}
        />
      )}

      <NavItem
        label={<Trans i18nKey="navbar.download" />}
        to={generateDownloadURL(language)}
      />

      <NavItem
        label={<Trans i18nKey="navbar.contactUs" />}
        to={generateContactURL(language)}
      />
    </Stack>
  );
}

const NavItem = (props: {
  selected?: boolean;
  label: string | React.ReactElement;
  to: string;
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
            ? `4px solid ${theme.palette.website.k1}`
            : ``,
        }}
      >
        <LinkComponent to={props.to}>
          <Typography variant="body1" component="div">
            {props.label}
          </Typography>
        </LinkComponent>
      </Box>
    </>
  );
};
