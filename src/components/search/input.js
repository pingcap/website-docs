import {
  Input as BulmaInput,
  Control,
  Field,
  Icon,
} from '@seagreenio/react-bulma'
import { navigate, useIntl } from 'gatsby-plugin-react-intl'

import PropTypes from 'prop-types'
import React from 'react'

const Input = ({ docInfo: { type, version }, searchValue, setSearchValue }) => {
  const intl = useIntl()

  function handleSearchInputChange(e) {
    setSearchValue(e.target.value)
  }

  const handleSearchInputKeyDown = e => {
    e.preventDefault()

    navigate(`/search?type=${type}&version=${version}&q=${searchValue}`, {
      state: {
        type,
        version,
        query: searchValue,
      },
    })
  }

  return (
    <Field as="form" onSubmit={handleSearchInputKeyDown}>
      <Control hasIcons="left">
        <BulmaInput
          type="search"
          placeholder={intl.formatMessage({ id: 'navbar.searchDocs' })}
          value={searchValue}
          onChange={handleSearchInputChange}
        />
        <Icon name="mdi mdi-magnify" alignment="left" />
      </Control>
    </Field>
  )
}

Input.propTypes = {
  docInfo: PropTypes.object.isRequired,
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
}

export default Input
