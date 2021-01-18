import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import '../../styles/components/simpletab.scss'

const SimpleTab = React.memo(({ children }) => {
  const TabPanel = React.memo((props) => {
    const { children, value, index, ...other } = props

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    )
  })

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const [value, setValue] = useState(0)
  const [tabLabelList, setTabLabelList] = useState([])
  const [tabPanelList, setTabPanelList] = useState([])
  const multiTabs = children.length ? true : false

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

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

  return (
    <div className="PingCAP-simpleTab">
      {multiTabs && (
        <>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs"
            >
              {tabLabelList &&
                tabLabelList.map((tabLabel, idx) => (
                  <Tab
                    label={tabLabel}
                    key={tabLabel}
                    {...a11yProps(`${idx}`)}
                  />
                ))}
            </Tabs>
          </AppBar>
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
