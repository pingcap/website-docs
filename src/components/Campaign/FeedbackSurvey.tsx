import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CampaignOutlined,
  CloseOutlined,
  EastOutlined,
} from "@mui/icons-material";
import { useLocation } from "@reach/router";
import { useI18next } from "gatsby-plugin-react-i18next";
import { useEffect, useState } from "react";

type SurveyStorage = {
  disabled?: boolean;
  updatedTime?: number;
  path?: string;
};

function useDisclosure(cacheDuration: number = 0) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const storageKey = "docs.campaign.survey.v1";
  const close = () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        disabled: true,
        updatedTime: Date.now(),
        path: location.pathname,
      })
    );

    setVisible(false);
  };

  useEffect(() => {
    const strValue = localStorage.getItem(storageKey);
    const data: SurveyStorage = JSON.parse(strValue || "{}");
    const cachedVisible =
      (data.updatedTime || 0) < Date.now() - cacheDuration
        ? true
        : !data.disabled;

    setVisible(cachedVisible);
  }, []);

  return [visible, close] as const;
}

export function FeedbackSurveyCampaign() {
  const theme = useTheme();
  const { t } = useI18next();
  const [visible, close] = useDisclosure(120 * 60 * 1000);

  if (!visible) {
    return null;
  }

  return (
    <Box
      sx={{
        bgcolor: "website.m1",
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Card
        component="a"
        href={t("campaign.docSurvey.link")}
        target="_blank"
        variant="outlined"
        sx={{
          display: "block",
          width: "15rem",
          borderColor: "website.k1",
          background:
            "radial-gradient(181.14% 96.64% at 101.72% 103.13%, rgba(211, 97, 230, 0.50) 0%, rgba(16, 190, 235, 0.17) 39.41%, rgba(255, 255, 255, 0.00) 100%)",
          boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.04)",
          textDecoration: "none",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{
                width: "18px",
                height: "18px",
                background:
                  "linear-gradient(135deg, #0FC7C7, #00AEEF, #CA5AF0)",
              }}
              aria-label="Docs Survey Campaign"
            >
              <CampaignOutlined sx={{ width: 14, height: 14 }} />
            </Avatar>
          }
          action={
            <IconButton
              aria-label="close"
              size="small"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                close();
              }}
            >
              <CloseOutlined fontSize="inherit" />
            </IconButton>
          }
          title={t("campaign.docSurvey.title")}
          titleTypographyProps={{
            sx: {
              fontSize: 14,
              fontWeight: 600,
              background: "linear-gradient(90deg, #9A3CBB, #284DAB, #2D9BB7)",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            },
          }}
          sx={{
            "& > .MuiCardHeader-avatar": {
              mr: "8px",
            },
          }}
        />
        <CardContent sx={{ pt: 0, "&:last-child": { pb: "16px" } }}>
          <Stack spacing={2}>
            <Typography variant="body2">
              {t("campaign.docSurvey.content")}
            </Typography>
            <Typography
              variant="body2"
              color="website.k1"
              fontWeight={700}
              display="flex"
              alignItems="center"
            >
              {t("campaign.docSurvey.action")}
              <EastOutlined
                fontSize="inherit"
                stroke="currentColor"
                strokeWidth="1.5"
                sx={{ ml: "4px" }}
              />
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
