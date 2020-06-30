import PropTypes from 'prop-types'
import React from 'react'

const TabsPanel = ({ letters }) => (
  <div className="PingCAP-Tabs-Panel">
    {Array.from(letters).map((letter) => (
      <a href={`#${letter}`}>
        <div class="letter-btn">{letter}</div>
      </a>
    ))}
  </div>
)

TabsPanel.propTypes = {
  letters: PropTypes.node.isRequired,
}

export default TabsPanel
