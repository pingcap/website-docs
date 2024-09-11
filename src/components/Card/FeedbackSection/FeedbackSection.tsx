import { Trans } from "gatsby-plugin-react-i18next";
import {
  Box,
  Stack,
  Typography,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { ThumbUpOutlined, ThumbDownOutlined } from "@mui/icons-material";
import { Locale } from "shared/interface";
import { useState } from "react";
import { trackCustomEvent } from "gatsby-plugin-google-analytics";
import { submitFeedbackDetail, submitLiteFeedback } from "./tracking";
import { FeedbackCategory } from "./types";
import {
  ActionButton,
  controlLabelSx,
  labelProps,
  radioSx,
} from "./components";

interface FeedbackSectionProps {
  title: string;
  locale: Locale;
}

export function FeedbackSection({ title, locale }: FeedbackSectionProps) {
  const [thumbVisible, setThumbVisible] = useState(true);
  const [helpful, setHelpful] = useState<boolean>();
  const [surveyVisible, setSurverVisible] = useState(false);

  const onThumbClick = (helpful: boolean) => {
    trackCustomEvent({
      category: helpful ? `doc-${locale}-useful` : `doc-${locale}-useless`,
      action: "click",
      label: title,
      transport: "beacon",
    });
    submitLiteFeedback({
      locale,
      category: helpful ? FeedbackCategory.Positive : FeedbackCategory.Negative,
    });

    setHelpful(helpful);
    setThumbVisible(false);
    setSurverVisible(true);
  };

  const [positiveVal, setPositiveVal] = useState<string>("");
  const onPositiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPositiveVal((event.target as HTMLInputElement).value);
  };

  const [negativeVal, setNegativeVal] = useState<string>("");
  const onNegativeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNegativeVal((event.target as HTMLInputElement).value);
  };

  const [submitted, setSubmitted] = useState(false);

  const onPositiveSubmit = () => {
    submitFeedbackDetail({
      locale,
      category: FeedbackCategory.Positive,
      reason: positiveVal,
    });
    setSurverVisible(false);
    setSubmitted(true);
  };
  const onNegativeSubmit = () => {
    submitFeedbackDetail({
      locale,
      category: FeedbackCategory.Negative,
      reason: negativeVal,
    });
    setSurverVisible(false);
    setSubmitted(true);
  };

  const onSkip = () => {
    setSurverVisible(false);
    setPositiveVal("");
    setNegativeVal("");
    setSubmitted(true);
  };

  return (
    <Box>
      <Typography
        variant="h2"
        sx={{
          color: "text.primary",
          fontSize: "1.5rem",
          fontWeight: 500,
          lineHeight: 1.25,
          marginTop: "24px",
          marginBottom: "16px",
          paddingBottom: "0.3em",
          borderBottom: "1px solid #d8dee4",
        }}
      >
        <Trans i18nKey="docHelpful.header" />
      </Typography>
      {thumbVisible && (
        <Stack direction="row" spacing={2} mb="48px">
          <ActionButton
            variant="outlined"
            size="small"
            startIcon={<ThumbUpOutlined sx={{ width: 14, height: 14 }} />}
            className="FeedbackBtn-thumbUp"
            aria-label="Thumb Up"
            onClick={() => onThumbClick(true)}
          >
            <Trans i18nKey="docHelpful.thumbUp" />
          </ActionButton>
          <ActionButton
            variant="outlined"
            size="small"
            startIcon={<ThumbDownOutlined sx={{ width: 14, height: 14 }} />}
            className="FeedbackBtn-thumbDown"
            aria-label="Thumb Down"
            onClick={() => onThumbClick(false)}
          >
            <Trans i18nKey="docHelpful.thumbDown" />
          </ActionButton>
        </Stack>
      )}
      {surveyVisible && helpful && (
        <Box>
          <FormControl>
            <Typography variant="body1" color="website.f1" fontWeight={500}>
              <Trans i18nKey="docFeedbackSurvey.positive.title" />
            </Typography>
            <RadioGroup
              aria-labelledby="doc-positive-feedback-survey"
              name="doc-positive-feedback-survey-radio-group"
              value={positiveVal}
              onChange={onPositiveChange}
              sx={{ my: "6px" }}
            >
              <FormControlLabel
                value="easy"
                label={<Trans i18nKey="docFeedbackSurvey.positive.easy" />}
                control={<Radio size="small" sx={radioSx} />}
                componentsProps={labelProps}
                sx={controlLabelSx}
              />
              <FormControlLabel
                value="solvedProblem"
                label={
                  <Trans i18nKey="docFeedbackSurvey.positive.solvedProblem" />
                }
                control={<Radio size="small" sx={radioSx} />}
                componentsProps={labelProps}
                sx={controlLabelSx}
              />
              <FormControlLabel
                value="helpToDecide"
                label={
                  <Trans i18nKey="docFeedbackSurvey.positive.helpToDecide" />
                }
                control={<Radio size="small" sx={radioSx} />}
                componentsProps={labelProps}
                sx={controlLabelSx}
              />
              <FormControlLabel
                value="other"
                label={<Trans i18nKey="docFeedbackSurvey.positive.other" />}
                control={<Radio size="small" sx={radioSx} />}
                componentsProps={labelProps}
                sx={controlLabelSx}
              />
            </RadioGroup>
          </FormControl>
          <Stack direction="row" spacing={2} mt="12px" mb="24px">
            <ActionButton
              variant="outlined"
              size="small"
              disabled={!positiveVal}
              onClick={onPositiveSubmit}
            >
              <Trans i18nKey="docFeedbackSurvey.action.submit" />
            </ActionButton>
            <ActionButton variant="outlined" size="small" onClick={onSkip}>
              <Trans i18nKey="docFeedbackSurvey.action.skip" />
            </ActionButton>
          </Stack>
        </Box>
      )}
      {surveyVisible && !helpful && (
        <Box>
          <FormControl>
            <Typography variant="body1" color="website.f1" fontWeight={500}>
              <Trans i18nKey="docFeedbackSurvey.negative.title" />
            </Typography>
            <RadioGroup
              aria-labelledby="doc-negative-feedback-survey"
              name="doc-negative-feedback-survey-radio-group"
              value={negativeVal}
              onChange={onNegativeChange}
              sx={{ my: "6px" }}
            >
              <FormControlLabel
                value="hard"
                label={<Trans i18nKey="docFeedbackSurvey.negative.hard" />}
                control={<Radio size="small" sx={radioSx} />}
                componentsProps={labelProps}
                sx={controlLabelSx}
              />
              <FormControlLabel
                value="nothingFound"
                label={
                  <Trans i18nKey="docFeedbackSurvey.negative.nothingFound" />
                }
                control={<Radio size="small" sx={radioSx} />}
                componentsProps={labelProps}
                sx={controlLabelSx}
              />
              <FormControlLabel
                value="inaccurate"
                label={
                  <Trans i18nKey="docFeedbackSurvey.negative.inaccurate" />
                }
                control={<Radio size="small" sx={radioSx} />}
                componentsProps={labelProps}
                sx={controlLabelSx}
              />
              <FormControlLabel
                value="sampleError"
                label={
                  <Trans i18nKey="docFeedbackSurvey.negative.sampleError" />
                }
                control={<Radio size="small" sx={radioSx} />}
                componentsProps={labelProps}
                sx={controlLabelSx}
              />
              <FormControlLabel
                value="other"
                label={<Trans i18nKey="docFeedbackSurvey.negative.other" />}
                control={<Radio size="small" sx={radioSx} />}
                componentsProps={labelProps}
                sx={controlLabelSx}
              />
            </RadioGroup>
          </FormControl>
          <Stack direction="row" spacing={2} mt="12px" mb="24px">
            <ActionButton
              variant="outlined"
              size="small"
              disabled={!negativeVal}
              onClick={onNegativeSubmit}
            >
              <Trans i18nKey="docFeedbackSurvey.action.submit" />
            </ActionButton>
            <ActionButton variant="outlined" size="small" onClick={onSkip}>
              <Trans i18nKey="docFeedbackSurvey.action.skip" />
            </ActionButton>
          </Stack>
        </Box>
      )}
      {submitted && (
        <Typography
          variant="body1"
          color="website.f1"
          fontWeight={500}
          mb="48px"
        >
          <Trans i18nKey="docFeedbackSurvey.message.thank" />
        </Typography>
      )}
    </Box>
  );
}
