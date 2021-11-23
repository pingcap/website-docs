import * as styles from './versionSwitcher.module.scss'

import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Icon,
} from '@seagreenio/react-bulma'
import { Link, useIntl } from 'gatsby-plugin-react-intl'
import React, { Fragment, useEffect, useState } from 'react'
import { appdev, cloud, dm, operator, tidb } from 'lib/version'

import PropTypes from 'prop-types'

const VersionSwitcher = ({
  name,
  docVersionStable,
  pathWithoutVersion,
  versions,
}) => {
  const intl = useIntl()
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
      case 'appdev':
        setDropdownItems(appdev)
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
      <DropdownMenu className={styles.dropdownMenu}>
        <DropdownContent className={styles.dropdownContent}>
          {dropdownItems.map((item, i) => (
            <Fragment key={item}>
              <DropdownItem as="div">
                {versions.indexOf(item) === -1 ? (
                  <span
                    className="has-text-grey"
                    data-tooltip={intl.formatMessage({ id: 'doc.notExist' })}
                    data-flow="right"
                  >
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
              {i < dropdownItems.length - 1 && <DropdownDivider />}
            </Fragment>
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
