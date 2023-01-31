import * as React from "react";
import { Trans } from "gatsby-plugin-react-i18next";
import Alert, { AlertColor } from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";

import AttachmentIcon from "@mui/icons-material/Attachment";

function AlertContainer(props: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        "& .MuiAlert-message p": {
          marginBottom: 0,
          marginTop: 0,
        },
      }}
    >
      {props.children}
    </Box>
  );
}

export function Tip(props: { children: React.ReactNode }) {
  return (
    <AlertContainer>
      <Alert severity="success" icon={<AttachmentIcon />}>
        <AlertTitle>
          <Trans i18nKey="shortcodes.tip" />
        </AlertTitle>
        {props.children}
      </Alert>
    </AlertContainer>
  );
}

export function Note(props: { children: React.ReactNode }) {
  return (
    <AlertContainer>
      <Alert severity="info">
        <AlertTitle>
          <Trans i18nKey="shortcodes.note" />
        </AlertTitle>
        {props.children}
      </Alert>
    </AlertContainer>
  );
}

export function Important(props: { children: React.ReactNode }) {
  return (
    <AlertContainer>
      <Alert severity="info">
        <AlertTitle>
          <Trans i18nKey="shortcodes.important" />
        </AlertTitle>
        {props.children}
      </Alert>
    </AlertContainer>
  );
}

export function Warning(props: { children: React.ReactNode }) {
  return (
    <AlertContainer>
      <Alert severity="error">
        <AlertTitle>
          <Trans i18nKey="shortcodes.warning" />
        </AlertTitle>
        {props.children}
      </Alert>
    </AlertContainer>
  );
}

export function CustomAlert(props: {
  severity: AlertColor;
  title: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AlertContainer>
      <Alert severity={props.severity}>
        <AlertTitle>{props.title}</AlertTitle>
        {props.children}
      </Alert>
    </AlertContainer>
  );
}
