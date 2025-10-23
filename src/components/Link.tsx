import * as React from "react";
import { Link as GatsbyLink } from "gatsby";
import { Link as I18nLink } from "gatsby-plugin-react-i18next";
import Typography from "@mui/material/Typography";

import "./Link.css";

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
        {...rest}
        style={{ ...style, textDecoration: "none" }}
      />
    );
  }
  if (isI18n) {
    return (
      <I18nLink
        to={to}
        {...rest}
        style={{ ...style, textDecoration: "none" }}
      />
    );
  }
  return (
    <GatsbyLink
      to={to}
      {...rest}
      style={{ ...style, textDecoration: "none" }}
    />
  );
}

export const BlueAnchorLink = (
  props: React.PropsWithChildren<LinkComponentProps>
) => {
  return (
    <LinkComponent
      {...props}
      className="blue-anchor-link"
      style={{
        color: "var(--tiui-palette-secondary)",
        fontSize: "14px",
        padding: "0 3px",
        ...props.style,
      }}
    />
  );
};
