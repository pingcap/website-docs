import { useI18next } from "gatsby-plugin-react-i18next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import { Link } from "@mui/material";

import { PingcapLogoFooterIcon } from "components/Icons";
import LinkComponent from "components/Link";
import {
  generateIconGroup,
  generateFooterItems,
  generatePrivacyPolicy,
  generateLegalUrl,
} from "shared/utils";
import { GTMEvent, gtmTrack } from "shared/utils/gtm";

const FOOTER_TITLE_COLOR = "#A2ADB9";

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
              <Typography
                variant="body2"
                component="div"
                color={FOOTER_TITLE_COLOR}
                sx={{ fontFamily: "moderat mono" }}
              >
                /
              </Typography>
            }
          >
            <Typography
              variant="body2"
              component="div"
              color={FOOTER_TITLE_COLOR}
              sx={{
                fontFamily: "moderat mono",
                textAlign: {
                  xs: "center",
                  md: "left",
                },
              }}
            >
              © {new Date().getFullYear()} PingCAP. All Rights Reserved.
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
            gap: "26px",
            display: {
              xs: "none",
              md: "flex",
            },
          }}
        >
          <Typography
            sx={{ fontFamily: "moderat mono", fontSize: "15px" }}
            color={FOOTER_TITLE_COLOR}
            component="div"
          >
            Stay Connected
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
  const { language } = useI18next();
  const icons = generateIconGroup(language);
  return (
    <Stack
      sx={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {icons.map((icon) => (
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
  );
};

const PrivacyPolicy = () => {
  const { language, t } = useI18next();
  const url = generatePrivacyPolicy(language);
  return (
    <>
      <Link
        href={url}
        variant="body2"
        color={FOOTER_TITLE_COLOR}
        sx={{
          fontFamily: "moderat mono",
          marginLeft: ".2rem",
          textAlign: {
            xs: "center",
            md: "left",
          },
          textDecoration: "none",
          transition: "color 0.2s ease-in-out",
          "&:hover": { color: "#fff" },
        }}
        target="_blank"
      >
        {t("footer.privacy")}
      </Link>
    </>
  );
};

const Legal = () => {
  const { language, t } = useI18next();
  const url = generateLegalUrl(language);
  return (
    <>
      <Link
        href={url}
        variant="body2"
        color={FOOTER_TITLE_COLOR}
        sx={{
          fontFamily: "moderat mono",
          marginLeft: ".2rem",
          textAlign: {
            xs: "center",
            md: "left",
          },
          textDecoration: "none",
          transition: "color 0.2s ease-in-out",
          "&:hover": { color: "#fff" },
        }}
        target="_blank"
      >
        {t("footer.legal")}
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
        <Stack key={row.name} sx={{ gap: "26px" }}>
          <Typography
            color={FOOTER_TITLE_COLOR}
            component="div"
            sx={{ fontFamily: "moderat mono", fontSize: "15px" }}
          >
            {row.name}
          </Typography>
          <Stack sx={{ gap: "10px", minWidth: "6.75rem" }}>
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
                <Typography
                  color="#fff"
                  sx={{
                    transition: "color 0.2s ease-in-out",
                    "&:hover": { color: FOOTER_TITLE_COLOR },
                  }}
                  component="div"
                >
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
