import { TableOfContent } from 'typing'

interface Props {
  data: TableOfContent[]
}

const versionMark = /<span class="version-mark">.*<\/span>/

export const Toc = ({ data }: Props) => {
  // Support {#custom-id}
  // Now `#origin-id {#custom-id}` will be transformed to `#custom-id`
  const transformCustomId = (
    label: string,
    anchor: string
  ): { label: string; anchor: string } => {
    const customIdMatches = label.match(/(.+) *\{(#.+)\}$/)
    if (customIdMatches?.length) {
      const [, newLabel, newAnchor] = customIdMatches
      return { label: newLabel, anchor: newAnchor }
    }
    return { label, anchor }
  }

  const renderTocItem = (item: TableOfContent): JSX.Element => {
    const { url, title, items } = item
    if (url) {
      const { label: newLabel, anchor: newAnchor } = transformCustomId(
        title,
        url
      )
      return (
        <li key={url}>
          <a href={newAnchor}>{newLabel.replace(versionMark, '')}</a>
          {items && <Toc data={items} />}
        </li>
      )
    }
    return <li key={`item-${title}-${url}`}>{items && <Toc data={items} />}</li>
  }

  return <ul>{data.map((item, i) => renderTocItem(item))}</ul>
}
