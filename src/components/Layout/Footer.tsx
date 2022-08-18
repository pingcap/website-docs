import * as React from "react";
import { Link, Trans, useI18next } from "gatsby-plugin-react-i18next";
import { graphql, useStaticQuery } from "gatsby";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";

import { PingcapLogoFooterIcon } from "components/Icons";
import LinkComponent from "components/Link";
import {
  splitArrayIntoChunks,
  generateIconGroup,
  generateFooterItems,
} from "utils";

export default function Footer() {
  return (
    <>
      <Box sx={{ bgcolor: "#20222B", padding: "3.5rem 0" }}>
        <Container maxWidth="lg">
          <FooterBlock />
          <Typography
            variant="body2"
            component="div"
            color="rgba(255, 255, 255, 0.5)"
            sx={{ paddingTop: "3rem" }}
          >
            © {new Date().getFullYear()} PingCAP. All Rights Reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
}

const FooterBlock = () => {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <Stack sx={{ gap: "2rem" }}>
        <PingcapLogoFooterIcon sx={{ width: "6.125rem", height: "1.625rem" }} />
        <IconGroup />
      </Stack>
      <FooterItems />
    </Stack>
  );
};

const IconGroup = () => {
  const theme = useTheme();
  const { language } = useI18next();
  const icons = generateIconGroup(language);
  const rows = splitArrayIntoChunks(icons);
  return (
    <Box>
      {rows.map((row, index) => (
        <Stack
          key={`${language}-${index}`}
          direction="row"
          spacing={2}
          color={theme.palette.website.m4}
          sx={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
        >
          {row.map((icon: any) => (
            <IconButton
              key={icon.name}
              aria-label={icon.name}
              href={icon.href}
              target="_blank"
              color="inherit"
            >
              <icon.icon />
            </IconButton>
          ))}
        </Stack>
      ))}
    </Box>
  );
};

const FooterItems = () => {
  const theme = useTheme();
  const { language } = useI18next();
  const rows = generateFooterItems(language);
  return (
    <>
      {rows.map((row) => (
        <Stack key={row.name} sx={{ gap: "0.75rem" }}>
          <Typography color="#7E7F86" component="div">
            {row.name}
          </Typography>
          {row.items.map((item) => (
            <LinkComponent
              key={`${row.name}-${item.name}`}
              to={item.url}
              sx={{ width: "fit-content" }}
            >
              <Typography color={theme.palette.website.m4} component="div">
                {item.name}
              </Typography>
            </LinkComponent>
          ))}
        </Stack>
      ))}
    </>
  );
};
