const replaceStream = require('replacestream')

const frontMatter = /^---(.|\n)*---\n/
const media = /\(\/?media\//g
const copyable = /{{< copyable.*}}\n/g

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

module.exports = {
  replaceFrontMatter,
  replaceImagePath,
  replaceCopyable,
  replaceStream,
  replaceImagePathStream,
}
