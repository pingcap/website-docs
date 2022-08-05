const rr = require('@prantlf/railroad-diagrams')
const pegjs = require('pegjs')
const anafanafo = require('anafanafo')
import { Root } from 'mdast'
import visit from 'unist-util-visit'

rr.Options.INTERNAL_ALIGNMENT = 'left'

// @prantlf/railroad-diagrams JSON types

type RRComponent = RRLeaf | RRSkip | RRSeq | RRChoice | RROptional | RROneOrMore

interface RRDiagram {
  type: 'Diagram'
  items: RRComponent[]
}

interface RRLeaf {
  type: 'Terminal' | 'NonTerminal' | 'Comment'
  text: string
}

interface RRSkip {
  type: 'Skip'
}

interface RRSeq {
  type: 'Sequence' | 'Stack' | 'OptionalSequence'
  items: RRComponent[]
}

interface RRChoice {
  type: 'Choice'
  normalIndex: 0
  options: RRComponent[]
}

interface RROptional {
  type: 'Optional'
  item: RRComponent
}

interface RROneOrMore {
  type: 'OneOrMore'
  item: RRComponent
  repeat: RRComponent
}

interface CalculatedWidth {
  width: number
}

/**
 * The scale factor to convert the `anafanafo` width into display with for
 * NonTerminal nodes (12px Verdana).
 */
const NON_TERMINAL_WIDTH_FACTOR = 12 / 110
/**
 * The scale factor to convert the `anafanafo` width into display with for
 * Terminal nodes (12px Verdana bold).
 */
const TERMINAL_WIDTH_FACTOR = NON_TERMINAL_WIDTH_FACTOR * 1.2

const ebnfParser = pegjs.generate(`
  grammar = p:(_ production _)+ {
    return p.map(d => d[1]);
  }

  production = n:nonTerminal _ '::=' _ content:choice {
    return {name: n.text, content};
  }

  choice = f:seq r:(_ '|' _ seq)* {
    let opts = [f]
    r.forEach(n => options.context.appendNodeToChoices(opts, n[3]));
    return opts.length > 1 ? {type: 'Choice', normalIndex: 0, options: opts} : opts[0];
  }

  seq = f:item r:(_ item)* {
    let items = [f];
    r.forEach(n => options.context.appendNodeToSequence(items, n[1]));
    return items.length > 1 ? {type: 'Sequence', items} : items[0];
  }

  item = p:primary _ k:[*+?]? {
    switch (k) {
    case '?':
      return {type: 'Optional', item: p};
    case '+':
      return {type: 'OneOrMore', item: p, repeat: {type: 'Skip'}};
    case '*':
      return options.context.isRTLCapable(p) ?
        {type: 'OneOrMore', item: {type: 'Skip'}, repeat: p} :
        {type: 'Optional', item: {type: 'OneOrMore', item: p, repeat: {type: 'Skip'}}};
    default:
      return p;
    }
  }

  primary = terminal
    / n:nonTerminal !(_ '::=') { return n }
    / '(' _ c:choice _ ')' { return c }

  terminal = ('"' [^"]* '"' / "'" [^']* "'") {
    const t = text();
    return {type: 'Terminal', text: t.substr(1, t.length - 2)};
  }

  nonTerminal = [0-9a-zA-Z_]+ {
    return {type: 'NonTerminal', text: text()};
  }
  _ = [ \\n\\r\\t]*
`)

const railroadParser = pegjs.generate(`
  grammar = 'Diagram('_ its:items _')' {
    return [{type: 'Sequence', items: its}];
  }

  items = its:(_ item _',')* {
    return its.map(i => i[1]);
  }

  item = n:nonTerminal { return n }
    / c:comment { return c }
    / s:seq { return s }
    / c:choice { return c }
    / o:oneormore { return o }
    / o:opt { return o }

  seq = s:stack { return s }
    / s:sequence { return s }
    / ops:opSequence { return ops }

  nonTerminal = 'NonTerminal(' _ '"' t:[^"]* '"' _ ')' {
    return {type: 'NonTerminal', text: t.join('')};
  }

  comment = 'Comment(' _ '"' t:[^"]* '"' _ ')' {
    return {type: 'Comment', text: t.join('')};
  }

  stack = 'Stack(' _ its: items _ ')' {
    return {type: 'Stack', items: its};
  }

  sequence = 'Sequence(' _ its: items _ ')' {
    return {type: 'Sequence', items: its};
  }

  opSequence = 'OptionalSequence(' _ its: items _ ')' {
    return {type: 'OptionalSequence', items: its};
  }

  choice = 'Choice(' _ n: [0-9]+ _ ','_ its: items _ ')' {
    return {type: 'Choice', normalIndex: n, options: its};
  }

  oneormore = 'OneOrMore(' _ i: item _ ',' _ r: item _ ',' _ ')' {
    return {type: 'OneOrMore', item: i, repeat: r};
  }

  opt = 'Optional(' _ '"' t:[^"]* '"' _ ')' {
    return {type: 'Optional', item: {type: 'NonTerminal', text: t.join('')}};
  }

  _ = [ \\n\\r\\t]*
`)

