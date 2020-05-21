import React from 'react'
import loaderSpinner from '../../images/loader-spinner.svg'

const Loading = ({ isLoading }) => {
    return (
        <div className={`loading ${isLoading? '' : 'hide-loading'}`}>
            <img src={loaderSpinner} alt="loading icon" />
        </div>
    )
}

export default Loading
