import React from 'react'
import { FormattedMessage } from 'react-intl'

const DownloadPDF = ({ downloadURL }) => {
  return (
    <div className="doc-download">
      <a
        href={`https://download.pingcap.org/${downloadURL}`}
        target="_blank"
        rel="noreferrer"
      >
        <FormattedMessage id="download-pdf" />
      </a>
    </div>
  )
}

export default DownloadPDF
