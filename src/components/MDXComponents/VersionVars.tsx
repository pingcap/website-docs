import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Card, CardContent, Chip } from '@mui/material';

type ScopeType = "SESSION" | "GLOBAL" | "BOTH";

export function VersionVars(props: {
    name: string;
    scope: ScopeType;
    type: string;
    applyHint: boolean;
    defaultValue: string;
    involveVersion?: string;
    possibleValues?: string;
    range?: string;
    unit?: string;
    children?: any;
  }) {

  const INIT_VERSION = "v0.0.1"
  const {
    name = "",
    involveVersion = INIT_VERSION,
    scope = "GLOBAL",
    type = "",
    applyHint = false,
    defaultValue = "",
    children = [],
    possibleValues = "",
    range = "",
    unit = "",
  } = props;

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div"> {name} </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          { involveVersion === INIT_VERSION ? "From the beginning" : "New in " + involveVersion }
        </Typography>
        <Stack direction="row" spacing={1}>
          {scope === "SESSION" || scope === "BOTH" ? <Chip label="SESSION" color="primary" /> : null}
          {scope === "GLOBAL" || scope === "BOTH" ? <Chip label="GLOBAL" color="success" /> : null}
        </Stack>

        <Typography> Type: {type} </Typography>
        <Typography> Applies to hint SET_VAR: {applyHint ? "Yes" : "No"} </Typography>
        <Typography> Default value: {defaultValue} </Typography>
        {range === "" ? "" : <Typography> Range: {range} </Typography>}
        {possibleValues === "" ? "" : <Typography> Possible values: {possibleValues} </Typography>}
        {unit === "" ? "" : <Typography> Unit: {unit} </Typography>}

        <Typography variant="body2">
          {...children}
        </Typography>
      </CardContent>
    </Card>
  );
}