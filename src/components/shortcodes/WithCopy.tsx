import copy from 'copy-to-clipboard'
import { useRef, useState, useCallback, useEffect } from 'react'
import { copyBtn } from './with-copy.module.scss'

export const WithCopy = ({ tag }: { tag: string }) => {
  const btnEl = useRef<HTMLButtonElement>(null)
  const [copied, setCopied] = useState(false)
  const clickToCopy = useCallback(() => {
    const txt = btnEl.current!.nextElementSibling!.textContent!
    copy(txt)
    setCopied(true)
  }, [])

  useEffect(() => {
    if (
      btnEl.current!.nextElementSibling &&
      btnEl.current!.nextElementSibling.firstChild &&
      (btnEl.current!.nextElementSibling.firstChild as HTMLElement).classList &&
      tag
    ) {
      ;(
        btnEl.current!.nextElementSibling.firstChild as HTMLElement
      ).classList.add(tag)
    }
  }, [tag])

  return (
    <button ref={btnEl} onClick={clickToCopy} className={copyBtn}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
