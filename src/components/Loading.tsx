import * as styles from './loading.module.scss'

import clsx from 'clsx'
import loaderSpinner from '../../images/loading-spinner.svg'
import { CSSProperties } from 'react'

interface Props {
  wholeScreen?: boolean
  stretched?: boolean
  imgProps?: Record<string, any>
  style?: CSSProperties
}

export const Loading = <T extends Props>({
  wholeScreen,
  stretched,
  imgProps,
  style
}: T) => (
  <div
    className={clsx(
      styles.loading,
      wholeScreen && styles.wholeScreen,
      stretched && styles.stretched
    )}
    style={style}>
    <img {...imgProps} src={loaderSpinner} alt="loading spinner" />
  </div>
)
