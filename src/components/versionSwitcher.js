import '../styles/components/version.scss'

import React, { Fragment, useEffect, useState } from 'react'
import {
  docsCloudVersion,
  docsDMVersion,
  docsDevGuideVersion,
  docsTiDBOperatorVersion,
  docsTiDBVersion,
} from 'lib/version'

import { Block } from '@seagreenio/react-bulma'
import { Button } from '@seagreenio/react-bulma'
import { Link } from 'gatsby-plugin-react-intl'
import PropTypes from 'prop-types'

const docsTiDBVersionList = Object.values(docsTiDBVersion)
const docsTiDBOperatorVersionList = Object.values(docsTiDBOperatorVersion)
const docsDMVersionList = Object.values(docsDMVersion)
const docsCloudVersionList = Object.values(docsCloudVersion)
const docsDevGuideVersionList = Object.values(docsDevGuideVersion)

const VersionSwitcher = ({ name, docVersionStable, versions }) => {
  const { doc, version, stable: stableVersion } = docVersionStable

  const [dropdownActive, setDropdownActive] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [dropdownItems, setDropdownItems] = useState([])

  function handleRelativeDir() {
    setButtonText(version === 'stable' ? stableVersion : version)

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

  useEffect(handleRelativeDir, [doc, version, stableVersion])

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
    <Block>
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
                      {item === 'stable' ? `${stableVersion}` : `${item}`}
                      <span className="tooltiptext">
                        This doc does not exist in {item}
                      </span>
                    </span>
                  ) : (
                    <Link
                      to={`/${doc}/${item}/${name === '_index' ? '' : name}`}
                      className="dropdown-item"
                    >
                      {item === 'stable' ? `${stableVersion}` : `${item}`}
                    </Link>
                  )}
                </Fragment>
              ))}
          </div>
        </div>
      </div>
    </Block>
  )
}

VersionSwitcher.propTypes = {
  name: PropTypes.string.isRequired,
  docVersionStable: PropTypes.object.isRequired,
  versions: PropTypes.array,
}

export default VersionSwitcher
