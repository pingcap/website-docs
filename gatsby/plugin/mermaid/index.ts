import { Root } from 'mdast'
import visit from 'unist-util-visit'

module.exports = ({ markdownAST }: { markdownAST: Root }) => {
  visit(markdownAST, (node: any, index, parent: any) => {
    if (node.type !== 'code' || node.lang !== 'mermaid') return
    if (!parent || !Array.isArray(parent.children)) return

    parent.children[index] = {
      type: 'jsx',
      value: `<Mermaid value={${JSON.stringify(node.value)}} />`,
    }
  })
}
