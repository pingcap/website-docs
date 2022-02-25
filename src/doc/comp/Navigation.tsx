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
import { useMemo, useState } from 'react'
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
  return (
    <li className={navItem}>
      {data.link.startsWith('https://') ? (
        <a target="_blank" href={data.link}>
          <TocContent content={data.content} />
        </a>
      ) : (
        <Link to={data.link} className={clsx(data === active[0] && activeLink)}>
          <TocContent content={data.content} />
        </Link>
      )}
    </li>
  )
}

interface Props {
  data: RepoNav
}

export function Navigation({ data }: Props) {
  const { path } = useI18next()
  const active = useMemo(() => findActiveItem(path, data) ?? [], [path, data])

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