/**
 * Checks if two EBNF nodes are equivalent.
 *
 * @param {RRComponent} a -
 *  first node
 * @param {RRComponent} b -
 *  second node
 * @returns {boolean} whether the two nodes are the same.
 */
function deepEq<T extends RRComponent>(a: T, b: T): boolean {
  if (a.type !== b.type) {
    return false
  }

  let aa: RRComponent[]
  let bb: RRComponent[]
  switch (a.type) {
    case 'Skip':
      return true
    case 'Terminal':
    case 'NonTerminal':
      return a.text === (b as RRLeaf).text
    case 'Optional':
      return deepEq(a.item, (b as RROptional).item)
    case 'OneOrMore':
      return (
        deepEq(a.item, (b as RROneOrMore).item) &&
        deepEq(a.repeat, (b as RROneOrMore).repeat)
      )
    case 'Choice':
      aa = a.options
      bb = (b as RRChoice).options
      break
    case 'Sequence':
    case 'OptionalSequence':
    case 'Stack':
      aa = a.items
      bb = (b as RRSeq).items
      break
  }
  return aa.length === bb.length && aa.every((n, i) => deepEq(n, bb[i]))
}

/**
 * Checks whether the component can be read from right to left. This also means
 * the component is only one node wide.
 *
 * @param {RRComponent} a -
 *  the railroad component
 * @returns {boolean} whether the component can be read from right to left
 */
function isRTLCapable(a: RRComponent): boolean {
  switch (a.type) {
    case 'Skip':
    case 'Terminal':
    case 'NonTerminal':
      return true
    case 'Optional':
      return isRTLCapable(a.item)
    case 'OneOrMore':
      return isRTLCapable(a.item) && isRTLCapable(a.repeat)
    case 'Choice':
      return a.options.every(isRTLCapable)
    case 'Sequence':
    case 'OptionalSequence':
    case 'Stack':
      const length = a.items.length
      return length === 1 ? isRTLCapable(a.items[0]) : length === 0
  }
}

/**
 * Appends an EBNF node to a Choice container.
 *
 * This function will also try to optimize the pattern `a | a? b` or `b? | a b?`
 * into the specialized railroad component `OptionalSequence(a, b)`.
 *
 * @param {RRComponent[]} opts -
 *  a list of existing choices, the new node will be appended here
 * @param {RRComponent} node -
 *  the current node to be added
 */
function appendNodeToChoices(opts: RRComponent[], node: RRComponent) {
  if (node.type === 'Sequence' && node.items.length >= 2) {
    const a = node.items[0]
    const b = node.items[node.items.length - 1]
    const last = opts[opts.length - 1]
    /** @type {RRComponent[]?} */
    let optItems = undefined
    if (a.type === 'Optional' && deepEq(a.item, last)) {
      node.items.shift()
      optItems = [last, node]
    }
    if (!optItems && b.type === 'Optional' && deepEq(b.item, last)) {
      node.items.pop()
      optItems = [node, last]
    }
    if (optItems) {
      opts[opts.length - 1] = { type: 'OptionalSequence', items: optItems }
      return
    }
  }
  opts.push(node)
}

/**
 * Appends an EBNF node to a Sequence container.
 *
 * This function will also try to optimize the pattern `a (b a)*` into the
 * specialized railroad component `OneOrMore(item=a, repeat=b)`, if the node
 * `b` is capable to be read RTL (e.g. a single terminal, but not a sequence).
 *
 * @param {} items -
 *  a list of existing items, the new node will be appended here
 * @param {} node -
 *  the current node to be added
 */
function appendNodeToSequence(items: RRComponent[], node: RRComponent) {
  if (
    node.type === 'Optional' &&
    node.item.type === 'OneOrMore' &&
    node.item.repeat.type === 'Skip' &&
    node.item.item.type === 'Sequence' &&
    node.item.item.items.length === 2
  ) {
    const left = items[items.length - 1]
    const [repeat, right] = node.item.item.items
    if (isRTLCapable(repeat) && deepEq(left, right)) {
      items[items.length - 1] = {
        type: 'OneOrMore',
        item: left,
        repeat,
      }
      return
    }
  }
  items.push(node)
}

