const {
  deepEq,
  appendNodeToChoices,
  appendNodeToSequence,
  toRailroad,
  remarkSyntaxDiagram,
  isRTLCapable,
} = require('..')

describe('deepEq', () => {
  it('returns false when type differs', () => {
    expect(
      deepEq(
        { type: 'Terminal', text: 'a' },
        { type: 'NonTerminal', text: 'a' }
      )
    ).toBeFalsy()
  })
  it('can compare leaves', () => {
    expect(
      deepEq(
        { type: 'NonTerminal', text: 'a' },
        { type: 'NonTerminal', text: 'b' }
      )
    ).toBeFalsy()
    expect(
      deepEq(
        { type: 'NonTerminal', text: 'c' },
        { type: 'NonTerminal', text: 'c' }
      )
    ).toBeTruthy()
  })
  it('can compare Optional', () => {
    expect(
      deepEq(
        { type: 'Optional', item: { type: 'Terminal', text: 'a' } },
        { type: 'Optional', item: { type: 'Terminal', text: 'a' } }
      )
    ).toBeTruthy()
    expect(
      deepEq(
        { type: 'Optional', item: { type: 'Terminal', text: 'a' } },
        { type: 'Optional', item: { type: 'NonTerminal', text: 'a' } }
      )
    ).toBeFalsy()
  })
  it('can compare OneOrMore', () => {
    expect(
      deepEq(
        {
          type: 'OneOrMore',
          item: { type: 'Skip' },
          repeat: { type: 'Terminal', text: 'a' },
        },
        {
          type: 'OneOrMore',
          item: { type: 'Skip' },
          repeat: { type: 'Terminal', text: 'a' },
        }
      )
    ).toBeTruthy()
    expect(
      deepEq(
        {
          type: 'OneOrMore',
          item: { type: 'Skip' },
          repeat: { type: 'Terminal', text: 'a' },
        },
        {
          type: 'OneOrMore',
          item: { type: 'Terminal', text: 'a' },
          repeat: { type: 'Skip' },
        }
      )
    ).toBeFalsy()
  })
  it('can compare Choice', () => {
    expect(
      deepEq(
        {
          type: 'Choice',
          normalIndex: 0,
          options: [
            { type: 'Terminal', text: 'a' },
            { type: 'Terminal', text: 'b' },
          ],
        },
        {
          type: 'Choice',
          normalIndex: 0,
          options: [
            { type: 'Terminal', text: 'a' },
            { type: 'Terminal', text: 'b' },
          ],
        }
      )
    ).toBeTruthy()
    expect(
      deepEq(
        {
          type: 'Choice',
          normalIndex: 0,
          options: [
            { type: 'Terminal', text: 'a' },
            { type: 'Terminal', text: 'b' },
          ],
        },
        {
          type: 'Choice',
          normalIndex: 0,
          options: [
            { type: 'Terminal', text: 'a' },
            { type: 'Terminal', text: 'b' },
            { type: 'Terminal', text: 'c' },
          ],
        }
      )
    ).toBeFalsy()
    expect(
      deepEq(
        {
          type: 'Choice',
          normalIndex: 0,
          options: [
            { type: 'Terminal', text: 'a' },
            { type: 'Terminal', text: 'b' },
          ],
        },
        {
          type: 'Choice',
          normalIndex: 0,
          options: [
            { type: 'Terminal', text: 'a' },
            { type: 'Terminal', text: 'c' },
          ],
        }
      )
    ).toBeFalsy()
  })
  it('can compare Sequence', () => {
    expect(
      deepEq(
        {
          type: 'Sequence',
          items: [
            { type: 'Terminal', text: 'a' },
            { type: 'Terminal', text: 'b' },
          ],
        },
        {
          type: 'Sequence',
          items: [
            { type: 'Terminal', text: 'a' },
            { type: 'Terminal', text: 'b' },
          ],
        }
      )
    ).toBeTruthy()
    expect(
      deepEq(
        {
          type: 'Sequence',
          items: [
            { type: 'Terminal', text: 'a' },
            { type: 'Terminal', text: 'b' },
          ],
        },
        {
          type: 'Sequence',
          items: [
            { type: 'Terminal', text: 'a' },
            { type: 'Terminal', text: 'b' },
            { type: 'Terminal', text: 'c' },
          ],
        }
      )
    ).toBeFalsy()
    expect(
      deepEq(
        {
          type: 'Sequence',
          items: [
            { type: 'Terminal', text: 'a' },
            { type: 'Terminal', text: 'b' },
          ],
        },
        {
          type: 'Sequence',
          items: [
            { type: 'Terminal', text: 'b' },
            { type: 'Terminal', text: 'a' },
          ],
        }
      )
    ).toBeFalsy()
  })
  it('fails with unknown type', () => {
    expect(() =>
      deepEq(
        { type: '!@#$%^&*', exoticProperty: '????' },
        { type: '!@#$%^&*', exoticProperty: '????' }
      )
    ).toThrow()
  })
})

