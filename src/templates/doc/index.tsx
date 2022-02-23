import '../../styles/templates/doc.scss'
import 'github-markdown-css/github-markdown.css'

import * as Shortcodes from '../../components/shortcodes'

import { Block, Column, Columns, Title } from '@seagreenio/react-bulma'
import { useEffect } from 'react'
import { Trans } from 'gatsby-plugin-react-i18next'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { graphql } from 'gatsby'
import { useDispatch } from 'react-redux'
import { useLocation } from '@reach/router'

import replaceInternalHref, {
  fullVersionMark,
  unifyAnchor,
} from 'lib/replaceInternalHref'
import { setDocInfo } from 'state'
import { Seo } from 'components/Seo'

import { DeprecationNotice } from './comp/DeprecationNotice'
import { DownloadPDF } from './comp/DownloadPDF'
import { FeedbackDoc } from './comp/Feedback'
import { Improve } from './comp/Improve'
import { GitCommitInfo } from './comp/GitCommitInfo'
import { UserFeedback } from './comp/UserFeedback'
import { Toc } from './comp/Toc'
import {} from './doc.module.scss'
import { Layout } from 'layout'
import { VersionSwitcher } from './comp/VersionSwitcher'

export default function Doc({
  pageContext: {
    toc,
    name,
    repo,
    ref,
    lang,
    realPath,
    docVersionStable,
    pathWithoutVersion,
    langSwitchable,
    downloadURL,
    versions,
  },
  data,
}) {
  const { pathname } = useLocation()

  const {
    site,
    mdx: { frontmatter, tableOfContents, body },
  } = data
  const docVersionStableMap = JSON.parse(docVersionStable)
  const { doc, version, stable } = docVersionStableMap

  const repoInfo = {
    repo,
    ref,
    realPath,
  }

  const dispatch = useDispatch()

  useEffect(() => {
    replaceInternalHref(lang, doc, version)

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
    <Layout langSwitchable={langSwitchable}>
      <article className="PingCAP-Doc">
        <Columns>
          <div className="column is-one-fifth">
            <div className="left-aside">
              <Block>
                <VersionSwitcher
                  name={name}
                  docVersionStable={docVersionStableMap}
                  pathWithoutVersion={pathWithoutVersion}
                  versions={versions}
                />
              </Block>
              {toc && (
                <Toc
                  data={toc}
                  name={name}
                  lang={lang}
                  docVersionStable={docVersionStableMap}
                />
              )}
            </div>
          </div>

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
                <MDXRenderer>{body}</MDXRenderer>
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
                  <Trans i18nKey="doc.toc" />
                </Title>
                {tableOfContents.items && renderItems(tableOfContents.items)}
              </div>
            </div>
          </Column>

          <UserFeedback title={frontmatter.title} locale={lang} />
        </Columns>
      </article>
    </Layout>
  )
}

export const query = graphql`
  query ($id: String, $language: String!) {
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

    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
