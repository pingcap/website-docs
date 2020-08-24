import { graphql, useStaticQuery } from 'gatsby'

import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import React from 'react'

function SEO({ lang, title, description, meta, link }) {
  const { site, favicon } = useStaticQuery(
    graphql`
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
    `
  )

  const openGraph = 'https://download.pingcap.com/images/pingcap-opengraph.jpg'

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
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:image',
          content: openGraph,
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
      ].concat(meta)}
      link={[
        {
          href: favicon.publicURL,
          rel: 'shortcut icon',
          type: 'image/x-icon',
        },
        { link },
      ].concat(link)}
    />
  )
}

SEO.defaultProps = {
  lang: 'en',
  description: '',
  meta: [],
  link: [],
}

SEO.propTypes = {
  lang: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  link: PropTypes.arrayOf(PropTypes.object),
}

export default SEO
