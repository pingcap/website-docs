import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@seagreenio/react-bulma'
import { Link, useI18next } from 'gatsby-plugin-react-i18next'
import { Fragment, useMemo } from 'react'
import { Locale, PathConfig, Repo } from 'typing'
import { MdArrowDropDown } from 'react-icons/md'

import {
  button,
  dropdown,
  dropdownContent,
  dropdownMenu,
  dropdownTrigger,
  noExist,
} from './version-switcher.module.scss'
import { docs } from '../../../docs.json'
import { AllVersion } from '../../../gatsby/path'

function renderVersion(version: string, pathConfig: PathConfig) {
  if (version !== 'stable') return version
  return (docs[pathConfig.repo] as { stable: string }).stable.replace(
    'release-',
    'v'
  )
}

interface Props {
  name: string
  pathConfig: PathConfig
  availIn: string[]
}

export function VersionSwitcher({ name, pathConfig, availIn }: Props) {
  const { t } = useI18next()

  return (
    <Dropdown className={dropdown} hoverable>
      <DropdownTrigger className={dropdownTrigger}>
        <Button className={button} fullwidth>
          <span>{renderVersion(pathConfig.version, pathConfig)}</span>
          <MdArrowDropDown />
        </Button>
      </DropdownTrigger>
      <DropdownMenu className={dropdownMenu}>
        <DropdownContent className={dropdownContent}>
          {AllVersion[pathConfig.repo][pathConfig.locale].map(
            (version, i, arr) => (
              <Fragment key={version}>
                {availIn.indexOf(version) === -1 ? (
                  <DropdownItem as="div">
                    <span
                      className={noExist}
                      data-tooltip={t('doc.notExist')}
                      data-flow="right">
                      {renderVersion(version, pathConfig)}
                    </span>
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    // @ts-ignore
                    as={Link}
                    to={`/${pathConfig.repo}/${version}/${name}`}>
                    {renderVersion(version, pathConfig)}
                  </DropdownItem>
                )}
                {i < arr.length - 1 && <DropdownDivider />}
              </Fragment>
            )
          )}
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>
  )
}
