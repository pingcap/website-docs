const replaceStream = require('replacestream')

const frontMatter = /^---(.|\n)*---\n/
const media = /\(\/?media\//g

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

function replaceFrontMatterStream(replaced) {
  return replaceStream(frontMatter, replaced)
}

function replaceImagePathStream(replaced) {
  return replaceStream(media, `(${replaced}/`)
}

module.exports = {
  replaceFrontMatter,
  replaceImagePath,
  replaceStream,
  replaceFrontMatterStream,
  replaceImagePathStream,
}
