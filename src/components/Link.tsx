import * as React from "react";
import { Link as GatsbyLink } from "gatsby";
import { Link as I18nLink } from "gatsby-plugin-react-i18next";
import Typography from "@mui/material/Typography";
import {
  CLOUD_MODE_KEY,
  CLOUD_MODE_VALUE_ESSENTIAL,
  CLOUD_MODE_VALUE_STARTER,
  useCloudMode,
} from "../shared/useCloudMode";

export default function LinkComponent(props: {
  to?: string;
  clearCloudMode?: boolean;
  style?: { [key: string]: any };
  isI18n?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  [key: string]: any;
}) {
  if (!props.to) {
    return <>{props.children}</>;
  }
  const { to, style, isI18n, ...rest } = props;
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
  if (isI18n) {
    return (
      <I18nLink
        to={to}
        style={{ textDecoration: "none", ...style }}
        {...rest}
      />
    );
  }
  return (
    <GatsbyLink
      to={to}
      style={{ textDecoration: "none", ...style }}
      {...rest}
    />
  );
}
