import { describe, expect, it } from 'vitest'
import { highlightCode } from '../../src/generator/highlight.js'

describe('highlightCode', () => {
  it('highlights JavaScript code', async () => {
    const html = await highlightCode('const x = 1;', 'javascript')
    expect(html).toContain('<span')
    expect(html).toContain('const')
  })

  it('highlights Python code', async () => {
    const html = await highlightCode('def hello():\n    pass', 'python')
    expect(html).toContain('<span')
    expect(html).toContain('def')
  })

  it('returns plain text for unknown language', async () => {
    const html = await highlightCode('plain text here', 'unknownlang')
    expect(html).toContain('plain text here')
  })

  it('returns plain text when no language specified', async () => {
    const html = await highlightCode('no lang', '')
    expect(html).toContain('no lang')
  })
})
