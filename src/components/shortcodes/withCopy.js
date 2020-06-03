import copy from 'copy-to-clipboard'
import React, { useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import '../../styles/components/copyBtn.scss'

const WithCopy = () => {
  const btnEl = useRef(null)
  const [copied, setCopied] = useState(false)
  const clickToCopy = useCallback(() => {
    const txt = btnEl.current.nextElementSibling.textContent
    copy(txt)
    setCopied(true)
  }, [])
  return (
    <button
      ref={btnEl}
      onClick={clickToCopy}
      className='PingCAP-copyBtn'
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
WithCopy.propTypes = {
  tag: PropTypes.string,
}

export default WithCopy
