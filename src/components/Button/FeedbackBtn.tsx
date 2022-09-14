import * as React from "react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import Popover, { PopoverProps } from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Tooltip from "@mui/material/Tooltip";

export default function FeedbackBtn() {
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
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </>
  );
}

function FeedbackPopover(props: {
  id?: string;
  open: boolean;
  anchorEl?: PopoverProps["anchorEl"];
  onClose?: PopoverProps["onClose"];
}) {
  const { id, open, anchorEl, onClose } = props;
  const { t } = useI18next();
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      marginThreshold={56}
    >
      <Box
        sx={{
          width: "13.5rem",
        }}
      >
        <Box
          sx={{
            height: "2.625rem",
            width: "100%",
            display: "flex",
            alignItems: "center",
            backgroundColor: "website.m5",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              padding: "0 1rem",
              color: "website.m1",
            }}
          >
            <Trans i18nKey="docHelpful.header" />
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#F7F8F9",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="body2">
            <Trans i18nKey="docHelpful.issueTitle" />
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={
                <Typography variant="body2">
                  <Trans i18nKey="docHelpful.contentError" />
                </Typography>
              }
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={
                <Typography variant="body2">
                  <Trans i18nKey="docHelpful.contentAmbiguity" />
                </Typography>
              }
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={
                <Typography variant="body2">
                  <Trans i18nKey="docHelpful.contentTypo" />
                </Typography>
              }
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={
                <Typography variant="body2">
                  <Trans i18nKey="docHelpful.brokenLink" />
                </Typography>
              }
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={
                <Typography variant="body2">
                  <Trans i18nKey="docHelpful.wrongDoc" />
                </Typography>
              }
            />
          </FormGroup>
          <Typography variant="body2" sx={{ marginTop: "1rem" }}>
            <Trans i18nKey="docHelpful.improveTitle" />
          </Typography>
          <TextField
            size="small"
            id="outlined-multiline-static"
            multiline
            rows={4}
            sx={{
              marginTop: "0.5rem",
              marginBottom: "1rem",
            }}
          />
          <Typography variant="body2">
            <Trans i18nKey="docHelpful.contactTitle" />
          </Typography>
          <TextField
            size="small"
            placeholder={t("docHelpful.emailAddr")}
            sx={{
              marginTop: "0.5rem",
              marginBottom: "1rem",
            }}
          />
          <Button
            size="small"
            disableRipple
            variant="contained"
            sx={{
              with: "11.5rem",
            }}
          >
            <Trans i18nKey="docHelpful.submit" />
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}
