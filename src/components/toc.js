import '../styles/components/toc.scss'

import React, { useEffect, useRef } from 'react'

import PropTypes from 'prop-types'
import html from 'remark-html'
import remark from 'remark'

const TOC = ({ data, pathPrefix }) => {
  const rawBody = data.rawBody
  const _html = remark()
    .use(html)
    .processSync(rawBody)
    .contents.replace(/\.md/g, '')
    .match(/<ul>(.|\n)*<\/ul>/g)[0]
    .replace(/href="\/?/g, `href="${pathPrefix}`)

  const tocRef = useRef(null)

  const bindClickEventToTOC = () => {
    const toc = tocRef.current

    function clickEvent(e) {
      e.stopPropagation()

      e.target.classList.toggle('unfolded')
    }

    function retrieveLi(ul) {
      Array.from(ul.children).forEach((li) => {
        const liChildren = li.children

        if (liChildren[0].tagName.toLowerCase() === 'ul') {
          li.classList.add('can-unfold')
          li.addEventListener('click', clickEvent)

          Array.from(liChildren).forEach(retrieveLi)
        }
      })
    }

    Array.from(toc.children).forEach((ul) => {
      ul.classList.add('top')

      Array.from(ul.children).forEach((li) => {
        li.addEventListener('click', clickEvent)

        if (li.children[0].tagName.toLowerCase() === 'ul') {
          Array.from(li.children).forEach(retrieveLi)
        } else {
          li.classList.add('has-no-subject')
        }
      })
    })
  }

  useEffect(() => {
    bindClickEventToTOC()
  }, [])

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
