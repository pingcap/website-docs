import * as styles from './loading.module.scss'

import PropTypes from 'prop-types'
import React from 'react'
import clsx from 'clsx'
import loaderSpinner from '../../images/loading-spinner.svg'

const Loading = props => {
  return (
    <div
      className={clsx(styles.loading, props.wholeScreen && styles.wholeScreen)}
    >
      <img src={loaderSpinner} alt="loading spinner" />
    </div>
  )
}

Loading.propTypes = {
  wholeScreen: PropTypes.bool,
}

export default Loading
