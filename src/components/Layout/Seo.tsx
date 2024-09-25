import { graphql, useStaticQuery } from "gatsby";

import { Helmet, type MetaProps, type LinkProps } from "react-helmet-async";
import { useI18next } from "gatsby-plugin-react-i18next";
import { Locale } from "shared/interface";

interface Props {
  noindex?: boolean;
  lang?: Locale;
  title: string;
  description?: string;
  meta?: MetaProps[];
  link?: LinkProps[];
  archived?: boolean;
}

export default function Seo({
  noindex = false,
  lang = Locale.en,
  title,
  description = "",
  meta = [],
  link = [],
  archived = false,
}: Props) {
  const { site, favicon } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
        }
      }
      favicon: file(relativePath: { eq: "favicon.ico" }) {
        publicURL
      }
    }
  `);

  const { t } = useI18next();

  const getI18nTranslation = (key: string) => {
    const translation = t(key);
    if (translation === key) {
      return undefined;
    }
    return translation;
  };

  const getI18nMetaDesc = () => {
    if (archived) {
      return getI18nTranslation("meta.archive-description");
    }
    return getI18nTranslation("meta.description");
  };

  const getI18nTitle = () => {
    if (archived) {
      return getI18nTranslation("meta.archive-title");
    }
    return getI18nTranslation("meta.title");
  };

  const metaDescription =
    description || getI18nMetaDesc() || site.siteMetadata.description;

  if (noindex) {
    meta.push({
      name: "robots",
      content: "noindex",
    });
  }

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${getI18nTitle() || site.siteMetadata.title}`}
      meta={[
        {
          name: "description",
          content: metaDescription,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: metaDescription,
        },
        {
          property: "og:image",
          content: "https://download.pingcap.com/images/pingcap-opengraph.jpg",
        },
        {
          property: "og:image:width",
          content: "400",
        },
        {
          property: "og:image:height",
          content: "400",
        },
        {
          name: "twitter:card",
          content: "summary",
        },
        {
          name: "twitter:creator",
          content: site.siteMetadata.author,
        },
        {
          name: "twitter:title",
          content: title,
        },
        {
          name: "twitter:description",
          content: metaDescription,
        },
        ...meta,
      ]}
      link={[
        {
          rel: "shortcut icon",
          href: favicon.publicURL,
          type: "image/x-icon",
        },
        ...link,
      ]}
    />
  );
}