describe('isRTLCapable', () => {
  it('treats leaf nodes as RTL capable', () => {
    expect(isRTLCapable({ type: 'Terminal', text: 'a' })).toBeTruthy()
    expect(isRTLCapable({ type: 'NonTerminal', text: 'a' })).toBeTruthy()
    expect(isRTLCapable({ type: 'Skip' })).toBeTruthy()
  })
  it('treats sequences to be not RTL capable', () => {
    expect(
      isRTLCapable({
        type: 'Sequence',
        items: [
          { type: 'Terminal', text: 'a' },
          { type: 'Terminal', text: 'b' },
        ],
      })
    ).toBeFalsy()
    expect(
      isRTLCapable({
        type: 'OptionalSequence',
        items: [
          { type: 'Terminal', text: 'a' },
          { type: 'Terminal', text: 'b' },
        ],
      })
    ).toBeFalsy()
  })
  it('can see through choices', () => {
    expect(
      isRTLCapable({
        type: 'Choice',
        normalIndex: 0,
        options: [
          { type: 'Terminal', text: 'a' },
          { type: 'Terminal', text: 'b' },
        ],
      })
    ).toBeTruthy()
    expect(
      isRTLCapable({
        type: 'Choice',
        normalIndex: 0,
        options: [
          { type: 'Terminal', text: 'a' },
          {
            type: 'Sequence',
            items: [
              { type: 'Terminal', text: 'a' },
              { type: 'Terminal', text: 'b' },
            ],
          },
        ],
      })
    ).toBeFalsy()
  })
})

describe('appendNodeToChoices', () => {
  it('can recognize the `a | a? b` pattern', () => {
    let opts = [
      { type: 'Terminal', text: 'x' },
      { type: 'Terminal', text: 'a' },
    ]
    appendNodeToChoices(opts, {
      type: 'Sequence',
      items: [
        { type: 'Optional', item: { type: 'Terminal', text: 'a' } },
        { type: 'Terminal', text: 'b' },
        { type: 'Terminal', text: 'c' },
      ],
    })
    expect(opts).toEqual([
      { type: 'Terminal', text: 'x' },
      {
        type: 'OptionalSequence',
        items: [
          { type: 'Terminal', text: 'a' },
          {
            type: 'Sequence',
            items: [
              { type: 'Terminal', text: 'b' },
              { type: 'Terminal', text: 'c' },
            ],
          },
        ],
      },
    ])
  })
  it('can recognize the `b | a b?` pattern', () => {
    let opts = [
      { type: 'Terminal', text: 'x' },
      { type: 'Terminal', text: 'c' },
    ]
    appendNodeToChoices(opts, {
      type: 'Sequence',
      items: [
        { type: 'Optional', item: { type: 'Terminal', text: 'a' } },
        { type: 'Optional', item: { type: 'Terminal', text: 'b' } },
        { type: 'Optional', item: { type: 'Terminal', text: 'c' } },
      ],
    })
    expect(opts).toEqual([
      { type: 'Terminal', text: 'x' },
      {
        type: 'OptionalSequence',
        items: [
          {
            type: 'Sequence',
            items: [
              { type: 'Optional', item: { type: 'Terminal', text: 'a' } },
              { type: 'Optional', item: { type: 'Terminal', text: 'b' } },
            ],
          },
          { type: 'Terminal', text: 'c' },
        ],
      },
    ])
  })
  it('just appends without special patterns', () => {
    let opts = [
      { type: 'Terminal', text: 'x' },
      { type: 'Terminal', text: 'b' },
    ]
    appendNodeToChoices(opts, {
      type: 'Sequence',
      items: [
        { type: 'Terminal', text: '(' },
        { type: 'Optional', item: { type: 'Terminal', text: 'b' } },
        { type: 'Terminal', text: ')' },
      ],
    })
    expect(opts).toEqual([
      { type: 'Terminal', text: 'x' },
      { type: 'Terminal', text: 'b' },
      {
        type: 'Sequence',
        items: [
          { type: 'Terminal', text: '(' },
          { type: 'Optional', item: { type: 'Terminal', text: 'b' } },
          { type: 'Terminal', text: ')' },
        ],
      },
    ])
  })
})

