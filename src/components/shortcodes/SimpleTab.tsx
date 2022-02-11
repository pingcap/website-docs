import { tabs, active, hidden } from './simple-tab.module.scss'

import { ReactElement, useEffect, useState } from 'react'
import { useLocation } from '@reach/router'
import clsx from 'clsx'

export function SimpleTab({
  children,
}: {
  children: ReactElement<{ label: string; children: ReactElement[] }>[]
}) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    let active = children.findIndex(
      child => child.props.label === location.hash.slice(1)
    )
    if (active === -1) {
      active = 0
    }
    setActiveTab(active)
  }, [location.hash, children])

  return (
    <>
      <ul className={tabs}>
        {children.map((child, index) => (
          <li key={child.props.label} id={child.props.label}>
            <a
              href={'#' + child.props.label}
              className={clsx(activeTab === index && active)}>
              {child.props.label}
            </a>
          </li>
        ))}
      </ul>
      {children.map((child, index) => (
        <div
          key={child.props.label}
          className={clsx(activeTab !== index && hidden)}>
          {child.props.children}
        </div>
      ))}
    </>
  )
}
