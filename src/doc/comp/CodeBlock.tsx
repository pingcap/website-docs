import { useEffect, useState } from 'react'
import copy from 'copy-to-clipboard'
import hljs from 'highlight.js'
import ReactDOM from 'react-dom'
import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import * as styles from './codeBlock.module.scss'

export const CodeBlock = (props: { html: string; content: string }) => {
  const { html, content } = props
  const [isCopied, setIscopied] = useState(false)

  const handleButtonsContent = (e: any) => {
    if (isCopied) {
      return
    }
    setIscopied(true)
    setTimeout(() => {
      setIscopied(false)
    }, 2000)
  }

  const handleBtnClick = (e: any) => {
    handleButtonsContent(e)
    copy(content)
  }

  return (
    <>
      <div
        className={styles.codeContent}
        dangerouslySetInnerHTML={{ __html: html }}></div>
      <button
        className={clsx('button', 'is-small', styles.copyBtn)}
        onClick={handleBtnClick}>
        <span className="icon is-small">
          {isCopied ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <FontAwesomeIcon icon={faCopy} />
          )}
        </span>
      </button>
    </>
  )
}

export const useCodeBlock = () => {
  useEffect(() => {
    // const preEleList = document.querySelectorAll('pre')
    // preEleList.forEach((preEle: HTMLElement) => {
    //   const htmlStr = preEle.outerHTML
    //   preEle.outerHTML = `<div class="gatsby-highlight">${htmlStr}</div>`
    // })
    const codeBlocks = document.querySelectorAll('pre > code')
    codeBlocks.forEach((codeBlock: any) => {
      if (codeBlock) {
        const eleClassName: string = codeBlock.className
        if (eleClassName.includes('language-shell')) {
          codeBlock.className = `language-sh`
        }
        hljs.highlightElement(codeBlock)
        const html = codeBlock.innerHTML
        const content = codeBlock.textContent || ''
        const CodeBlockEle = <CodeBlock html={html} content={content} />
        ReactDOM.render(CodeBlockEle, codeBlock)
      }
    })
  }, [])
}
