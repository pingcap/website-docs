import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import '../../styles/components/simpletab.scss'
import { useLocation } from '@reach/router'

const SimpleTab = React.memo(({ children }) => {
  const location = useLocation()
  const selectedTab = location.hash ? location.hash.slice(1) : null

  const [value, setValue] = useState(0)
  const [tabLabelList, setTabLabelList] = useState([])
  const [tabPanelList, setTabPanelList] = useState([])
  const multiTabs = children.length ? true : false

  useEffect(() => {
    const _tabLabelList = []
    const _tabPanelList = []

    if (multiTabs) {
      children.forEach((child) => {
        _tabLabelList.push(child.props.label)
        _tabPanelList.push(child.props.children)
      })
    }

    setTabLabelList(_tabLabelList)
    setTabPanelList(_tabPanelList)
  }, [children, multiTabs])

  useEffect(() => {
    if (tabLabelList.includes(selectedTab)) {
      const selectedTabIdx = tabLabelList.findIndex((el) => el === selectedTab)
      setValue(selectedTabIdx)
    } else {
      setValue(0)
    }
  }, [selectedTab, tabLabelList])

  function a11yProps(type, index) {
    if (type === 'panel') {
      return {
        id: `${tabLabelList[index]}`.replace(/\s/g, '-'),
        'aria-labelledby': `${tabLabelList[index]}-tab`.replace(/\s/g, '-'),
        role: 'tabpanel',
      }
    } else {
      return {
        id: `${tabLabelList[index]}-tab`.replace(/\s/g, '-'),
        'aria-controls': `${tabLabelList[index]}`.replace(/\s/g, '-'),
        role: 'tab',
      }
    }
  }

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props

    return (
      <div
        className={`tabpanel ${index === value ? 'is-active' : ''}`}
        {...a11yProps('panel', `${index}`)}
        {...other}
      >
        {children}
      </div>
    )
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }

  return (
    <div className="PingCAP-simpleTab">
      {multiTabs && (
        <>
          <div className="tabs is-boxed">
            <ul>
              {tabLabelList &&
                tabLabelList.map((tabLabel, idx) => (
                  <li
                    className={`${idx === value ? 'is-active' : ''}`}
                    key={tabLabel + idx}
                    {...a11yProps('tab', `${idx}`)}
                  >
                    <a href={`#${tabLabel}`}>{tabLabel}</a>
                  </li>
                ))}
            </ul>
          </div>
          {tabPanelList &&
            tabPanelList.map((tabPanel, idx) => (
              <TabPanel key={idx} value={value} index={idx}>
                {tabPanel}
              </TabPanel>
            ))}
        </>
      )}
    </div>
  )
})

export default SimpleTab