// Replace the shape of "Start" and "End" to mimic https://www.bottlecaps.de/rr/ui.
rr.Start.prototype.format = function (x: number, y: number) {
  let path = new rr.Path(x, y - 4)
  path.attrs.d += 'v8l8-4Zm8 0v8l8-4Zm8 4h4' // ▶▶-
  path.attrs.class = 'start-end'
  path.addTo(this)
  return this
}
rr.End.prototype.format = function (x: number, y: number) {
  this.attrs.d = `M${x} ${y}h4m0-4v8l16-8v8Z` // -▶◀
  this.attrs.class = 'start-end'
  return this
}

/**
 * Similar to `rr.Diagram.fromJSON` except that the width of Terminal and
 * NonTerminal are measured using a proportional font.
 *
 * FIXME: remove this function if prantlf/railroad-diagrams#1 is accepted and
 * published.
 *
 * @param {RRComponent} node -
 *  the root node
 * @returns {rr.FakeSVG} the converted node
 */
function toRailroad(node: RRComponent): void {
  switch (node.type) {
    case 'Skip':
      return new rr.Skip()
    case 'Terminal': {
      let t = new rr.Terminal(node.text)
      t.width = Math.round(anafanafo(node.text) * TERMINAL_WIDTH_FACTOR) + 20
      return t
    }
    case 'NonTerminal': {
      let nt = new rr.NonTerminal(node.text)
      nt.width =
        Math.round(anafanafo(node.text) * NON_TERMINAL_WIDTH_FACTOR) + 20
      return nt
    }
    case 'Comment':
      return new rr.Comment(node.text)
    case 'Optional':
      return new rr.Optional(toRailroad(node.item))
    case 'OneOrMore':
      return new rr.OneOrMore(toRailroad(node.item), toRailroad(node.repeat))
    case 'Choice':
      return new rr.Choice(0, ...node.options.map(toRailroad))
    case 'OptionalSequence':
      return new rr.OptionalSequence(...node.items.map(toRailroad))
    case 'Sequence':
      return new rr.Sequence(...node.items.map(toRailroad))
    case 'Stack':
      return new rr.Stack(...node.items.map(toRailroad))
  }
}

const parsers: {
  [key: string]: {
    lang: String,
    inner: (node: any) => any,
  }
} = {
  'ebnf+diagram': {
    lang: 'ebnf',
    inner: (node: any) => {
      const grammar = ebnfParser.parse(node.value, {
        context: {
          appendNodeToChoices,
          appendNodeToSequence,
          isRTLCapable,
        },
      })
      const diagrams = grammar
        .map(({ name, content }: any) => {
          const diagram = new rr.Diagram(toRailroad(content)).format(2)
          return `<dt>${name}</dt><dd>${diagram}</dd>`
        })
        .join('')

      return [
        { type: 'jsx', value: '<SyntaxDiagram>' },
        { type: 'html', value: `<dl>${diagrams}</dl>` },
        node,
        { type: 'jsx', value: '</SyntaxDiagram>' },
      ]
    }
  },
  'railroad+diagram' : {
    lang: 'railroad',
    inner: (node: any) => {
      const grammar = railroadParser.parse(node.value, {
        context: {
          appendNodeToChoices,
          appendNodeToSequence,
          isRTLCapable,
        },
      })
      const diagrams = grammar
        .map((node: any) => {
          const diagram = new rr.Diagram(toRailroad(node)).format(2)
          return `<dd>${diagram}</dd>`
        })
        .join('')

      return [
        { type: 'jsx', value: '<SyntaxDiagram>' },
        { type: 'html', value: `<dl>${diagrams}</dl>` },
        node,
        { type: 'jsx', value: '</SyntaxDiagram>' },
      ]
    }
  }
}

module.exports = ({
  markdownAST,
  markdownNode,
}: {
  markdownAST: Root
  markdownNode: { fileAbsolutePath: string }
}) =>
  visit(markdownAST, (node: any) => {
    if (Array.isArray(node.children)) {
      node.children = node.children.flatMap((node: any) => {
        const parser = parsers[node.lang]
        if (node.type === 'code' && parser) {
          node.lang = parser.lang
          try {
            return parser.inner(node)
          } catch (e) {
            console.error(`invalid ${parser.lang}`, e, markdownNode.fileAbsolutePath)
          }
        }
        return node
      })
    }
  })
