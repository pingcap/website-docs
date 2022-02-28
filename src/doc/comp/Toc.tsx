import { TableOfContent } from 'typing'

interface Props {
  data: TableOfContent[]
}

const versionMark = /<span class="version-mark">.*<\/span>/

export const Toc = ({ data }: Props) => (
  <ul>
    {data.map((item, i) =>
      item.url ? (
        <li key={item.url}>
          <a href={item.url}>{item.title.replace(versionMark, '')}</a>
          {item.items && <Toc data={item.items} />}
        </li>
      ) : (
        <li key={`item${i}`}>{item.items && <Toc data={item.items} />}</li>
      )
    )}
  </ul>
)
