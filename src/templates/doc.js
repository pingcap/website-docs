import '../styles/templates/doc.scss'

import * as Shortcodes from '../components/shortcodes'

import {
  Block,
  Column,
  Columns,
  Progress,
  Title,
} from '@seagreenio/react-bulma'
import React, { useEffect } from 'react'
import { setDocInfo, setLangSwitchable } from '../state'

import DeprecationNotice from '../components/deprecationNotice'
import DownloadPDF from '../components/doc/downloadPDF'
import FeedbackDoc from '../components/doc/feedback'
import { FormattedMessage } from 'gatsby-plugin-react-intl'
import GitCommitInfo from '../components/gitCommitInfo'
import ImproveDoc from '../components/doc/improve'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import PromptBanner from '../../images/community-careers-banner.jpg'
import Seo from '../components/seo'
import Toc from '../components/toc'
import UserFeedback from '../components/userFeedback'
import VersionSwitcher from '../components/versionSwitcher'
import { graphql } from 'gatsby'
import optimizeBlockquote from '../lib/optimizeBlockquote'
import replaceInternalHref from '../lib/replaceInternalHref'
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
  const { mdx, toc } = data
  const { frontmatter, tableOfContents } = mdx
  const docVersionStableMap = JSON.parse(docVersionStable)
  const { doc, version } = docVersionStableMap

  const repoInfo = {
    repo,
    ref,
    pathWithoutVersion,
  }

  const location = useLocation()
  const { currentPath } = location

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLangSwitchable(langSwitchable))

    // TODO: remove
    optimizeBlockquote()

    return () => dispatch(setLangSwitchable(true))
  }, [])

  // useEffect(() => {
  //   const footer = document.querySelector('.footer.PingCAP-Footer')
  //   const footerHeight = footer.getBoundingClientRect().height

  //   let isReachFooter = false

  //   const scrollListener = () => {
  //     const winScrollHeight = document.documentElement.scrollHeight
  //     const winClientHeight = document.documentElement.clientHeight
  //     const winScrollTop = document.documentElement.scrollTop
  //     const toFooter = winScrollHeight - winClientHeight - footerHeight

  //     if (winScrollTop > toFooter && !isReachFooter) {
  //       isReachFooter = true
  //     }

  //     if (winScrollTop < toFooter && isReachFooter) {
  //       isReachFooter = false
  //     }

  //     const height = winScrollHeight - winClientHeight
  //     const scrolled = ((winScrollTop / height) * 100).toFixed()

  //     const progressEle = document.querySelector('progress')
  //     progressEle.value = scrolled

  //     if (winScrollTop > 0) {
  //       progressEle.classList.add('show')
  //     } else {
  //       progressEle.classList.remove('show')
  //     }
  //   }

  //   window.addEventListener('scroll', scrollListener)

  //   return () => window.removeEventListener('scroll', scrollListener)
  // }, [])

  useEffect(() => {
    // replaceInternalHref(lang, doc, version)

    dispatch(
      setDocInfo({
        lang: lang,
        type: doc,
        version: version,
      })
    )
  }, [dispatch, lang, doc, version])

  function replaceItemURL(item) {
    let itemURL
    if (item) {
      itemURL = item
        .replace(/\s/g, '-')
        .replace(/[^-\w\u4E00-\u9FFF]*/g, '')
        .toLowerCase()
        .replace(/span-classversion-mark|span$/g, '')
    }

    return itemURL
  }

  function renderItems(items) {
    return (
      <ul>
        {items.map((item) => (
          <li key={item.url}>
            <a
              href={'#' + replaceItemURL(item.url)}
              dangerouslySetInnerHTML={{ __html: item.title }}
            ></a>
            {item.items && renderItems(item.items)}
          </li>
        ))}
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
        ]}
      />
      <article className="PingCAP-Doc">
        <Progress
          className="doc-progress"
          color="primary"
          value={0}
          max={100}
        />
        <Columns gap={6}>
          <Column>
            <div className="left-aside">
              <VersionSwitcher
                name={name}
                docVersionStable={docVersionStableMap}
                versions={versions}
              />
              <Toc data={toc} />
            </div>
          </Column>

          <Column size={8}>
            <div className="markdown-body doc-content">
              {doc !== 'tidbcloud' && doc !== 'dev-guide' && (
                <DeprecationNotice
                  name={name}
                  docVersionStable={docVersionStableMap}
                  versions={versions}
                />
              )}

              <MDXProvider components={Shortcodes}>
                <MDXRenderer>{mdx.body}</MDXRenderer>
              </MDXProvider>

              {/* {doc !== 'tidbcloud' && (
                <GitCommitInfo
                  repoInfo={repoInfo}
                  lang={lang}
                  title={frontmatter.title}
                />
              )} */}
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
              {currentPath === '/zh/tidb/stable' && (
                <a
                  className="Promote"
                  href="https://pingcap.com/community-cn/careers/join/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={PromptBanner} alt="PingCAP community careers" />
                </a>
              )}
            </div>
          </Column>
        </Columns>
      </article>

      <UserFeedback title={frontmatter.title} lang={lang} />
    </>
  )
}

export const query = graphql`
  query ($id: String, $tocSlug: String) {
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
