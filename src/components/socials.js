import React, { useEffect, useState } from 'react'
import { followSocialsEN, followSocialsZH } from '../data/socials'

import PropTypes from 'prop-types'

const Socials = ({ className, locale }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(locale === 'en' ? followSocialsEN : followSocialsZH)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {data &&
        data.map((social) => (
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          <a
            key={social.name}
            className={className ? className + ' ' + social.name : social.name}
            target="_blank"
            rel="noopener noreferrer"
            href={social.href}
          >
            {social.name}
          </a>
        ))}
    </>
  )
}

Socials.propTypes = {
  className: PropTypes.string,
  locale: PropTypes.string,
}

export default Socials
