import React from 'react'
import { FormattedMessage } from 'react-intl'

const Download = ({ downloadURL }) => {
  return (
    <section>
      <div className="doc-download">
        <a href={`https://download.pingcap.org/${downloadURL}`}>
          <FormattedMessage id="download-pdf" />
        </a>
      </div>
    </section>
  )
}

export default Download
