import * as React from "react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import { Link } from "@mui/material";

import { PingcapLogoFooterIcon } from "components/Icons";
import LinkComponent from "components/Link";
import {
  splitArrayIntoChunks,
  generateIconGroup,
  generateFooterItems,
  generatePrivacyPolicy,
  generateLegalUrl,
} from "shared/utils";
import { GTMEvent, gtmTrack } from "shared/utils/gtm";

const FOOTER_TITLE_COLOR = "#646F72";

export default function Footer() {
  return (
    <>
      <Box sx={{ bgcolor: "#000" }} component="footer">
        <Box maxWidth="xl" sx={{ padding: "30px 64px", margin: "0 auto" }}>
          <FooterBlock />
          <Stack
            direction="row"
            spacing="12px"
            sx={{ paddingTop: "66px" }}
            divider={
              <Typography variant="body2" component="div">
                /
              </Typography>
            }
          >
            <Typography
              variant="body2"
              component="div"
              color="#646F72"
              sx={{
                textAlign: {
                  xs: "center",
                  md: "left",
                },
              }}
            >
              © {new Date().getFullYear()} TiDB. All Rights Reserved.
            </Typography>
            <PrivacyPolicy />
            <Legal />
          </Stack>
        </Box>
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
        <FooterItems />
        <Stack
          sx={{
            gap: "48px",
            display: {
              xs: "none",
              md: "flex",
            },
          }}
        >
          <Typography color={FOOTER_TITLE_COLOR} component="div">
            STAY CONNECTED
          </Typography>
          <IconGroup />
        </Stack>
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
              onClick={() =>
                gtmTrack(GTMEvent.ClickFooter, {
                  item_name: icon.name,
                })
              }
            >
              <icon.icon />
            </IconButton>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

const PrivacyPolicy = () => {
  const { language } = useI18next();
  const url = generatePrivacyPolicy(language);
  return (
    <>
      <Link
        href={url}
        variant="body2"
        color="#646F72"
        sx={{
          marginLeft: ".2rem",
          textAlign: {
            xs: "center",
            md: "left",
          },
          textDecoration: "none",
        }}
        target="_blank"
      >
        Privacy Policy
      </Link>
    </>
  );
};
const Legal = () => {
  const { language } = useI18next();
  const url = generateLegalUrl(language);
  return (
    <>
      <Link
        href={url}
        variant="body2"
        color="#646F72"
        sx={{
          marginLeft: ".2rem",
          textAlign: {
            xs: "center",
            md: "left",
          },
          textDecoration: "none",
        }}
        target="_blank"
      >
        Legal
      </Link>
    </>
  );
};

const FooterItems = () => {
  const theme = useTheme();
  const { language } = useI18next();
  const rows = generateFooterItems(language);
  return (
    <>
      {rows.map((row) => (
        <Stack key={row.name} sx={{ gap: "48px" }}>
          <Typography color={FOOTER_TITLE_COLOR} component="div">
            {row.name.toUpperCase()}
          </Typography>
          <Stack sx={{ gap: "16px", minWidth: "6.75rem" }}>
            {row.items.map((item) => (
              <LinkComponent
                key={`${row.name}-${item.name}`}
                to={item.url}
                isI18n
                sx={{ width: "fit-content" }}
                onClick={() =>
                  gtmTrack(GTMEvent.ClickFooter, {
                    item_name: item.name,
                  })
                }
              >
                <Typography color="#fff" component="div">
                  {item.name}
                </Typography>
              </LinkComponent>
            ))}
          </Stack>
        </Stack>
      ))}
    </>
  );
};
