import { FormattedMessage } from 'react-intl'

interface Props {
  downloadURL: string
}

export const DownloadPDF = ({ downloadURL }: Props) => {
  return (
    <a
      className="doc-help-link download-pdf"
      href={`https://download.pingcap.org/${downloadURL}`}
      target="_blank"
      rel="noreferrer"
      download>
      <FormattedMessage id="doc.download-pdf" />
    </a>
  )
}
