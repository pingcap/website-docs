import * as styles from './simpletab.module.scss'

import React, { useState } from 'react'

import { Tabs } from '@seagreenio/react-bulma'
import clsx from 'clsx'

const SimpleTab = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <Tabs className={styles.tabs} boxed>
        {children.map((child, index) => (
          // eslint-disable-next-line
          <li
            key={child.props.label}
            className={clsx(activeTab === index && 'is-active')}
            onClick={() => setActiveTab(index)}
          >
            <a href={'#' + child.props.label}>{child.props.label}</a>
          </li>
        ))}
      </Tabs>
      {children.map((child, index) => (
        <div className={clsx(activeTab !== index && 'is-hidden')}>
          {child.props.children}
        </div>
      ))}
    </>
  )
}

export default SimpleTab
