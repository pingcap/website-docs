import { GatsbyBrowser, WrapRootElementBrowserArgs } from "gatsby";
import React from "react";
import { HelmetProvider } from "react-helmet-async";

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({
  element,
}: WrapRootElementBrowserArgs): React.ReactElement => (
  <HelmetProvider>{element}</HelmetProvider>
);
