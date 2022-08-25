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
      <Box sx={{ bgcolor: "#20222B", padding: "3.5rem 0" }} component="footer">
        <Container maxWidth="lg">
          <FooterBlock />
          <Typography
            variant="body2"
            component="div"
            color="rgba(255, 255, 255, 0.5)"
            sx={{
              paddingTop: "3rem",
              textAlign: {
                xs: "center",
                md: "left",
              },
            }}
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
    <>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          flexWrap: {
            xs: "wrap",
            md: "nowrap",
          },
          rowGap: "4rem",
        }}
      >
        <Stack
          sx={{
            gap: "2rem",
            display: {
              xs: "none",
              md: "flex",
            },
          }}
        >
          <PingcapLogoFooterIcon
            sx={{ width: "6.125rem", height: "1.625rem" }}
          />
          <IconGroup />
        </Stack>
        <FooterItems />
      </Stack>
      <Stack
        alignItems="center"
        sx={{
          paddingTop: "4.5rem",
          gap: "2.5rem",
          display: {
            md: "none",
          },
        }}
      >
        <IconGroup />
        <PingcapLogoFooterIcon sx={{ width: "6.125rem", height: "1.625rem" }} />
      </Stack>
    </>
  );
};

const IconGroup = () => {
  const theme = useTheme();
  const { language } = useI18next();
  const icons = generateIconGroup(language);
  const rows = splitArrayIntoChunks(icons);
  return (
    <Stack
      sx={{
        flexDirection: {
          xs: "row",
          md: "column",
        },
        gap: {
          xs: "1rem",
          md: "0",
        },
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
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
    </Stack>
  );
};

const FooterItems = () => {
  const theme = useTheme();
  const { language } = useI18next();
  const rows = generateFooterItems(language);
  return (
    <>
      {rows.map((row) => (
        <Stack key={row.name} sx={{ gap: "0.75rem", minWidth: "6.75rem" }}>
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
