import { en, zh } from '../data/socials'

import PropTypes from 'prop-types'
import React from 'react'
import clsx from 'clsx'

const Socials = ({ className, locale }) => {
  const data = locale === 'en' ? en : zh

  return (
    <>
      {data &&
        data.map((social) => (
          <a
            key={social.name}
            className={clsx('social', social.name, className)}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
          />
        ))}
    </>
  )
}

Socials.propTypes = {
  className: PropTypes.string,
  locale: PropTypes.string.isRequired,
}

export default Socials
