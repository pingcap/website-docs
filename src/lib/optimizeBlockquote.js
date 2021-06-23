export default function optimizeBlockquote() {
  const blockquoteList = document.getElementsByTagName('blockquote')

  const addStyleToQuote = (quote, type) => {
    quote.classList.add('doc-blockquote')
    quote.classList.add(type)
  }

  Array.from(blockquoteList).forEach((quote) => {
    if (quote.children[0] && quote.children[0].children[0]) {
      const labelText = quote.children[0].children[0].innerHTML

      switch (labelText) {
        case 'Note:':
        case '注意：':
          addStyleToQuote(quote, 'note')
          break
        case 'Warning:':
        case '警告：':
          addStyleToQuote(quote, 'warning')
          break
        case 'Tip:':
        case '建议：':
          addStyleToQuote(quote, 'tip')
          break
        case 'Error:':
        case '错误：':
          addStyleToQuote(quote, 'error')
          break
        default:
          break
      }
    }
  })
}
