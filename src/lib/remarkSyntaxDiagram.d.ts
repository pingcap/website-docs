// @prantlf/railroad-diagrams JSON types

type RRComponent = RRLeaf | RRSkip | RRSeq | RRChoice | RROptional | RROneOrMore

interface RRDiagram {
  type: 'Diagram'
  items: RRComponent[]
}

interface RRLeaf {
  type: 'Terminal' | 'NonTerminal'
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
