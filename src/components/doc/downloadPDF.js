import { FormattedMessage } from 'react-intl'
import React from 'react'

const DownloadPDF = ({ downloadURL }) => {
  return (
    <a
      className="doc-help-link download-pdf"
      href={`https://download.pingcap.org/${downloadURL}`}
      target="_blank"
      rel="noreferrer"
    >
      <FormattedMessage id="doc.download-pdf" />
    </a>
  )
}

export default DownloadPDF
