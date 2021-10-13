import * as styles from './versionSwitcher.module.scss'

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
import { cloud, devGuide, dm, operator, tidb } from 'lib/version'

import { Link } from 'gatsby-plugin-react-intl'
import PropTypes from 'prop-types'

const VersionSwitcher = ({
  name,
  docVersionStable,
  pathWithoutVersion,
  versions,
}) => {
  const { doc, version, stable: stableVersion } = docVersionStable

  const [text, setText] = useState('')
  const [dropdownItems, setDropdownItems] = useState([])

  function handleRelativeDir() {
    setText(version === 'stable' ? stableVersion : version)

    switch (doc) {
      case 'tidb':
        setDropdownItems(tidb)
        break
      case 'tidb-data-migration':
        setDropdownItems(dm)
        break
      case 'tidb-in-kubernetes':
        setDropdownItems(operator)
        break
      case 'tidbcloud':
        setDropdownItems(cloud)
        break
      case 'dev-guide':
        setDropdownItems(devGuide)
        break
      default:
        break
    }
  }

  useEffect(handleRelativeDir, [doc, version, stableVersion])

  return (
    <Dropdown className={styles.dropdown} hoverable>
      <DropdownTrigger className={styles.dropdownTrigger}>
        <Button className={styles.button} fullwidth>
          <span>{text}</span>
          <Icon name="mdi mdi-menu-down" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownContent>
          {dropdownItems.map(item => (
            <DropdownItem as="div" key={item}>
              {versions.indexOf(item) === -1 ? (
                <span className="has-text-grey">
                  {item === 'stable' ? stableVersion + ' (stable)' : item}
                </span>
              ) : (
                <Link
                  to={`/${doc}/${item}/${
                    name === '_index' ? '' : pathWithoutVersion
                  }`}
                >
                  {item === 'stable' ? stableVersion + ' (stable)' : item}
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
  pathWithoutVersion: PropTypes.string.isRequired,
  versions: PropTypes.array,
}

export default VersionSwitcher