describe('appendNodeToSequence', () => {
  it('can recognize the `a (b a)*` pattern', () => {
    let items = [
      { type: 'Terminal', text: 'x' },
      { type: 'Terminal', text: 'a' },
    ]
    appendNodeToSequence(items, {
      type: 'Optional',
      item: {
        type: 'OneOrMore',
        item: {
          type: 'Sequence',
          items: [
            { type: 'Terminal', text: ',' },
            { type: 'Terminal', text: 'a' },
          ],
        },
        repeat: { type: 'Skip' },
      },
    })
    expect(items).toEqual([
      { type: 'Terminal', text: 'x' },
      {
        type: 'OneOrMore',
        item: { type: 'Terminal', text: 'a' },
        repeat: { type: 'Terminal', text: ',' },
      },
    ])
  })
  it('just appends when repeating part is not RTL capable', () => {
    let items = [
      { type: 'Terminal', text: 'x' },
      { type: 'Terminal', text: 'a' },
    ]
    const tail = {
      type: 'Optional',
      item: {
        type: 'OneOrMore',
        item: {
          type: 'Sequence',
          items: [
            {
              type: 'Sequence',
              items: [
                { type: 'Terminal', text: 'AND' },
                { type: 'Terminal', text: 'THEN' },
              ],
            },
            { type: 'Terminal', text: 'a' },
          ],
        },
        repeat: { type: 'Skip' },
      },
    }
    appendNodeToSequence(items, tail)
    expect(items).toEqual([
      { type: 'Terminal', text: 'x' },
      { type: 'Terminal', text: 'a' },
      tail,
    ])
  })
  it('just appends without special patterns', () => {
    let items = [
      { type: 'Terminal', text: 'x' },
      { type: 'Terminal', text: 'a' },
    ]
    const tail = {
      type: 'Optional',
      item: {
        type: 'OneOrMore',
        item: {
          type: 'Sequence',
          items: [
            { type: 'Terminal', text: ',' },
            { type: 'Terminal', text: 'b' },
          ],
        },
        repeat: { type: 'Skip' },
      },
    }
    appendNodeToSequence(items, tail)
    expect(items).toEqual([
      { type: 'Terminal', text: 'x' },
      { type: 'Terminal', text: 'a' },
      tail,
    ])
  })
})

describe('toRailroad', () => {
  it('can handle Terminal width', () => {
    const node = toRailroad({ type: 'Terminal', text: 'PARTITION' })
    expect(node.width).toBe(101)
  })
  it('can handle NonTerminal width', () => {
    const node = toRailroad({ type: 'NonTerminal', text: 'PARTITION' })
    expect(node.width).toBe(87)
  })
  it('can handle width of composite object', () => {
    const node = toRailroad({
      type: 'Sequence',
      items: [
        { type: 'Terminal', text: 'PARTITION' },
        { type: 'NonTerminal', text: 'PARTITION' },
      ],
    })
    expect(node.width).toBe(208)
  })
})

