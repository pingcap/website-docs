import * as styles from './loading.module.scss'

import PropTypes from 'prop-types'
import React from 'react'
import clsx from 'clsx'
import loaderSpinner from '../../images/loading-spinner.svg'

const Loading = ({ wholeScreen, stretched, imgProps, ...rest }) => {
  return (
    <div
      className={clsx(
        styles.loading,
        wholeScreen && styles.wholeScreen,
        stretched && styles.stretched
      )}
      {...rest}
    >
      <img {...imgProps} src={loaderSpinner} alt="loading spinner" />
    </div>
  )
}

Loading.propTypes = {
  wholeScreen: PropTypes.bool,
  stretched: PropTypes.bool,
  imgProps: PropTypes.object,
}

export default Loading
