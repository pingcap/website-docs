const replaceStream = require('replacestream')

const frontMatter = /^---(.|\n)*---\n/
const media = /\(\/?media\//g
const copyable = /{{< copyable\s+(.+)\s+>}}\r?\n/g
const tabsPanel = /{{< tabs-panel\s+(.+)\s+>}}\n/g

/**
 * Replace front matter.
 *
 * @param {string} str
 * @param {string} replaced
 * @return {string}
 */
function replaceFrontMatter(str, replaced) {
  return str.replace(frontMatter, replaced)
}

function replaceImagePath(str, replaced) {
  return str.replace(media, `(${replaced}/`)
}

function replaceCopyable(str, replaced) {
  return str.replace(copyable, replaced)
}

function replaceImagePathStream(replaced) {
  return replaceStream(media, `(${replaced}/`)
}

function replaceCopyableStream() {
  return replaceStream(copyable, function (_, p1) {
    // return `<WithCopy tag=${p1} />\n`
    // ! WithCopy is deprecated!
    return ``
  })
}

module.exports = {
  replaceFrontMatter,
  replaceImagePath,
  replaceCopyable,
  replaceStream,
  replaceImagePathStream,
  replaceCopyableStream,
}
