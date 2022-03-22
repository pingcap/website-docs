import 'styles/templates/doc.scss'

import * as Shortcodes from 'components/shortcodes'

import { Block, Column, Columns, Title } from '@seagreenio/react-bulma'
import { useMemo, useEffect } from 'react'
import { Trans } from 'gatsby-plugin-react-i18next'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { graphql, Link } from 'gatsby'
import { useDispatch } from 'react-redux'

import { Seo } from 'components/Seo'

import { DeprecationNotice } from './comp/DeprecationNotice'
import { DownloadPDF } from './comp/DownloadPDF'
import { FeedbackDoc } from './comp/Feedback'
import { Improve } from './comp/Improve'
import { GitCommitInfo } from './comp/GitCommitInfo'
import { UserFeedback } from './comp/UserFeedback'
import { Navigation } from './comp/Navigation'
import {} from './doc.module.scss'
import { Layout } from 'layout'
import { VersionSwitcher } from './comp/VersionSwitcher'
import { Toc } from './comp/Toc'
import { FrontMatter, PageContext, Repo, RepoNav, TableOfContent } from 'typing'
import { getStable } from '../../gatsby/utils'
import { generateUrl } from '../../gatsby/path'
import { setDocInfo } from 'state'

interface Props {
  pageContext: PageContext
  data: {
    site: {
      siteMetadata: {
        siteUrl: string
      }
    }
    mdx: {
      frontmatter: FrontMatter
      body: string
      tableOfContents: TableOfContent
    }
    navigation: {
      navigation: RepoNav
    }
  }
}

export default function Doc({
  pageContext: { name, availIn, pathConfig, filePath },
  data,
}: Props) {
  const {
    site,
    mdx: { frontmatter, tableOfContents, body },
    navigation: { navigation },
  } = data

  const tocData = useMemo(() => {
    if (tableOfContents.items!.length === 1) {
      return tableOfContents.items![0].items
    }
    return tableOfContents.items
  }, [tableOfContents.items])

  const stableBranch = getStable(pathConfig.repo)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      setDocInfo({
        lang: pathConfig.locale,
        type: pathConfig.repo,
        version: pathConfig.version,
      })
    )
  }, [dispatch, pathConfig])


  return (
    <Layout locale={availIn.locale}>
      <article className="PingCAP-Doc">
        <Columns>
          <div className="column is-one-fifth">
            <div className="left-aside">
              <VersionSwitcher
                name={name}
                pathConfig={pathConfig}
                availIn={availIn.version}
              />
              <Navigation data={navigation} />
            </div>
          </div>

          <Seo
            title={frontmatter.title}
            description={frontmatter.summary}
            meta={[
              {
                name: 'doc:lang',
                content: pathConfig.locale,
              },
              {
                name: 'doc:type',
                content: pathConfig.repo,
              },
              {
                name: 'doc:version',
                content: pathConfig.branch,
              },
            ]}
            link={[
              ...(pathConfig.branch !== stableBranch && stableBranch != null
                ? [
                    {
                      rel: 'canonical',
                      href: `${site.siteMetadata.siteUrl}${generateUrl(name, {
                        ...pathConfig,
                        branch: stableBranch,
                      })}`,
                    },
                  ]
                : []),
            ]}
          />
          <Column size={7}>
            <div className="markdown-body doc-content">
              <DeprecationNotice
                name={name}
                pathConfig={pathConfig}
                availIn={availIn.version}
              />

              <MDXProvider components={{ ...Shortcodes, Link }}>
                <MDXRenderer>{body}</MDXRenderer>
              </MDXProvider>

              {pathConfig.repo !== Repo.tidbcloud && (
                <GitCommitInfo
                  pathConfig={pathConfig}
                  title={frontmatter.title}
                  filePath={filePath}
                />
              )}
            </div>
          </Column>

          <Column>
            <div className="right-aside">
              <Block>
                <DownloadPDF pathConfig={pathConfig} />
                {pathConfig.repo !== 'tidbcloud' && (
                  <>
                    <FeedbackDoc pathConfig={pathConfig} filePath={filePath} />
                    {pathConfig.version === 'dev' && (
                      <Improve pathConfig={pathConfig} filePath={filePath} />
                    )}
                  </>
                )}
              </Block>
              <div className="doc-toc">
                <Title size={6} style={{ marginBottom: 0 }}>
                  <Trans i18nKey="doc.toc" />
                </Title>
                {tocData && <Toc data={tocData} />}
              </div>
            </div>
          </Column>

          <UserFeedback title={frontmatter.title} locale={pathConfig.locale} />
        </Columns>
      </article>
    </Layout>
  )
}

export const query = graphql`
  query ($id: String, $language: String!, $navUrl: String!) {
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

    navigation: mdx(slug: { eq: $navUrl }) {
      navigation
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
