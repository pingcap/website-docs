import {
  Box,
  Card,
  CardActionArea,
  Stack,
  Typography,
} from "@mui/material";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import { TargetLink } from "components/MDXComponents/Link";
import CalendarIcon from "media/icons/calendar.svg";
import ClockIcon from "media/icons/clock.svg";
import UserIcon from "media/icons/user.svg";

const BADGE_COLORS = {
  blog: { bg: "#E0F0F8", text: "#1480B8" },
  lab: { bg: "#E8E7F9", text: "#4A40BF" },
  video: { bg: "#FBE7E7", text: "#BF404B" },
} as const;

const isExternal = (url: string) => url.startsWith("http");

const parseDateOnly = (date: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) {
    return undefined;
  }

  const [, year, month, day] = match;

  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
};

interface MetaRowProps {
  author?: string;
  formattedDate?: string;
  duration?: string;
}

function MetaRow({ author, formattedDate, duration }: MetaRowProps) {
  const items = [
    author && (
      <Stack key="author" direction="row" spacing={0.5} alignItems="center">
        <UserIcon width="14px" height="14px" aria-hidden="true" />
        <Typography component="span" variant="body2" color="text.secondary" sx={{ fontSize: "14px" }}>
          {author}
        </Typography>
      </Stack>
    ),
    formattedDate && (
      <Stack key="date" direction="row" spacing={0.5} alignItems="center">
        <CalendarIcon width="14px" height="14px" aria-hidden="true" />
        <Typography component="span" variant="body2" color="text.secondary" sx={{ fontSize: "14px" }}>
          {formattedDate}
        </Typography>
      </Stack>
    ),
    duration && (
      <Stack key="duration" direction="row" spacing={0.5} alignItems="center">
        <ClockIcon width="14px" height="14px" aria-hidden="true" />
        <Typography component="span" variant="body2" color="text.secondary" sx={{ fontSize: "14px" }}>
          {duration}
        </Typography>
      </Stack>
    ),
  ].filter(Boolean);

  if (items.length === 0) {
    return null;
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      alignItems={{ xs: "flex-start", sm: "center" }}
    >
      {items.flatMap((item, i) =>
        i === 0
          ? [item]
          : [
              <Box
                key={`sep-${i}`}
                sx={{
                  width: "1px",
                  height: "14px",
                  bgcolor: "divider",
                  flexShrink: 0,
                  display: { xs: "none", sm: "block" },
                }}
              />,
              item,
            ]
      )}
    </Stack>
  );
}

interface ResourceCardProps {
  /** Card title */
  title: string;
  /** Resource type — controls badge label and color */
  type: "blog" | "video" | "lab";
  /** Destination URL; external links (http…) open in a new tab */
  link: string;
  /**
   * Thumbnail image CDN URL, e.g.
   * "https://docs-download.pingcap.com/media/blog-cover.png"
   */
  imgSrc: string;
  /** Author display name */
  author?: string;
  /**
   * Publication date in ISO 8601 format (YYYY-MM-DD), e.g. "2025-12-12".
   * Formatted automatically per locale: en → "December 12, 2025", zh → "2025年12月12日".
   */
  date?: string;
  /** Estimated reading / watch time, e.g. "120 mins" */
  duration?: string;
}

export function ResourceCard({
  title,
  type,
  link,
  imgSrc,
  author,
  date,
  duration,
}: ResourceCardProps) {
  const { language } = useI18next();
  const safeType = BADGE_COLORS[type] ? type : "blog";
  const colors = BADGE_COLORS[safeType];
  const parsedDate = date ? parseDateOnly(date) : undefined;

  const formattedDate = parsedDate
    ? new Intl.DateTimeFormat(language, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(parsedDate)
    : undefined;

  const external = isExternal(link);
  const linkProps = external
    ? ({
        component: "a" as const,
        href: link,
        target: "_blank",
        rel: "noopener noreferrer",
      } as const)
    : ({ component: TargetLink, to: link } as const);

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 0,
        borderColor: theme.palette.carbon[400],
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease-in-out",
        minHeight: {
          xs: "auto",
          sm: "126px",
        },
        "&:hover": {
          background:
            "linear-gradient(120.16deg, #FFFFFF 63.62%, #FBFDFD 74.22%, #F5F8FA 98.17%)",
          borderColor: theme.palette.secondary.main,
          boxShadow: "0px 1px 5px 0px rgba(76, 81, 83, 0.1)",
        },
        "> a.MuiCardActionArea-root:hover": { textDecoration: "none" },
      })}
    >
      <CardActionArea
        {...linkProps}
        disableRipple
        disableTouchRipple
        draggable="false"
        style={{ display: "block", width: "100%" }}
        sx={(theme) => ({
          flex: 1,
          outline: "none",
          "&.Mui-focusVisible": {
            outline: `2px solid ${theme.palette.carbon[700]}`,
            outlineOffset: "-2px",
          },
          "> .MuiCardActionArea-focusHighlight": { display: "none" },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            padding: "8px",
            gap: {
              xs: 2,
              sm: 3,
            },
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
          }}
        >
          {/* Thumbnail */}
          <Box
            component="img"
            src={imgSrc}
            alt=""
            loading="lazy"
            style={{ margin: 0 }}
            sx={{
              flexShrink: 0,
              display: "block",
              width: {
                xs: "100%",
                sm: "224px",
              },
              height: {
                xs: "180px",
                sm: "110px",
              },
              objectFit: "cover",
              objectPosition: "left center",
            }}
          />

          {/* Content column */}
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}
          >
            {/* Row 1: title + type badge */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "minmax(0, 1fr) auto",
                },
                alignItems: {
                  xs: "start",
                  sm: "end",
                },
                columnGap: "16px",
                rowGap: {
                  xs: 1,
                  sm: 0,
                },
                width: {
                  xs: "100%",
                  sm: "fit-content",
                },
                maxWidth: "100%",
                minWidth: 0,
              }}
            >
              <Typography
                component="div"
                variant="h5"
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: {
                    xs: "normal",
                    sm: "nowrap",
                  },
                }}
              >
                {title}
              </Typography>
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifySelf: "start",
                  height: "28px",
                  padding: "0 12px",
                  borderRadius: "999px",
                  backgroundColor: colors.bg,
                  color: colors.text,
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "16px",
                }}
              >
                <Trans i18nKey={`resourceCard.type.${safeType}`} />
              </Box>
            </Box>

            {/* Row 2: author / date / duration — only rendered items, separators between adjacent pairs */}
            <MetaRow author={author} formattedDate={formattedDate} duration={duration} />

            {/* Row 3: "Learn More ↗" — visual affordance; card itself is the link */}
            <Typography
              component="div"
              sx={(theme) => ({
                color: theme.palette.secondary.light,
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "20px",
                padding: "4px 0",
              })}
            >
              <Trans i18nKey="resourceCard.learnMore" />
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
