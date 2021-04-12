import '../styles/components/toc.scss'

import React, { useEffect, useRef } from 'react'
import { navigate } from 'gatsby'

import PropTypes from 'prop-types'
import html from 'remark-html'
import remark from 'remark'

const TOC = ({ data, pathPrefix, fullPath }) => {
  const rawBody = data.rawBody
  const _html = remark()
    .use(html)
    .processSync(rawBody)
    .contents.match(/<ul>(.|\n)*<\/ul>/g)[0]

  const tocRef = useRef(null)

  const bindClickEventToTOC = () => {
    const toc = tocRef.current

    function fold(li) {
      Array.from(li.children).forEach((list) => {
        if (list && list.tagName === 'SPAN') {
          list.style.display = 'inlin-block'
        } else if (list && list.tagName === 'UL') {
          list.style.display = 'none'
        }

        Array.from(list.children).forEach((el) => {
          if (
            el.classList.contains('can-unfold') &&
            !el.classList.contains('folded')
          ) {
            el.classList.add('folded')
            fold(el)
          }
        })

        requestAnimationFrame(() => {
          list.style.height = list.scrollHeight + 'px'

          requestAnimationFrame(() => {
            list.style.height = null
          })
        })
      })
    }

    function unfold(li) {
      Array.from(li.children).forEach((el) => {
        if (el && el.tagName === 'SPAN') {
          el.style.display = 'inlin-block'
        } else if (el && el.tagName === 'UL') {
          el.style.display = 'block'
        }

        return (el.style.height = el.scrollHeight + 'px')
      })
    }

    function clickEvent(e) {
      e.stopPropagation()

      let li = e.target

      if (
        e.target.classList.contains('add-icon') ||
        e.target.classList.contains('remove-icon')
      ) {
        li = e.target.parentElement
      }

      li.parentElement.style.height = null

      // keep only one unfolded level
      const canUnfoldEle = li.parentElement.children
      Array.from(canUnfoldEle).forEach((el) => {
        if (
          el.classList.contains('can-unfold') &&
          !el.classList.contains('folded') &&
          !el.classList.contains('has-no-subject') &&
          li !== el
        ) {
          el.classList.add('folded')
          fold(el)
          return
        }
      })

      if (li.classList.contains('folded')) {
        unfold(li)
      } else {
        fold(li)
      }

      li.classList.toggle('folded')
    }

    function retrieveLi(ul) {
      Array.from(ul.children).forEach((li) => {
        if (li.children[0] && li.children[0].tagName.toLowerCase() === 'ul') {
          li.classList.add('can-unfold', 'folded')

          if (!li.parentElement.classList.contains('top')) {
            let unfoldEle = document.createElement('span')
            let foldEle = document.createElement('span')
            unfoldEle.classList.add('add-icon')
            foldEle.classList.add('remove-icon')
            li.insertBefore(unfoldEle, li.children[0])
            li.insertBefore(foldEle, li.children[0])
            unfoldEle.addEventListener('click', clickEvent)
            foldEle.addEventListener('click', clickEvent)
          } else {
            li.addEventListener('click', clickEvent)
          }

          Array.from(li.children).forEach(retrieveLi)
        }
      })
    }

    Array.from(toc.children).forEach((ul) => {
      ul.classList.add('top')

      Array.from(ul.children).forEach((li) => {
        if (li.children[0] && li.children[0].tagName.toLowerCase() !== 'ul') {
          li.classList.add('has-no-subject')
        }
      })

      retrieveLi(ul)
      const tocElement = document.getElementsByClassName('PingCAP-TOC')
      if (tocElement) {
        tocElement[0].classList.add('show-toc')
      }
    })
  }

  const bindNavigateToAllLinks = () => {
    const toc = tocRef.current

    toc.addEventListener(
      'click',
      (e) => {
        const current = e.target
        const type = current.tagName

        if (type === 'A') {
          const href = current.getAttribute('href')
          const isInternal = /^\/(?!\/)/.test(href)

          if (isInternal) {
            e.preventDefault()

            navigate(href)
          }
        }
      },
      true
    )
  }

  useEffect(() => {
    bindClickEventToTOC()
    bindNavigateToAllLinks()
  }, [])

  useEffect(() => {
    const absPathRegx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}/

    Array.from(tocRef.current.getElementsByTagName('a')).forEach((a) => {
      // escape outbound path replacement
      if (!a.getAttribute('href').match(absPathRegx)) {
        const href = a.href
        const lastSegment = href
          .substring(href.lastIndexOf('/') + 1)
          .replace(/\.md/g, '')

        a.href = pathPrefix + lastSegment

        let hrefWithoutHash = pathPrefix + lastSegment

        if (hrefWithoutHash.split('#').length > 1) {
          hrefWithoutHash = (pathPrefix + lastSegment).split('#')[0]
        }

        // unfold active nav item
        if (hrefWithoutHash === fullPath) {
          let tagTempEle = a

          tagTempEle.parentElement.classList.add('is-active')
          while (tagTempEle && !tagTempEle.classList.contains('top')) {
            if (tagTempEle.classList.contains('folded')) {
              tagTempEle.classList.remove('folded')
            }
            tagTempEle = tagTempEle.parentElement
          }

          const liClientRect = a.parentElement.getBoundingClientRect()
          const dy = liClientRect.top - window.innerHeight / 2

          if (dy > 0) {
            // polyfill
            if (!tocRef.current.scrollTo) {
              console.log('Your browser does not support scrollTo API')
              tocRef.current.scrollTop = dy
            }

            const leftTOCColumn = document.getElementsByClassName('left-column')
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll
            leftTOCColumn[0].scrollTo({
              top: dy,
              left: 0,
              behavior: 'smooth',
            })
          }
        }
      }
    })
  }, [pathPrefix, fullPath])

  return (
    <section
      ref={tocRef}
      className="PingCAP-TOC"
      dangerouslySetInnerHTML={{ __html: _html }}
    />
  )
}

TOC.propTypes = {
  data: PropTypes.object.isRequired,
  pathPrefix: PropTypes.string.isRequired,
}

export default TOC
