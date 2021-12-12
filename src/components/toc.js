import 'styles/components/toc.scss'

import React, { useLayoutEffect, useRef } from 'react'
import { generateHrefs, navigateInsideEventListener } from '../lib/utils'

import { MDXRenderer } from 'gatsby-plugin-mdx'
import PropTypes from 'prop-types'

const TOC = ({ data, name, lang, docVersionStable }) => {
  const { doc, version } = docVersionStable
  const wrapper = useRef()

  const generate = () => {
    const toc = wrapper.current.firstChild
    toc.className = 'top'
    // clear previous active anchor
    const activeAnchor = toc.querySelector('a.active')
    if (activeAnchor) {
      activeAnchor.className = ''
    }

    function fold(li) {
      const start = performance.now()

      Array.from(li.children).forEach(el => {
        // ignore icon
        if (el.tagName !== 'SPAN') {
          requestAnimationFrame(function animate(timestamp) {
            const elapsed = timestamp - start
            const progress = Math.min(elapsed / 250, 1)

            if (progress < 1) {
              el.style.height = `${
                el.scrollHeight - progress * el.scrollHeight
              }px`
              el.style.overflow = 'hidden'

              requestAnimationFrame(animate)
            }

            if (progress === 1) {
              el.style.height = ''
              el.style.overflow = ''
            }
          })
        }
      })
    }

    function unfold(li) {
      const start = performance.now()

      Array.from(li.children).forEach(el => {
        if (el.tagName !== 'SPAN') {
          requestAnimationFrame(function animate(timestamp) {
            const elapsed = timestamp - start
            const progress = Math.min(elapsed / 250, 1)

            if (progress < 1) {
              el.style.height = `${progress * el.scrollHeight}px`

              requestAnimationFrame(animate)
            }

            if (progress === 1) {
              el.style.height = 'auto'
              el.style.overflow = 'initial'
            }
          })
        }
      })
    }

    function clickEvent(e) {
      e.stopPropagation()

      if (e.target.tagName === 'A') {
        if (navigateInsideEventListener(e)) {
          const activeAnchor = toc.querySelector('a.active')
          if (activeAnchor) {
            activeAnchor.className = ''
          }
          e.target.className = 'active'
        }

        return
      }

      const li = e.currentTarget

      if (li.classList.contains('folded')) {
        unfold(li)
      } else {
        fold(li)
      }

      li.classList.toggle('folded')

      const icon = li.lastChild.firstChild
      // ensure icon
      if (icon.tagName === 'SPAN') {
        icon.className = icon.className.endsWith('plus')
          ? 'mdi mdi-minus'
          : 'mdi mdi-plus'
      }
    }

    /**
     * modifyHref
     *
     * @param {HTMLAnchorElement} el
     */
    function modifyHref(el) {
      const href = el.getAttribute('href')

      if (href && !href.startsWith('http') && href.includes('.md')) {
        const [realHref, internalHref, _name] = generateHrefs(
          href,
          lang,
          doc,
          version
        )

        el.href = realHref
        el.setAttribute('data-href', internalHref)

        if (_name === name) {
          el.className = 'active'

          while (el.parentElement) {
            const p = el.parentElement

            if (p.classList.contains('top')) {
              break
            }

            if (p.classList.contains('folded')) {
              p.classList.remove('folded')
              Array.from(p.children).forEach(d => {
                if (d.tagName === 'UL') {
                  d.style = 'height: auto; overflow: initial;'
                }
              })
            }

            el = p
          }
        }
      }
    }

    function retrieveLi(ul) {
      // ignore icon
      if (ul.tagName === 'SPAN') {
        return
      }

      Array.from(ul.children).forEach(li => {
        const first = li.firstElementChild

        if (
          first.tagName === 'UL' ||
          (first.tagName === 'A' &&
            first.nextElementSibling &&
            first.nextElementSibling.tagName === 'UL')
        ) {
          li.classList.add('can-unfold', 'folded')

          if (li.parentElement.className !== 'top') {
            const icon = document.createElement('span')
            icon.className = 'icon'
            icon.innerHTML = '<i class="mdi mdi-plus"></i>'
            li.append(icon)
          }

          li.addEventListener('click', clickEvent)

          if (first.tagName === 'A') {
            modifyHref(first)
          }

          Array.from(li.children).forEach(retrieveLi)
        } else {
          modifyHref(li.firstChild)
        }
      })
    }

    Array.from(toc.children).forEach(li => {
      if (li.firstElementChild.tagName !== 'UL') {
        li.className = 'has-no-subject'
      }
    })

    retrieveLi(toc)
  }

  /* eslint-disable */
  useLayoutEffect(generate, [data.body])
  /* eslint-enable */

  return (
    <div ref={wrapper} className="PingCAP-TOC">
      <MDXRenderer>{data.body}</MDXRenderer>
    </div>
  )
}

TOC.propTypes = {
  data: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  docVersionStable: PropTypes.object.isRequired,
}

export default TOC
