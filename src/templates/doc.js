import '../styles/templates/doc.scss'
import 'github-markdown-css/github-markdown.css'

import * as Shortcodes from '../components/shortcodes'

import { Block, Column, Title } from '@seagreenio/react-bulma'
import { useEffect } from 'react'
import replaceInternalHref, {
  fullVersionMark,
  unifyAnchor,
} from '../lib/replaceInternalHref'
import { setDocData, setDocInfo, setLangSwitchable } from '../state'

import { DeprecationNotice } from '../components/DeprecationNotice'
import { DownloadPDF } from '../components/doc/DownloadPDF'
import { FeedbackDoc } from '../components/doc/Feedback'
import { Improve } from '../components/doc/Improve'
import { FormattedMessage } from 'gatsby-plugin-react-intl'
import GitCommitInfo from '../components/gitCommitInfo'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { Seo } from '../components/Seo'
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
    realPath,
    pathWithoutVersion,
    docVersionStable,
    langSwitchable,
    downloadURL,
    versions,
  },
  data,
}) => {
  const { pathname } = useLocation()

  const { site, mdx, toc } = data
  const { frontmatter, tableOfContents } = mdx
  const docVersionStableMap = JSON.parse(docVersionStable)
  const { doc, version, stable } = docVersionStableMap

  const repoInfo = {
    repo,
    ref,
    realPath,
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setDocData({ toc }))
  }, [dispatch, toc])

  useEffect(() => {
    dispatch(setLangSwitchable(langSwitchable))

    return () => dispatch(setLangSwitchable(true))
  }, [dispatch, langSwitchable])

  useEffect(() => {
    replaceInternalHref(lang, doc, version)

    // TODO: remove
    optimizeBlockquote()

    dispatch(
      setDocInfo({
        lang,
        type: doc,
        version,
      })
    )
  }, [dispatch, lang, doc, version])

  function renderItems(items) {
    return (
      <ul>
        {items.map((item, i) =>
          item.url ? (
            <li key={item.url}>
              <a href={'#' + unifyAnchor(item.url)}>
                {item.title.replace(fullVersionMark, '')}
              </a>
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
      <Column size={7}>
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
                  <Improve repoInfo={repoInfo} lang={lang} />
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
