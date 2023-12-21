import * as React from "react";

import { MdxContext } from "context/MdxContext";
import { Link } from "gatsby-plugin-react-i18next";
import { Locale } from "static/Type";

export function MDLink(props: {
    url: string;
    children?: any;
  }) {
    const mdxContextData = React.useContext(MdxContext);
    const { pathConfig } = mdxContextData;
    const {url} = props;
    const localeURL = pathConfig.locale === Locale.en ? "" : "/" + pathConfig.locale;
    const relativeURL = url.startsWith("/") ? url : "/" + url;
    const realURL = localeURL + "/" + pathConfig.repo + "/" + pathConfig.version + relativeURL;

    return (
        <Link to={realURL}>{props.children}</Link>
    )
}