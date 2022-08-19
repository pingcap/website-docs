import * as React from "react";
// import { Link } from "gatsby";
import { Link } from "gatsby-plugin-react-i18next";
import Typography from "@mui/material/Typography";

export default function LinkComponent(props: {
  to: string;
  style?: { [key: string]: any };
  [key: string]: any;
}) {
  const { to, style, ...rest } = props;
  const isExternal = props.to.startsWith("http");
  if (isExternal) {
    return (
      <Typography
        component="a"
        target="_blank"
        href={to}
        style={{ textDecoration: "none", ...style }}
        {...rest}
      />
    );
  }
  return (
    <Link
      to={props.to}
      style={{ textDecoration: "none", ...style }}
      {...rest}
    />
  );
}
