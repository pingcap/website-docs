import * as React from "react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import HubspotForm from "react-hubspot-form";
import { trackCustomEvent } from "gatsby-plugin-google-analytics";
import clsx from "clsx";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Tooltip from "@mui/material/Tooltip";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";

import { Locale } from "shared/interface";
import { feedbackForm } from "./FeedbackBtn.module.css";

export default function FeedbackBtn(props: { title: string; locale: Locale }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "feedback-popover" : undefined;

  return (
    <>
      <Tooltip placement="left" title={<Trans i18nKey="fab.goToFeedback" />}>
        <Fab
          aria-describedby={id}
          size="small"
          aria-label="feedback"
          disableRipple
          variant="extended"
          sx={{
            display: "flex",
            color: "website.f2",
            backgroundColor: "#eff4f7",
            borderRadius: "0.5rem",
            height: "2rem",
            width: "2rem",
            boxShadow: "none",
            "&:hover": {
              color: "website.m1",
              backgroundColor: "website.k1",
            },
          }}
          onClick={handleClick}
        >
          <RateReviewIcon />
        </Fab>
      </Tooltip>
      <FeedbackPopover
        key={`${props.title}-${props.locale}`}
        title={props.title}
        locale={props.locale}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </>
  );
}

function FeedbackPopover(props: {
  title: string;
  locale: Locale;
  id?: string;
  open: boolean;
  // anchorEl?: PopoverProps["anchorEl"];
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
}) {
  const { title, locale, id, open, anchorEl, onClose } = props;

  const [showThumb, setShowThumb] = React.useState(true);
  const [isHelpful, setIsHelpful] = React.useState<"yes" | "no" | undefined>();
  const [showForm, setShowForm] = React.useState(false);

  const { t } = useI18next();

  const setDocHelpful = (helpful: boolean) => () => {
    trackCustomEvent({
      category: helpful ? `doc-${locale}-useful` : `doc-${locale}-useless`,
      action: "click",
      label: title,
      transport: "beacon",
    });

    setIsHelpful(helpful ? "yes" : "no");
    setShowForm(true);
    setShowThumb(false);
  };

  return (
    <>
      <Box
        sx={{
          width: "14.5rem",
          position: "absolute",
          bottom: "2.5rem",
          right: "0.5rem",
          borderRadius: "0.25rem",
          display: open ? "block" : "none",
        }}
      >
        <Box
          sx={{
            height: "2.625rem",
            width: "100%",
            display: "flex",
            alignItems: "center",
            backgroundColor: "website.m5",
            borderRadius: "0.25rem 0.25rem 0 0",
          }}
        >
          <Typography
            variant="body1"
            component="span"
            sx={{
              padding: "0 1rem",
              color: "website.m1",
            }}
          >
            <Trans i18nKey="docHelpful.header" />
          </Typography>
          <IconButton aria-label="close" onClick={onClose} size="small">
            <CloseIcon
              fontSize="inherit"
              sx={{
                color: "website.m1",
              }}
            />
          </IconButton>
        </Box>
        <Box
          sx={{
            backgroundColor: "#F7F8F9",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 20rem)",
            overflowY: "auto",
          }}
          className={clsx(feedbackForm)}
        >
          {showThumb && (
            <Stack direction="row" justifyContent="space-evenly">
              <IconButton
                aria-label="Thumb Up"
                onClick={setDocHelpful(true)}
                className="FeedbackBtn-thumbUp"
              >
                <ThumbUpIcon />
              </IconButton>
              <IconButton
                aria-label="Thumb Down"
                onClick={setDocHelpful(false)}
                className="FeedbackBtn-thumbDown"
              >
                <ThumbDownIcon />
              </IconButton>
            </Stack>
          )}
          {showForm && (
            <HubspotForm
              portalId="4466002"
              formId={`${
                isHelpful === "yes"
                  ? locale === "en"
                    ? "c955b3db-740a-4f96-9d2b-011e2cd80ad6"
                    : "caf4026d-e3a0-4285-8f80-fcdee324f50d"
                  : locale === "en"
                  ? "3c501775-c64d-4a9e-898b-7efef630bbf4"
                  : "4bf44ac7-4104-4eca-a57c-4dd9e5cc87b9"
              }`}
              loading={<Skeleton />}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
