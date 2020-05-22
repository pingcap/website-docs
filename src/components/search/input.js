import React, { useState } from 'react'

import { FormattedMessage } from 'react-intl'
import SearchIcon from '@material-ui/icons/Search'

const Input = ({ docInfo: { lang, type, version } }) => {
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearchInputChange(e) {
    setSearchQuery(e.target.value)
  }

  return (
    <form
      action={`${
        lang === 'en' ? '' : '/' + lang
      }/search?type=${type}&version=${version}&q=${searchQuery}`}
    >
      <FormattedMessage id="navbar.searchDocs">
        {(placeholder) => (
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input is-small is-rounded"
                type="search"
                placeholder={placeholder}
                onChange={handleSearchInputChange}
              />
              <span className="icon is-left">
                <SearchIcon />
              </span>
            </p>
          </div>
        )}
      </FormattedMessage>
    </form>
  )
}

export default Input
