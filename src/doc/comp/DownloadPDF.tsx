import { Trans } from 'gatsby-plugin-react-i18next'
import { PathConfig } from 'typing'
import { generatePdfUrl } from '../../../gatsby/path'

interface Props {
  pathConfig: PathConfig
}

export const DownloadPDF = ({ pathConfig }: Props) => (
  <a
    className="doc-help-link download-pdf"
    href={`https://download.pingcap.org/${generatePdfUrl(pathConfig)}`}
    target="_blank"
    rel="noreferrer"
    download>
    <Trans i18nKey="doc.download-pdf" />
  </a>
)
