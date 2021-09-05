import '../styles/components/version.scss'

import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Icon,
} from '@seagreenio/react-bulma'
import React, { useEffect, useState } from 'react'
import {
  docsCloudVersion,
  docsDMVersion,
  docsDevGuideVersion,
  docsTiDBOperatorVersion,
  docsTiDBVersion,
} from 'lib/version'

import { Link } from 'gatsby-plugin-react-intl'
import PropTypes from 'prop-types'

const docsTiDBVersionList = Object.values(docsTiDBVersion)
const docsTiDBOperatorVersionList = Object.values(docsTiDBOperatorVersion)
const docsDMVersionList = Object.values(docsDMVersion)
const docsCloudVersionList = Object.values(docsCloudVersion)
const docsDevGuideVersionList = Object.values(docsDevGuideVersion)

const VersionSwitcher = ({ name, docVersionStable, versions }) => {
  const { doc, version, stable: stableVersion } = docVersionStable

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

  return (
    <Dropdown className="PingCAP-Version-Switcher" hoverable>
      <DropdownTrigger>
        <Button fullwidth>
          <span>{buttonText}</span>
          <Icon name="mdi mdi-menu-down" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownContent>
          {dropdownItems.length &&
            dropdownItems.map((item) => (
              <DropdownItem key={item}>
                {versions.indexOf(item) === -1 ? (
                  <span>{item === 'stable' ? stableVersion : item}</span>
                ) : (
                  <Link to={`/${doc}/${item}/${name === '_index' ? '' : name}`}>
                    {item === 'stable' ? stableVersion : item}
                  </Link>
                )}
              </DropdownItem>
            ))}
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>
  )
}

VersionSwitcher.propTypes = {
  name: PropTypes.string.isRequired,
  docVersionStable: PropTypes.object.isRequired,
  versions: PropTypes.array,
}

export default VersionSwitcher
