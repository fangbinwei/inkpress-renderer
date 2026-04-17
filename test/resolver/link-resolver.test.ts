import { describe, it, expect } from 'vitest'
import { createLinkResolver } from '../../src/resolver/link-resolver.js'

describe('LinkResolver', () => {
  const publishedPages = new Map<string, string>([
    ['notes/normal', 'notes/normal.html'],
    ['notes/with-wikilink', 'notes/with-wikilink.html'],
    ['guides/setup', 'guides/setup.html'],
  ])

  const resolver = createLinkResolver(publishedPages)

  it('resolves a wikilink to a known page', () => {
    const result = resolver.resolve(
      { type: 'wikilink', target: 'normal', isEmbed: false, line: 5 },
      'notes/with-wikilink.md'
    )
    expect(result.resolved).toBe(true)
    expect(result.href).toBe('normal.html')
  })

  it('resolves a cross-directory wikilink', () => {
    const result = resolver.resolve(
      { type: 'wikilink', target: 'setup', isEmbed: false, line: 3 },
      'notes/with-wikilink.md'
    )
    expect(result.resolved).toBe(true)
    expect(result.href).toBe('../guides/setup.html')
  })

  it('marks unresolvable wikilinks as dead', () => {
    const result = resolver.resolve(
      { type: 'wikilink', target: 'missing-note', isEmbed: false, line: 7 },
      'notes/with-wikilink.md'
    )
    expect(result.resolved).toBe(false)
    expect(result.href).toBeNull()
  })

  it('collects dead links', () => {
    const r = createLinkResolver(publishedPages)
    r.resolve({ type: 'wikilink', target: 'missing', isEmbed: false, line: 3 }, 'notes/test.md')
    r.resolve({ type: 'wikilink', target: 'also-missing', isEmbed: false, line: 8 }, 'notes/test.md')
    expect(r.getDeadLinks()).toHaveLength(2)
    expect(r.getDeadLinks()[0]).toEqual({ sourcePath: 'notes/test.md', targetLink: 'missing', line: 3 })
  })

  it('resolves wikilink with path prefix', () => {
    const result = resolver.resolve(
      { type: 'wikilink', target: 'notes/normal', isEmbed: false, line: 1 },
      'guides/setup.md'
    )
    expect(result.resolved).toBe(true)
    expect(result.href).toBe('../notes/normal.html')
  })
})
