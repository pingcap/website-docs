import '../styles/components/version.scss'

import React, { useEffect, useState } from 'react'
import {
  convertDocAndRef,
  docsTiDBVersion,
  docsDMVersion,
  docsTiDBOperatorVersion,
} from '../lib/version'

import { Button } from '@seagreenio/react-bulma'
import IntlLink from '../components/IntlLink'
import PropTypes from 'prop-types'

const docsTiDBVersionList = Object.values(docsTiDBVersion)
const docsTiDBOperatorVersionList = Object.values(docsTiDBOperatorVersion)
const docsDMVersionList = Object.values(docsDMVersion)

const Version = ({ relativeDir, base }) => {
  const [doc, ref] = convertDocAndRef(relativeDir.split('/'))

  const baseName = base.replace('.md', '')

  const [dropdownActive, setDropdownActive] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [dropdownItems, setDropdownItems] = useState([])

  function handleRelativeDir() {
    setButtonText(ref)

    switch (doc) {
      case 'tidb':
        setDropdownItems(docsTiDBVersionList)
        break
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
    function handleClickOutside(e) {
      e.stopPropagation()

      setDropdownActive('')
      document.removeEventListener('click', handleClickOutside)
    }

    if (dropdownActive) {
      setDropdownActive('')
    } else {
      setDropdownActive('is-active')
      document.addEventListener('click', handleClickOutside)
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
