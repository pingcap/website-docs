import { tabs, active, normal, hidden } from './simple-tab.module.scss'

import { ReactElement, useState } from 'react'
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
  const [activeTab, setActiveTab] = useState(0)

  const handleActiveTabChange = (newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <>
      <ul className={tabs}>
        {children.map((child, index) => {
          const id: string = child.props?.href || child.props.label
          return (
            <li
              key={id}
              className={activeTab === index ? active : normal}
              onClick={() =>
                activeTab !== index && handleActiveTabChange(index)
              }>
              {child.props.label}
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
