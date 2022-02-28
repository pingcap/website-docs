import visit from 'unist-util-visit'
import type { Root, Link, Blockquote } from 'mdast'

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
        if (node.type === 'link') {
          const ele = node as Link

          if (ele.url.startsWith('http')) {
            return [
              {
                type: 'jsx',
                value: `<a href="${ele.url}" target="_blank" rel="noreferrer">`,
              },
              ...node.children,
              { type: 'jsx', value: '</a>' },
            ]
          } else {
            const urlSeg = ele.url.split('/')
            const fileName = urlSeg[urlSeg.length - 1].replace('.md', '')
            const path = markdownNode.fileAbsolutePath.endsWith('_index.md')
              ? fileName
              : '../' + fileName
            return [
              {
                type: 'jsx',
                value: `<Link to="${path}">`,
              },
              ...node.children,
              { type: 'jsx', value: '</Link>' },
            ]
          }
        }

        if (node.type === 'blockquote') {
          const ele = node as Blockquote
          const first = ele.children[0]
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
                return ele
            }
          }
          return ele
        }

        return node
      })
    }
  })
}
