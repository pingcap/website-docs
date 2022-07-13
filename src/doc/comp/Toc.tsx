import clsx from 'clsx'
import { Heading } from 'typing'
import { useState, useRef, useEffect } from 'react'

interface Props {
  headings: Heading[]
}

function getActiveElement(rects: DOMRect[]) {
  if (rects.length === 0) {
    return -1
  }

  const closest = rects.reduce(
    (acc, item, index) => {
      if (Math.abs(acc.position) < Math.abs(item.y) - 100) {
        return acc
      }

      return {
        index,
        position: item.y,
      }
    },
    { index: 0, position: rects[0].y }
  )

  return closest.index
}

export const Toc = ({ headings }: Props) => {
  const [active, setActive] = useState(0)

  const slugs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    slugs.current = headings.map(
      ({ id }) => document.querySelector(`[id="${id}"]`) as HTMLDivElement
    )
  }, [headings])

  const handleScroll = () => {
    setActive(
      getActiveElement(slugs.current.map(d => d.getBoundingClientRect()))
    )
  }

  useEffect(() => {
    setActive(
      getActiveElement(slugs.current.map(d => d.getBoundingClientRect()))
    )
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <ul>
      {headings.map(({ id, level, title, url }, index) => (
        <li key={id} className={clsx(level === 'h3' && 'sub')}>
          <a
            className={clsx(index === active && 'active')}
            href={url}
            onClick={event => {
              event.preventDefault()
              const element = document.querySelector(
                `[id="${id}"]`
              ) as HTMLDivElement
              window.scrollTo({
                top:
                  element.getBoundingClientRect().top +
                  window.pageYOffset -
                  100,
                behavior: 'smooth',
              })
            }}>
            {title}
          </a>
        </li>
      ))}
    </ul>
  )
}