describe('remarkSyntaxDiagram', () => {
  it('ignores ```ebnf blocks', () => {
    const src = {
      type: 'root',
      children: [
        { type: 'code', lang: 'ebnf', value: 'a ::= b' },
        { type: 'code', lang: null, value: 'c ::= d' },
      ],
    }
    expect(remarkSyntaxDiagram(src)).toEqual(src)
  })
  it('handles ```ebnf+diagram blocks', () => {
    expect(
      remarkSyntaxDiagram({
        type: 'root',
        children: [
          { type: 'thematicBreak' },
          { type: 'code', lang: 'ebnf+diagram', value: 'a ::= b' },
          { type: 'paragraph', children: [{ type: 'text', value: '????' }] },
        ],
      })
    ).toEqual({
      type: 'root',
      children: [
        { type: 'thematicBreak' },
        { type: 'jsx', value: '<SyntaxDiagram>' },
        {
          type: 'html',
          value: `<dl><dt>a</dt><dd><svg class="railroad-diagram" width="91" height="26" viewBox="0 0 91 26">
<g transform="translate(.5 .5)">
<g>
<path d="M2 9v8l8-4Zm8 0v8l8-4Zm8 4h4" class="start-end"></path>
</g>
<path d="M22 13h10"></path>
<g class="non-terminal">
<path d="M32 13h0"></path>
<path d="M59 13h0"></path>
<rect x="32" y="2" width="27" height="22"></rect>
<text x="45.5" y="17">b</text>
</g>
<path d="M59 13h10"></path>
<path d="M69 13h4m0-4v8l16-8v8Z" class="start-end"></path>
</g>
</svg>
</dd></dl>`,
        },
        { type: 'code', lang: 'ebnf', value: 'a ::= b' },
        { type: 'jsx', value: '</SyntaxDiagram>' },
        { type: 'paragraph', children: [{ type: 'text', value: '????' }] },
      ],
    })
  })
  it('generates multiple <svg>s for multiple productions', () => {
    expect(
      remarkSyntaxDiagram({
        type: 'root',
        children: [
          { type: 'code', lang: 'ebnf+diagram', value: 'a ::= b\nc ::= "def"' },
        ],
      })
    ).toEqual({
      type: 'root',
      children: [
        { type: 'jsx', value: '<SyntaxDiagram>' },
        {
          type: 'html',
          value: expect.stringMatching(
            /^<dl><dt>a<\/dt><dd><svg (.+?)<\/svg>\n<\/dd><dt>c<\/dt><dd><svg (.+?)<\/svg>\n<\/dd><\/dl>$/s
          ),
        },
        { type: 'code', lang: 'ebnf', value: 'a ::= b\nc ::= "def"' },
        { type: 'jsx', value: '</SyntaxDiagram>' },
      ],
    })
  })
  it('skip code blocks with syntax error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(
      remarkSyntaxDiagram({
        type: 'root',
        children: [
          { type: 'code', lang: 'ebnf+diagram', value: '::= syntax error' },
          {
            type: 'code',
            lang: 'ebnf+diagram',
            value: 'should ::= transform this',
          },
          {
            type: 'code',
            lang: 'ebnf+diagram',
            value: 'more syntax ::= error',
          },
        ],
      })
    ).toEqual({
      type: 'root',
      children: [
        { type: 'code', lang: 'ebnf+diagram', value: '::= syntax error' },
        { type: 'jsx', value: '<SyntaxDiagram>' },
        { type: 'html', value: expect.anything() },
        { type: 'code', lang: 'ebnf', value: 'should ::= transform this' },
        { type: 'jsx', value: '</SyntaxDiagram>' },
        { type: 'code', lang: 'ebnf+diagram', value: 'more syntax ::= error' },
      ],
    })

    expect(spy).toHaveBeenCalledTimes(2)
    spy.mockRestore()
  })
})
