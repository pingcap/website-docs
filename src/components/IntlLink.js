import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import { useIntl } from 'react-intl'

const IntlLink = ({ to, children, type, ...rest }) => {
  const intl = useIntl()

  const localeTo = `${intl.locale === 'en' ? '' : '/' + intl.locale}${to}`
  const linkType = type

  return (
    <>
      {linkType === 'aHrefLink' ? (
        <a {...rest} href={localeTo}>
          {children}
        </a>
      ) : (
        <>
          {linkType === 'outBoundLink' ? (
            <a {...rest} href={to} target="_blank">
              {children}
            </a>
          ) : (
            <Link {...rest} to={localeTo}>
              {children}
            </Link>
          )}
        </>
      )}
    </>
  )
}

IntlLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default IntlLink
