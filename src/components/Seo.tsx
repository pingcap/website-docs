import '@mdi/font/css/materialdesignicons.min.css'
import { graphql, useStaticQuery } from 'gatsby'

import { Helmet } from 'react-helmet-async'

interface Props {
  lang?: string
  title: string
  description?: string
  meta?: Record<string, unknown>[]
  link?: Record<string, unknown>[]
}

export function Seo({
  lang = 'en',
  title,
  description = '',
  meta = [],
  link = [],
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
      favicon: file(relativePath: { eq: "pingcap-logo.ico" }) {
        publicURL
      }
    }
  `)

  const metaDescription = description || site.siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:image',
          content: 'https://download.pingcap.com/images/pingcap-opengraph.jpg',
        },
        {
          property: 'og:image:width',
          content: '400',
        },
        {
          property: 'og:image:height',
          content: '400',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:creator',
          content: site.siteMetadata.author,
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
        ...meta,
      ]}
      link={[
        {
          rel: 'shortcut icon',
          href: favicon.publicURL,
          type: 'image/x-icon',
        },
        ...link,
      ]}
    />
  )
}
