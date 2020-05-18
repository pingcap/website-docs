import '../styles/components/version.scss'

import React, { useEffect, useState } from 'react'
import {
  convertDocAndRef,
  docsDMVersion,
  docsTiDBOperatorVersion,
} from '../lib/version'

import { Button } from '@seagreenio/react-bulma'
import IntlLink from '../components/IntlLink'
import PropTypes from 'prop-types'

const docsTiDBOperatorVersionList = Object.values(docsTiDBOperatorVersion)
const docsDMVersionList = Object.values(docsDMVersion)

const Version = ({ relativeDir, base }) => {
  const paths = relativeDir.split('/')
  const [doc, ref] = convertDocAndRef(paths[0], paths[1])

  const baseName = base.replace('.md', '')

  const [dropdownActive, setDropdownActive] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [dropdownItems, setDropdownItems] = useState([])

  function handleRelativeDir() {
    setButtonText(ref)

    switch (doc) {
      case 'tidb-in-kubernetes':
        setDropdownItems(docsTiDBOperatorVersionList)
        break
      case 'tidb-data-migration':
        setDropdownItems(docsDMVersionList)
        break
      default:
        break
    }
  }

  useEffect(handleRelativeDir, [])

  const handleMenuOpen = () => {
    if (dropdownActive) {
      setDropdownActive('')
    } else {
      setDropdownActive('is-active')
    }
  }

  return (
    <div
      className={`PingCAP-version-switcher dropdown${
        dropdownActive ? ' ' + dropdownActive : ''
      }`}
    >
      <div className="dropdown-trigger">
        <Button className={dropdownActive} fullwidth onClick={handleMenuOpen}>
          {buttonText}
        </Button>
      </div>
      <div className="dropdown-menu">
        <div className="dropdown-content">
          {dropdownItems.length > 0 &&
            dropdownItems.map((item) => (
              <IntlLink
                key={item}
                to={`/${doc}/${item}/${baseName === '_index' ? '' : baseName}`}
                className="dropdown-item"
              >
                {item}
              </IntlLink>
            ))}
        </div>
      </div>
    </div>
  )
}

Version.propTypes = {
  relativeDir: PropTypes.string.isRequired,
  base: PropTypes.string.isRequired,
}

export default Version
