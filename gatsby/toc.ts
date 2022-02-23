import { ListItem, List, Link, Paragraph, Text } from 'mdast'
import sig from 'signale'

import { RepoToc, RepoTocLink } from '../src/typing'
import { generateUrl, PathConfig } from './path'

export function mdxAstToToc(ast: ListItem[], config: PathConfig): RepoToc {
  return ast.map(node => {
    const content = node.children as [Paragraph, List | undefined]
    if (content.length > 0 && content.length <= 2) {
      const ret = getContentFromLink(content[0], config)

      if (content[1]) {
        const list = content[1]
        if (list.type !== 'list') {
          throw new Error(`incorrect listitem in TOC.md`)
        }

        ret.children = mdxAstToToc(list.children, config)
      }

      return ret
    }

    sig.error(ast)

    throw new Error(`incorrect format in TOC.md`)
  })
}

function getContentFromLink(
  content: Paragraph,
  config: PathConfig
): RepoTocLink {
  if (content.type !== 'paragraph' || content.children.length === 0) {
    throw new Error(`incorrect format in TOC.md`)
  }

  const child = content.children[0] as Link | Text

  if (child.type === 'link') {
    if (child.children.length === 0) {
      throw new Error(`incorrect link in TOC.md`)
    }

    const content = child.children.map(node => {
      switch (node.type) {
        case 'text':
          return node.value
        case 'inlineCode':
          return { code: true, value: node.value }
        default:
          throw new Error(`unsupported tag ${node.type} in TOC link`)
      }
    })

    if (child.url.startsWith('https://docs.pingcap.com')) {
      return {
        link: child.url.replace('https://docs.pingcap.com', ''),
        content,
      }
    }

    const urlSegs = child.url.split('/')
    const filename = urlSegs[urlSegs.length - 1].replace('.md', '')

    return {
      link: generateUrl(filename, config),
      content,
    }
  } else {
    return {
      content: [child.value],
    }
  }
}
