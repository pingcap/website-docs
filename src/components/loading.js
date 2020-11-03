import '../styles/components/loading.scss'

import React from 'react'
import loaderSpinner from '../../images/loading-spinner.svg'

const Loading = (prop) => {
  return (
    <div className={`PingCAP-Loading ${prop.wholeSreen && 'whole-screen'}`}>
      <img src={loaderSpinner} alt="loading spinner" />
    </div>
  )
}

export default Loading
