import { tabs, active, normal, hidden, newTabs } from './simple-tab.module.scss'

import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useLocation } from '@reach/router'
import clsx from 'clsx'

export function SimpleTab({
  children,
}: {
  children: ReactElement<{
    label: string
    href?: string
    children: ReactElement[]
  }>[]
}) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    let active = children.findIndex(child => {
      const activeJudge: string = child.props?.href || child.props.label
      return activeJudge === decodeURIComponent(location.hash.slice(1))
    })
    if (active === -1) {
      active = 0
    }
    setActiveTab(active)
  }, [location.hash, children])

  return (
    <>
      <ul className={tabs}>
        {children.map((child, index) => {
          const id: string = child.props?.href || child.props.label
          return (
            <li key={id} id={id}>
              <a
                href={`#${id}`}
                className={activeTab === index ? active : normal}>
                {child.props.label}
              </a>
            </li>
          )
        })}
      </ul>
      {children.map((child, index) => {
        const id: string = child.props?.href || child.props.label
        return (
          <div key={id} className={clsx(activeTab !== index && hidden)}>
            {child.props.children}
          </div>
        )
      })}
    </>
  )
}

interface TabItemProps {
  label: string
  value: string
  children: ReactElement[] | ReactElement
}

export const Tabs = (props: {
  groupId?: string
  children: ReactElement<TabItemProps>[]
}) => {
  const { children, groupId = '' } = props
  const [currentSelectedId, setCurrentSelectedId] = useState('')

  useEffect(() => {
    if (groupId && localStorage) {
      const localStorageCfgVal = localStorage.getItem(
        `website-doc.tag.${groupId}`
      )
      localStorageCfgVal && setCurrentSelectedId(localStorageCfgVal)
    }
  }, [])

  const filteredChildrenMemo = useMemo(() => {
    if (children?.length) {
      return children.reduce((prev: TabItemProps[], item) => {
        if (!(item.props.label && item.props.value)) {
          return prev
        }
        prev.push({
          label: item.props.label,
          value: item.props.value,
          children: item,
        })
        return prev
      }, [])
    }
    return []
  }, [children])

  useEffect(() => {
    const firstChild = filteredChildrenMemo[0]
    firstChild && setCurrentSelectedId(firstChild.value)
  }, [filteredChildrenMemo])

  return (
    <>
      <div className={clsx('tabs', 'is-toggle', newTabs)}>
        <ul>
          {filteredChildrenMemo.map(tag => {
            return (
              <li
                id={`tab-${tag.label}-${tag.value}`}
                className={clsx({
                  'is-active': currentSelectedId === tag.value,
                })}
                onClick={() => {
                  setCurrentSelectedId(tag.value)
                  if (groupId && localStorage) {
                    localStorage.setItem(
                      `website-doc.tag.${groupId}`,
                      tag.value
                    )
                  }
                }}>
                <a>{tag.label}</a>
              </li>
            )
          })}
        </ul>
      </div>
      {filteredChildrenMemo.map(tag => {
        return (
          <div
            id={`content-${tag.label}-${tag.value}`}
            className={clsx({ [hidden]: currentSelectedId !== tag.value })}>
            {tag.children}
          </div>
        )
      })}
    </>
  )
}

export const TabItem = (props: {
  label: string
  value: string
  children: ReactElement[]
}) => {
  return <>{props.children}</>
}
