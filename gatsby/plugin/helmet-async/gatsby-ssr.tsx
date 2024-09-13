import {
  GatsbySSR,
  PreRenderHTMLArgs,
  RenderBodyArgs,
  WrapRootElementNodeArgs,
} from "gatsby";
import React from "react";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";

const context: {
  [pathname: string]: { helmet?: HelmetServerState } | undefined,
} = {};

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  pathname,
  setHeadComponents,
  setHtmlAttributes,
  setBodyAttributes,
}: RenderBodyArgs): void => {
  const { helmet } = context[pathname] ?? {};

  if (helmet) {
    const baseComponent = helmet.base.toComponent();
    const titleComponent = helmet.title.toComponent();
    const components = [
      helmet.priority.toComponent(),
      helmet.meta.toComponent(),
      helmet.link.toComponent(),
      helmet.style.toComponent(),
      helmet.script.toComponent(),
      helmet.noscript.toComponent(),
    ];

    setHeadComponents(
      titleComponent[0]?.props.children
        ? [baseComponent, titleComponent, ...components]
        : [baseComponent, ...components]
    );

    setHtmlAttributes(helmet.htmlAttributes.toComponent());
    setBodyAttributes(helmet.bodyAttributes.toComponent());
  }
};

export const onPreRenderHTML = ({ pathname }: PreRenderHTMLArgs) => {
  context[pathname] = undefined;
};

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({
  pathname,
  element,
}: WrapRootElementNodeArgs): React.ReactElement => {
  context[pathname] = {};
  return <HelmetProvider context={context[pathname]}>{element}</HelmetProvider>;
};
