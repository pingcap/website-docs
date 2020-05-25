import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { navigate } from 'gatsby'

const Input = ({
  docInfo: { lang, type, version },
  searchValue,
  setSearchValue,
}) => {
  function handleSearchInputChange(e) {
    setSearchValue(e.target.value)
  }

  const handleSearchInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(
        `${
          lang === 'en' ? '' : '/' + lang
        }/search?lang=${lang}&type=${type}&version=${version}&q=${searchValue}`,
        {
          state: {
            lang,
            type,
            version,
            query: searchValue,
          },
        }
      )
    }
  }

  return (
    <FormattedMessage id="navbar.searchDocs">
      {(placeholder) => (
        <div className="field">
          <p className="control has-icons-left">
            <input
              aria-label="Search"
              className="input is-small is-rounded"
              type="search"
              placeholder={placeholder}
              value={searchValue}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchInputKeyDown}
            />
            <span className="icon is-left">
              <SearchIcon />
            </span>
          </p>
        </div>
      )}
    </FormattedMessage>
  )
}

Input.propTypes = {
  docInfo: PropTypes.object.isRequired,
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
}

export default Input
