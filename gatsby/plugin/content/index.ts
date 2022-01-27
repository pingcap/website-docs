import visit from 'unist-util-visit'
import type { Root } from 'mdast'

function textToJsx(text: string) {
  switch (text) {
    case 'Note:':
    case '注意：':
      return 'Note'
    case 'Warning:':
    case '警告：':
      return 'Warning'
    case 'Tip:':
    case '建议：':
      return 'Tip'
    default:
      throw new Error('unreachable')
  }
}

module.exports = function ({
  markdownAST,
  markdownNode,
}: {
  markdownAST: Root
  markdownNode: { fileAbsolutePath: string }
}) {
  visit(markdownAST, (node: any) => {
    if (Array.isArray(node.children)) {
      node.children = node.children.flatMap((node: any) => {
        if (node.type !== 'blockquote') return node
        const first = node.children[0]
        if (
          first?.type === 'paragraph' &&
          first.children?.[0].type === 'strong' &&
          first.children[0].children?.[0].type === 'text'
        ) {
          const text = first.children[0].children[0].value
          switch (text) {
            case 'Note:':
            case '注意：':
            case 'Warning:':
            case '警告：':
            case 'Tip:':
            case '建议：': {
              const children = node.children.slice(1)
              const jsx = textToJsx(text)
              return [
                { type: 'jsx', value: `<${jsx}>` },
                ...children,
                { type: 'jsx', value: `</${jsx}>` },
              ]
            }

            default:
              return node
          }
        }
        return node
      })
    }
  })
}
