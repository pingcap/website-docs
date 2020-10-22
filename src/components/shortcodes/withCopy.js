import copy from 'copy-to-clipboard'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import '../../styles/components/copyBtn.scss'

const WithCopy = ({ tag }) => {
  const btnEl = useRef(null)
  const [copied, setCopied] = useState(false)
  const clickToCopy = useCallback(() => {
    const txt = btnEl.current.nextElementSibling.textContent
    copy(txt)
    setCopied(true)
  }, [])

  useEffect(() => {
    if (
      btnEl.current.nextElementSibling.firstChild &&
      btnEl.current.nextElementSibling.firstChild.classList &&
      tag
    ) {
      btnEl.current.nextElementSibling.firstChild.classList.add(tag)
    }
  }, [tag])

  return (
    <button ref={btnEl} onClick={clickToCopy} className="PingCAP-copyBtn">
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
WithCopy.propTypes = {
  tag: PropTypes.string,
}

export default WithCopy
