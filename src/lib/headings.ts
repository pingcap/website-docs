import { TableOfContent, Heading } from 'typing'

const transformCustomId = (title: string) => {
  // Support {#custom-id}
  // Now `#origin-id {#custom-id}` will be transformed to `#custom-id`
  title = title?.replace(/<span class="version-mark">.*<\/span>/, '')
  const customIdMatches = title?.match(/(.+) *\{(#.+)\}$/)
  return customIdMatches?.length ? customIdMatches[1] : title
}

export function getHeadings(data: TableOfContent[] | undefined) {
  if (!data) {
    return []
  }
  return data
    .flatMap(heading =>
      [{ ...heading, level: 'h2' }].concat(
        heading.items?.map(item => ({ ...item, level: 'h3' })) || []
      )
    )
    .map(({ url, level, title }) => ({
      id: url?.replace('#', ''),
      url,
      level,
      title: transformCustomId(title),
    })) as Heading[]
}
