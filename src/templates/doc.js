import '../styles/templates/doc.scss'

import * as Shortcodes from '../components/shortcodes'

import React, { useEffect, useState } from 'react'

import DownloadPDF from '../components/downloadPDF'
import { FormattedMessage } from 'react-intl'
import Layout from '../components/layout'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import SEO from '../components/seo'
import TOC from '../components/toc'
import VersionSwitcher from '../components/version'
import { convertDocAndRef } from '../lib/version'
import { getDocInfo } from '../state'
import { getRepoInfo } from '../lib/docHelper'
import { graphql } from 'gatsby'
import replaceInternalHref from '../lib/replaceInternalHref'
import { useDispatch } from 'react-redux'
import ImproveDocLink from '../components/improveDocLink'
import FeedbackDocLink from '../components/feedbackDocLink'

const Doc = ({
  pageContext: {
    locale,
    relativeDir,
    base,
    pathPrefix,
    downloadURL,
    fullPath,
    versions,
  },
  data,
}) => {
  const { mdx, toc } = data
  const { frontmatter, tableOfContents } = mdx
  const docRefArray = convertDocAndRef(relativeDir.split('/'))
  const repoInfo = getRepoInfo(relativeDir, locale)

  const [showProgress, setShowProgress] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  function addStyleToQuote(quote, type) {
    quote.classList.add('doc-blockquote')
    quote.classList.add(type)
  }

  function optimizeBlockquote() {
    const blockquoteList = document.getElementsByTagName('blockquote')
    Array.from(blockquoteList).forEach((quote) => {
      if (quote.children[0] && quote.children[0].children[0]) {
        const labelText = quote.children[0].children[0].innerHTML

        switch (labelText) {
          case 'Note:':
          case '注意：':
            addStyleToQuote(quote, 'note')
            break
          case 'Warning:':
          case '警告：':
            addStyleToQuote(quote, 'warning')
            break
          case 'Tip:':
          case '建议：':
            addStyleToQuote(quote, 'tip')
            break
          case 'Error:':
          case '错误：':
            addStyleToQuote(quote, 'error')
            break
          default:
            break
        }
      }
    })
  }

  useEffect(() => {
    optimizeBlockquote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const footer = document.querySelector('.footer.PingCAP-Footer')
    const footerHeight = footer.getBoundingClientRect().height

    let isReachFooter = false

    const scrollListener = () => {
      const winScrollHeight = document.documentElement.scrollHeight
      const winClientHeight = document.documentElement.clientHeight
      const winScrollTop = document.documentElement.scrollTop
      const toFooter = winScrollHeight - winClientHeight - footerHeight

      setShowProgress(winScrollTop > 0)

      if (winScrollTop > toFooter && !isReachFooter) {
        isReachFooter = true
      }

      if (winScrollTop < toFooter && isReachFooter) {
        isReachFooter = false
      }

      const height = winScrollHeight - winClientHeight
      const scrolled = ((winScrollTop / height) * 100).toFixed()
      setReadingProgress(scrolled)
    }

    window.addEventListener('scroll', scrollListener)

    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

  const dispatch = useDispatch()

  useEffect(
    () => {
      replaceInternalHref(locale, docRefArray[0], docRefArray[1])

      dispatch(
        getDocInfo({
          lang: locale,
          type: docRefArray[0],
          version: docRefArray[1],
        })
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  function replaceItemURL(item) {
    let itemURL
    if (item) {
      itemURL = item
        .replace(/\s/g, '-')
        .replace(/[^-\w\u4E00-\u9FFF]*/g, '')
        .toLowerCase()
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

  const handleShowDocMenu = (e) => {
    const docMenu = e.target
    const toc = docMenu.nextSibling

    docMenu.classList.toggle('active')
    toc.classList.toggle('show')
  }

  return (
    <Layout locale={locale} forbidResetDocInfo={true}>
      <SEO
        title={frontmatter.title}
        meta={[
          {
            name: 'doc:locale',
            content: locale,
          },
          {
            name: 'doc:type',
            content: docRefArray[0],
          },
          {
            name: 'doc:version',
            content: docRefArray[1],
          },
        ]}
        link={[
          {
            rel: 'stylesheet',
            href:
              'https://cdn.jsdelivr.net/gh/sindresorhus/github-markdown-css@3.0.1/github-markdown.css',
          },
        ]}
      />
      <article className="PingCAP-Doc">
        {showProgress && (
          <progress
            className="progress is-primary doc-progress"
            value={readingProgress}
            max="100"
          >
            {readingProgress}
          </progress>
        )}
        <section className="section container">
          <div className="columns">
            <div className="column is-2 left-column">
              <VersionSwitcher
                relativeDir={relativeDir}
                base={base}
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
              <TOC
                data={toc.nodes[0]}
                pathPrefix={pathPrefix}
                fullPath={fullPath}
              />
            </div>
            <div className="column is-8">
              <section className="markdown-body doc-content">
                <MDXProvider components={Shortcodes}>
                  <MDXRenderer>{mdx.body}</MDXRenderer>
                </MDXProvider>
              </section>
            </div>
            <div className="column is-2 doc-toc-column">
              <>
                {docRefArray[0] === 'tidbcloud' ? (
                  ''
                ) : (
                  <div className="docs-operation">
                    {locale == 'zh' && (
                      <DownloadPDF downloadURL={downloadURL} />
                    )}
                    <ImproveDocLink repoInfo={repoInfo} base={base} />
                    <FeedbackDocLink repoInfo={repoInfo} base={base} />
                  </div>
                )}
              </>

              <section className="doc-toc">
                <div className="title">
                  <FormattedMessage id="doc.toc" />
                </div>
                <div className="toc-content">
                  {tableOfContents.items && renderItems(tableOfContents.items)}
                </div>
              </section>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  )
}

export const query = graphql`
  query($id: String, $langCollection: String, $tocPath: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
      body
      tableOfContents
    }

    toc: allMdx(
      filter: {
        fields: {
          langCollection: { eq: $langCollection }
          relativePath: { eq: $tocPath }
        }
      }
    ) {
      nodes {
        rawBody
      }
    }
  }
`

export default Doc
