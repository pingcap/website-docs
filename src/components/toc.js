import '../styles/components/toc.scss'

import React, { useEffect, useRef } from 'react'

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
      Array.from(li.children).forEach(
        (el) => (el.style.height = el.scrollHeight + 'px')
      )
    }

    function clickEvent(e) {
      e.stopPropagation()

      const li = e.target
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
        if (li.children[0].tagName.toLowerCase() === 'ul') {
          li.classList.add('can-unfold', 'folded')
          li.addEventListener('click', clickEvent)

          Array.from(li.children).forEach(retrieveLi)
        }
      })
    }

    Array.from(toc.children).forEach((ul) => {
      ul.classList.add('top')

      Array.from(ul.children).forEach((li) => {
        if (li.children[0].tagName.toLowerCase() !== 'ul') {
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

  useEffect(() => {
    bindClickEventToTOC()
  }, [])

  useEffect(() => {
    const absPathRegx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}/
    Array.from(tocRef.current.getElementsByTagName('a')).forEach((a) => {

      // escape outbound path replacement
      if (!a.getAttribute('href').match(absPathRegx)) {
        const href = a.href
        const lastSegment = href
          .substring(href.lastIndexOf('/') + 1)
          .replace(/\.md/g, '')

        a.href = pathPrefix + lastSegment

        // unfold active nav item
        if (pathPrefix + lastSegment === fullPath) {
          let tagTempEle = a
          const liClientRect = tagTempEle.parentElement.getBoundingClientRect()
          const tocClientRect = tocRef.current.getBoundingClientRect()
          const dy = liClientRect.top - tocClientRect.top - tocClientRect.height

          tagTempEle.parentElement.classList.add('is-active')
          while (!tagTempEle.classList.contains('top')) {
            if (tagTempEle.classList.contains('folded')) {
              tagTempEle.classList.remove('folded')
            }
            tagTempEle = tagTempEle.parentElement
          }

          if (dy > 0) {
            // polyfill
            if (!tocRef.current.scrollTo) {
              console.log('Your browser does not support scrollTo API')
              tocRef.current.scrollTop = tocClientRect.height + dy
            }
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll
            tocRef.current.scrollTo({
              top: tocClientRect.height + dy,
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
