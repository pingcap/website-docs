import copy from 'copy-to-clipboard'
import React, { useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

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
      // TODO: extract
      style={{
        position: 'relative',
        width: '85px',
        float: 'right',
        zIndex: '2',
        color: '#94a3ea',
        background: '#272822',
        border: 'none',
        borderRadius: '0 3px 0 0',
        padding: '16px .3rem 0',
        fontFamily: 'inherit',
        fontSize: '13px',
        fontStyle: 'italic',
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
WithCopy.propTypes = {
  tag: PropTypes.string,
}

export default WithCopy
