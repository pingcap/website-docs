import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { wrapPathWithLang } from 'lib/utils'

interface Props {
  repoInfo: any
  lang: string
}

export function Improve({ repoInfo, lang }: Props) {
  const { repo, ref, realPath } = repoInfo
  const path = wrapPathWithLang(repo, realPath, lang)

  return (
    <a
      className="doc-help-link improve"
      href={`https://github.com/${repo}/edit/${ref}/${path}`}
      target="_blank"
      rel="noreferrer">
      <FormattedMessage id="doc.improve" />
    </a>
  )
}
