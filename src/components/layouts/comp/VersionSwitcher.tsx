import * as styles from './version-switcher.module.scss'

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
import { Link, useI18next } from 'gatsby-plugin-react-i18next'
import { Fragment, useEffect, useState } from 'react'
import {
  appdev,
  cloud,
  convertVersionName,
  dm,
  operator,
  tidb,
} from 'lib/version'

interface Props {
  name: string
  docVersionStable: Record<string, any>
  pathWithoutVersion: string
  versions: string[]
}

export function VersionSwitcher({
  name,
  docVersionStable,
  pathWithoutVersion,
  versions,
}: Props) {
  const { t } = useI18next()
  const { doc, version, stable: stableVersion } = docVersionStable

  const [text, setText] = useState('')
  const [dropdownItems, setDropdownItems] = useState([])

  function handleRelativeDir() {
    setText(version === 'stable' ? convertVersionName(stableVersion) : version)

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

  const renderItem = item =>
    item === 'stable' ? convertVersionName(stableVersion) : item

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
              {versions.indexOf(item) === -1 ? (
                <DropdownItem as="div">
                  <span
                    className={styles.noExistSpan}
                    data-tooltip={t('doc.notExist')}
                    data-flow="right">
                    {renderItem(item)}
                  </span>
                </DropdownItem>
              ) : (
                <DropdownItem
                  as={Link}
                  to={`/${doc}/${item}/${
                    name === '_index' ? '' : pathWithoutVersion
                  }`}>
                  {renderItem(item)}
                </DropdownItem>
              )}
              {i < dropdownItems.length - 1 && <DropdownDivider />}
            </Fragment>
          ))}
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>
  )
}
