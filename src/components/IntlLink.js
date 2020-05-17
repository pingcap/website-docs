import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import { useIntl } from 'react-intl'

const IntlLink = ({ to, children, ...rest }) => {
  const intl = useIntl()

  const localeTo = `${intl.locale === 'en' ? '' : '/' + intl.locale}${to}`

  return (
    <Link {...rest} to={localeTo}>
      {children}
    </Link>
  )
}

IntlLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default IntlLink
