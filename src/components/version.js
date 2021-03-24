import '../styles/components/version.scss'

import React, { useEffect, useState, Fragment } from 'react'
import {
  convertDocAndRef,
  docsTiDBVersion,
  docsDMVersion,
  docsTiDBOperatorVersion,
  docsCloudVersion,
  docsDevGuideVersion,
} from '../lib/version'

import { Button } from '@seagreenio/react-bulma'
import IntlLink from '../components/IntlLink'
import PropTypes from 'prop-types'

const docsTiDBVersionList = Object.values(docsTiDBVersion)
const docsTiDBOperatorVersionList = Object.values(docsTiDBOperatorVersion)
const docsDMVersionList = Object.values(docsDMVersion)
const docsCloudVersionList = Object.values(docsCloudVersion)
const docsDevGuideVersionList = Object.values(docsDevGuideVersion)

const Version = ({ relativeDir, base, versions }) => {
  const [doc, ref, stableVersion] = convertDocAndRef(relativeDir.split('/'))

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
      case 'tidbcloud':
        setDropdownItems(docsCloudVersionList)
        break
      case 'dev-guide':
        setDropdownItems(docsDevGuideVersionList)
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
              <Fragment key={item}>
                {versions && versions.indexOf(item) === -1 ? (
                  <span className="dropdown-item unclickable-btn">
                    {item === 'stable'
                      ? `${stableVersion} (stable)`
                      : item === 'v5.0'
                      ? `v5.0 (rc)`
                      : `${item}`}
                    <span className="tooltiptext">
                      This doc does not exist in {item}
                    </span>
                  </span>
                ) : (
                  <IntlLink
                    type="innerLink"
                    to={`/${doc}/${item}/${
                      baseName === '_index' ? '' : baseName
                    }`}
                    className="dropdown-item"
                  >
                    {item === 'stable'
                      ? `${stableVersion} (stable)`
                      : item === 'v5.0'
                      ? `v5.0 (rc)`
                      : `${item}`}
                  </IntlLink>
                )}
              </Fragment>
            ))}
        </div>
      </div>
    </div>
  )
}

Version.propTypes = {
  relativeDir: PropTypes.string.isRequired,
  base: PropTypes.string.isRequired,
  versions: PropTypes.array,
}

export default Version
