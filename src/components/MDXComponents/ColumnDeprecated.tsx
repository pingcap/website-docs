import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

// ! Deprecated

export function ColumnTitle(props: { children: React.ReactNode }) {
  return (
    <>
      <Typography
        component="h5"
        variant="h5"
        sx={{
          fontSize: "1.25rem",
          margin: "0 0 0.75rem 0",
          lineHeight: "1.125",
          color: "#172d72",
        }}
      >
        {props.children}
      </Typography>
    </>
  );
}

export function NavColumns(props: { children: React.ReactNode }) {
  return (
    <Grid container spacing={3}>
      {props.children}
    </Grid>
  );
}

export function NavColumn(props: { children: React.ReactNode }) {
  return <Grid xs={4}>{props.children}</Grid>;
}
