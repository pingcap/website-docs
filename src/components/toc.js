import '../styles/components/toc.scss'

import React, { useEffect } from 'react'

import { Block } from '@seagreenio/react-bulma'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import PropTypes from 'prop-types'

const TOC = React.memo(({ data }) => {
  const bindClickEventToTOC = () => {
    const toc = document.querySelector('.PingCAP-TOC')

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

  useEffect(() => {
    bindClickEventToTOC()
  }, [])

  useEffect(() => {
    document.querySelectorAll('.PingCAP-TOC a').forEach((el) => {
      el.setAttribute('href', el.getAttribute('href').replace('.md', ''))
    })
  }, [])

  return (
    <Block className="PingCAP-TOC">
      <MDXRenderer>{data.body}</MDXRenderer>
    </Block>
  )
})

TOC.propTypes = {
  data: PropTypes.object.isRequired,
}

function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}

export default TOC
