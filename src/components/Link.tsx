import * as React from "react";
import { Link as GatsbyLink } from "gatsby";
import { Link as I18nLink } from "gatsby-plugin-react-i18next";
import Typography from "@mui/material/Typography";

interface LinkComponentProps {
  to?: string;
  clearCloudMode?: boolean;
  style?: { [key: string]: any };
  isI18n?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  [key: string]: any;
}

export default function LinkComponent(
  props: React.PropsWithChildren<LinkComponentProps>
) {
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

export const BlueAnchorLink = (
  props: React.PropsWithChildren<LinkComponentProps>
) => {
  return (
    <LinkComponent
      {...props}
      sx={{
        color: "secondary.main",
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline!important",
        },
        ...props.sx,
      }}
    />
  );
};
