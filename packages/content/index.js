const replaceStream = require('replacestream')

const frontMatter = /^---(.|\n)*---\n/

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

function replaceFrontMatterStream(replaced) {
  return replaceStream(frontMatter, replaced)
}

module.exports = {
  replaceFrontMatter,
  replaceStream,
  replaceFrontMatterStream,
}
