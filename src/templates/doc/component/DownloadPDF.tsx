import { Trans } from 'gatsby-plugin-react-i18next'

interface Props {
  downloadURL: string
}

export const DownloadPDF = ({ downloadURL }: Props) => (
  <a
    className="doc-help-link download-pdf"
    href={`https://download.pingcap.org/${downloadURL}`}
    target="_blank"
    rel="noreferrer"
    download>
    <Trans i18nKey="doc.download-pdf" />
  </a>
)
