import { Link } from 'gatsby'
import { useI18next } from 'gatsby-plugin-react-i18next'
import { MdAdd, MdRemove, MdSort, MdMenu } from 'react-icons/md'

import {
  activeLink,
  nav,
  navItem,
  menu,
  listOpen,
} from './navigation.module.scss'

import { RepoNav, RepoNavLink } from 'typing'
import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

const TocContent = ({ content }: { content: RepoNavLink['content'] }) => (
  <>
    {content.map((content, index) =>
      typeof content === 'string' ? (
        content
      ) : (
        <code key={index} className="language-text">
          {content.value}
        </code>
      )
    )}
  </>
)

interface ItemProps {
  data: RepoNavLink
  level: number
  active: RepoNavLink[]
}

function TocMenu({ data, level, active }: ItemProps) {
  const [head, ...rest] = active

  const [open, setOpen] = useState(data === head)
  const content = <TocContent content={data.content} />
  const children = (
    <ul className={open ? listOpen : undefined}>
      {data.children!.map((child, index) => (
        <TocItem data={child} level={level + 1} active={rest} key={index} />
      ))}
    </ul>
  )

  if (level === 0) {
    const icon = open ? <MdSort /> : <MdMenu />
    return (
      <li className={navItem}>
        <div className={menu} onClick={() => setOpen(open => !open)}>
          {content}
          {icon}
        </div>
        {children}
      </li>
    )
  }
  const icon = open ? <MdRemove /> : <MdAdd />
  return (
    <li className={navItem}>
      <div className={menu} onClick={() => setOpen(open => !open)}>
        {icon}
        {content}
      </div>
      {children}
    </li>
  )
}

function TocItem({ data, level, active }: ItemProps) {
  if (data.children) {
    return <TocMenu data={data} level={level} active={active} />
  }
  if (data.link == null) throw new Error('plain text node is unsupported')
  const isItemActive = data === active[0]
  const liProps: { id?: string } = isItemActive ? { id: 'toc-item-active' } : {}
  return (
    <li className={navItem} {...liProps}>
      {data.link.startsWith('https://') ? (
        <a target="_blank" href={data.link}>
          <TocContent content={data.content} />
        </a>
      ) : (
        <Link to={data.link} className={clsx({ [activeLink]: isItemActive })}>
          <TocContent content={data.content} />
        </Link>
      )}
    </li>
  )
}

interface Props {
  data: RepoNav
}

interface NewHTMLElement extends HTMLElement {
  scrollIntoViewIfNeeded?: any
}

export function Navigation({ data }: Props) {
  const { path } = useI18next()
  const active = useMemo(() => findActiveItem(path, data) ?? [], [path, data])

  // ! Add "auto scroll" to left nav is not recommended.
  useEffect(() => {
    const targetActiveItem: NewHTMLElement | null =
      document?.querySelector('#toc-item-active')
    if (!targetActiveItem) {
      return
    }
    const isVisiable = isInViewport(targetActiveItem)
    if (isVisiable) {
      return
    }
    if (!targetActiveItem.scrollIntoViewIfNeeded) {
      targetActiveItem.scrollIntoView({ block: 'end' })
    } else {
      targetActiveItem.scrollIntoViewIfNeeded()
    }
  })

  return (
    <ul className={nav}>
      {data.map((data, index) => (
        <TocItem data={data} level={0} active={active} key={index} />
      ))}
    </ul>
  )
}

function findActiveItem(
  path: string,
  data: RepoNav
): RepoNavLink[] | undefined {
  for (const item of data) {
    if (item.link === path) {
      return [item]
    }
    if (item.children) {
      const childFind = findActiveItem(path, item.children)
      if (childFind != null) {
        return [item, ...childFind]
      }
    }
  }
}

function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  )
}
