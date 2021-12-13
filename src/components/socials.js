import { en, zh } from '../data/socials'

import PropTypes from 'prop-types'
import React from 'react'
import clsx from 'clsx'

const Socials = ({ locale, className }) => {
  const data = locale === 'en' ? en : zh

  return (
    <>
      {data &&
        data.map((social) => (
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          <a
            key={social.name}
            className={clsx('social', social.name, className)}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
            aria-label={social.name}
          />
        ))}
    </>
  )
}

Socials.propTypes = {
  locale: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default Socials
