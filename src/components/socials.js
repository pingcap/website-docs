import React, { useEffect, useState } from 'react'
import { followSocials, shareSocials } from '../data/socials'

import PropTypes from 'prop-types'

const Socials = ({ className, type, title }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(
      type === 'follow'
        ? followSocials
        : type === 'share'
        ? shareSocials(window.location.href, title)
        : followSocials
    )
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
  type: PropTypes.string,
  title: PropTypes.string,
}

export default Socials
