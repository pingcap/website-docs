import '../styles/templates/doc.scss'

import * as Shortcodes from '../components/shortcodes'

import { Block, Column, Title } from '@seagreenio/react-bulma'
import React, { useEffect } from 'react'
import replaceInternalHref, { unifyAnchor } from '../lib/replaceInternalHref'
import { setDocData, setDocInfo, setLangSwitchable } from '../state'

import DeprecationNotice from '../components/deprecationNotice'
import DownloadPDF from '../components/doc/downloadPDF'
import FeedbackDoc from '../components/doc/feedback'
import { FormattedMessage } from 'gatsby-plugin-react-intl'
import GitCommitInfo from '../components/gitCommitInfo'
import ImproveDoc from '../components/doc/improve'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Seo from '../components/seo'
import UserFeedback from '../components/userFeedback'
import { graphql } from 'gatsby'
import optimizeBlockquote from '../lib/optimizeBlockquote'
import { useDispatch } from 'react-redux'
import { useLocation } from '@reach/router'

const Doc = ({
  pageContext: {
    name,
    repo,
    ref,
    lang,
    docVersionStable,
    langSwitchable,
    downloadURL,
    pathWithoutVersion,
    versions,
  },
  data,
}) => {
  const { site, mdx, toc } = data
  const { frontmatter, tableOfContents } = mdx
  const docVersionStableMap = JSON.parse(docVersionStable)
  const { doc, version, stable } = docVersionStableMap

  const repoInfo = {
    repo,
    ref,
    pathWithoutVersion,
  }

  const location = useLocation()
  const { pathname } = location

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setDocData({ toc }))
  }, [dispatch, toc])

  useEffect(() => {
    dispatch(setLangSwitchable(langSwitchable))

    // TODO: remove
    optimizeBlockquote()

    return () => dispatch(setLangSwitchable(true))
  }, [dispatch, langSwitchable])

  useEffect(() => {
    replaceInternalHref(lang, doc, version)

    dispatch(
      setDocInfo({
        lang: lang,
        type: doc,
        version: version,
      })
    )
  }, [dispatch, lang, doc, version])

  function renderItems(items) {
    return (
      <ul>
        {items.map((item, i) =>
          item.url ? (
            <li key={item.url}>
              <a href={'#' + unifyAnchor(item.url)}>{item.title}</a>
              {item.items && renderItems(item.items)}
            </li>
          ) : (
            <li key={`item${i}`}>{item.items && renderItems(item.items)}</li>
          )
        )}
      </ul>
    )
  }

  return (
    <>
      <Seo
        title={frontmatter.title}
        description={frontmatter.summary}
        meta={[
          {
            name: 'doc:lang',
            content: lang,
          },
          {
            name: 'doc:type',
            content: doc,
          },
          {
            name: 'doc:version',
            content: version,
          },
        ]}
        link={[
          {
            rel: 'stylesheet',
            href: 'https://cdn.jsdelivr.net/gh/sindresorhus/github-markdown-css@4.0.0/github-markdown.css',
          },
          ...(version !== stable
            ? [
                {
                  rel: 'canonical',
                  href: `${site.siteMetadata.siteUrl}${pathname.replace(
                    version,
                    'stable'
                  )}`,
                },
              ]
            : []),
        ]}
      />
      <Column size={8}>
        <div className="markdown-body doc-content">
          {doc !== 'tidbcloud' && doc !== 'appdev' && (
            <DeprecationNotice
              name={name}
              docVersionStable={docVersionStableMap}
              versions={versions}
            />
          )}

          <MDXProvider components={Shortcodes}>
            <MDXRenderer>{mdx.body}</MDXRenderer>
          </MDXProvider>

          {doc !== 'tidbcloud' && (
            <GitCommitInfo
              repoInfo={repoInfo}
              lang={lang}
              title={frontmatter.title}
            />
          )}
        </div>
      </Column>

      <Column>
        <div className="right-aside">
          <Block>
            <DownloadPDF downloadURL={downloadURL} />
            {doc !== 'tidbcloud' && (
              <>
                <FeedbackDoc repoInfo={repoInfo} lang={lang} />
                {version === 'dev' && (
                  <ImproveDoc repoInfo={repoInfo} lang={lang} />
                )}
              </>
            )}
          </Block>
          <div className="doc-toc">
            <Title size={6} style={{ marginBottom: 0 }}>
              <FormattedMessage id="doc.toc" />
            </Title>
            {tableOfContents.items && renderItems(tableOfContents.items)}
          </div>
        </div>
      </Column>

      <UserFeedback title={frontmatter.title} lang={lang} />
    </>
  )
}

export const query = graphql`
  query ($id: String, $tocSlug: String) {
    site {
      siteMetadata {
        siteUrl
      }
    }

    mdx(id: { eq: $id }) {
      frontmatter {
        title
        summary
      }
      body
      tableOfContents
    }

    toc: mdx(slug: { eq: $tocSlug }) {
      body
    }
  }
`

export default Doc
