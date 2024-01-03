import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { useI18next } from "gatsby-plugin-react-i18next";
import { CampaignOutlined } from "@mui/icons-material";

export function FeedbackSurveyCampaign() {
  const { t } = useI18next();

  return (
    <Box
      sx={{
        bgcolor: "website.m1",
        borderRadius: "8px",
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
          borderRadius: "8px",
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
                  "linear-gradient(149deg, #0FC7C7 7.88%, #00AEEF 51.72%, #CA5AF0 92.89%)",
              }}
              aria-label="Docs Survey Campaign"
            >
              <CampaignOutlined sx={{ width: 14, height: 14 }} />
            </Avatar>
          }
          title={t("campaign.docSurvey.title")}
          titleTypographyProps={{
            sx: {
              fontSize: 14,
              fontWeight: 600,
              background:
                "linear-gradient(90deg, #9A3CBB 0%, #284DAB 50.31%, #2D9BB7 100%)",
              backgroundClip: "text",
              "-webkit-text-fill-color": "transparent",
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
            <Typography variant="body2" color="website.k1" fontWeight={700}>
              {t("campaign.docSurvey.action")} -{">"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
