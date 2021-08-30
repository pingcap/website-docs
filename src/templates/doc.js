import '../styles/templates/doc.scss'

import * as Shortcodes from '../components/shortcodes'

import React, { useEffect } from 'react'

import DeprecationNotice from '../components/deprecationNotice'
import DownloadPDF from '../components/downloadPDF'
import FeedbackDocLink from '../components/feedbackDocLink'
import { FormattedMessage } from 'react-intl'
import GitCommitInfo from '../components/gitCommitInfo'
import ImproveDocLink from '../components/improveDocLink'
import Layout from '../components/layout'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import PromptBanner from '../../images/community-careers-banner.jpg'
import Seo from '../components/seo'
import Toc from '../components/toc'
import UserFeedback from '../components/userFeedback'
import VersionSwitcher from '../components/versionSwitcher'
import { getDocInfo } from '../state'
import { graphql } from 'gatsby'
import optimizeBlockquote from '../lib/optimizeBlockquote.js'
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
    fullPath,
    pathPrefix,
    langSwitchable,
    downloadURL,
    pathWithoutVersion,
    versions,
  },
  data,
}) => {
  const { mdx } = data
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
    optimizeBlockquote()
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
    replaceInternalHref(lang, doc, version)

    dispatch(
      getDocInfo({
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
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
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

  const handleShowDocMenu = (e) => {
    const docMenu = e.target
    const toc = docMenu.nextSibling

    docMenu.classList.toggle('active')
    toc.classList.toggle('show')
  }

  return (
    <Layout
      locale={lang}
      forbidResetDocInfo={true}
      langSwitchable={langSwitchable}
    >
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
            href: 'https://cdn.jsdelivr.net/gh/sindresorhus/github-markdown-css@3.0.1/github-markdown.css',
          },
        ]}
      />
      <article className="PingCAP-Doc">
        <progress
          className="progress is-primary doc-progress"
          value="0"
          max="100"
        />
        <section className="section container">
          <div className="content-columns columns">
            <div className="left-column column">
              <VersionSwitcher
                name={name}
                docVersionStable={docVersionStableMap}
                versions={versions}
              />
              <div
                role="button"
                tabIndex={0}
                className="doc-menu-mobile"
                onClick={handleShowDocMenu}
                onKeyDown={handleShowDocMenu}
              >
                <FormattedMessage id="doc.mobileDocMenu" />
              </div>
              {/* <Toc
                data={toc.nodes[0]}
                pathPrefix={pathPrefix}
                fullPath={fullPath}
              /> */}
            </div>
            <section className="markdown-body doc-content column">
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
              {doc !== 'tidbcloud' && (
                <GitCommitInfo
                  repoInfo={repoInfo}
                  lang={lang}
                  title={frontmatter.title}
                />
              )}
            </section>
            <div className="doc-toc-column column">
              <div className="docs-operation">
                <DownloadPDF downloadURL={downloadURL} />
                {doc !== 'tidbcloud' && (
                  <>
                    {version === 'dev' && (
                      <ImproveDocLink repoInfo={repoInfo} lang={lang} />
                    )}
                    <FeedbackDocLink repoInfo={repoInfo} lang={lang} />
                  </>
                )}
              </div>
              <section className="doc-toc">
                <div className="title">
                  <FormattedMessage id="doc.toc" />
                </div>
                <div className="toc-content">
                  {tableOfContents.items && renderItems(tableOfContents.items)}
                </div>
              </section>
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
          </div>
        </section>
      </article>

      <UserFeedback title={frontmatter.title} lang={lang} />
    </Layout>
  )
}

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        summary
      }
      body
      tableOfContents
    }
  }
`

export default Doc
