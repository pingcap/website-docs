import '../styles/components/loading.scss'

import React from 'react'
import loaderSpinner from '../../images/loading-spinner.svg'

const Loading = () => (
  <div className="PingCAP-Loading">
    <img src={loaderSpinner} alt="loading spinner" />
  </div>
)

export default Loading
