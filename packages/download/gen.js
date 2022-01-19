import {
  replaceCopyable,
  replaceFrontMatter,
  replaceImagePath,
} from '@pingcap/docs-content'

import { fromMarkdown } from 'mdast-util-from-markdown'
import fs from 'fs'
import path from 'path'
import sig from 'signale'

/**
 * Generate content from a outline.
 *
 * @param {string} repo
 * @param {string} from
 * @param {string} to
 */
export function genContentFromOutline(repo, from, to) {
  const ws = fs.createWriteStream(
    to || path.join(path.dirname(from), 'output.md'),
    {
      flags: 'a',
    }
  )

  function recurAppendDocs(list) {
    list.children.forEach(listItem => {
      if (listItem.type === 'list') {
        recurAppendDocs(listItem)
      } else {
        listItem.children.forEach(({ type, children }) => {
          switch (type) {
            case 'paragraph':
              switch (children[0].type) {
                case 'link':
                  const { url, children: text } = children[0]

                  if (isExternal(url)) {
                    ws.write('\n# ' + text[0].value + '\n\n' + url + '\n')

                    break
                  }

                  const rsPath = path
                    .join(path.dirname(from), repo, url)
                    .split('#')[0]
                  sig.info('Read', rsPath)
                  const file = replaceCopyable(
                    replaceImagePath(
                      replaceFrontMatter(
                        fs.readFileSync(rsPath).toString(),
                        ''
                      ),
                      `./${repo}/media`
                    ),
                    ''
                  )
                  ws.write(file)

                  break
                case 'text':
                  ws.write('\n# ' + children[0].value + '\n')

                  break
              }

              break
            case 'list':
              recurAppendDocs(listItem)

              break
          }
        })
      }
    })
  }

  fs.readFile(from, (err, data) => {
    if (err) {
      throw err
    }

    const tree = fromMarkdown(data)
    const list = tree.children.find(d => d.type === 'list')

    recurAppendDocs(list)
  })
}

function isExternal(url) {
  return /^https?.*/.test(url)
}
