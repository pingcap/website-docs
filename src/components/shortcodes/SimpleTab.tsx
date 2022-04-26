import { tabs, active, normal, hidden } from './simple-tab.module.scss'

import { ReactElement, useEffect, useState } from 'react'
import { useLocation } from '@reach/router'
import clsx from 'clsx'

export function SimpleTab({
  children,
}: {
  children: ReactElement<{ label: string; href?: string; children: ReactElement[] }>[]
}) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(0)
  
  useEffect(() => {
    let active = children.findIndex(
      child => {
        const activeJudge: string = child.props?.href || child.props.label;
        return activeJudge === decodeURIComponent(location.hash.slice(1))
      }
    )
    if (active === -1) {
      active = 0
    }
    setActiveTab(active)
  }, [location.hash, children])

  return (
    <>
      <ul className={tabs}>
        {children.map((child, index) => {
          const id: string = child.props?.href || child.props.label;
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
        const id: string = child.props?.href || child.props.label;
        return (
          <div
            key={id}
            className={clsx(activeTab !== index && hidden)}>
            {child.props.children}
          </div>
        )
      })}
    </>
  )
}
