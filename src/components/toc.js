import 'styles/components/toc.scss'

import React, { useEffect } from 'react'

import { MDXRenderer } from 'gatsby-plugin-mdx'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby-plugin-react-intl'

const TOC = ({ data, docVersionStable }) => {
  const { doc, version } = docVersionStable

  const generate = () => {
    const wrapper = document.querySelector('.PingCAP-TOC')
    const toc = wrapper.firstChild
    toc.className = 'top'

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
        e.preventDefault()

        const href = e.target.getAttribute('href').replace('.md', '')
        navigate(`/${doc}/${version}/${href}`)

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

          Array.from(li.children).forEach(retrieveLi)
        }
      })
    }

    Array.from(toc.children).forEach(li => {
      if (li.firstElementChild.tagName !== 'UL') {
        li.className = 'has-no-subject'
      }
    })

    retrieveLi(toc)

    wrapper.classList.remove('hidden')
  }

  useEffect(generate, [])

  return (
    <div className="PingCAP-TOC hidden">
      <MDXRenderer>{data.body}</MDXRenderer>
    </div>
  )
}

TOC.propTypes = {
  data: PropTypes.object.isRequired,
  docVersionStable: PropTypes.object.isRequired,
}

export default TOC
