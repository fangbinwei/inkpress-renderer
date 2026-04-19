import { describe, expect, it } from 'vitest'
import { createLinkResolver } from '../../src/resolver/link-resolver.js'

describe('LinkResolver', () => {
  const publishedPages = new Map<string, string>([
    ['notes/normal', 'notes/normal.html'],
    ['notes/with-wikilink', 'notes/with-wikilink.html'],
    ['guides/setup', 'guides/setup.html'],
    ['wiki/entities/_index', 'wiki/entities/_index.html'],
  ])

  const resolver = createLinkResolver(publishedPages)

  it('resolves a wikilink to a known page', () => {
    const result = resolver.resolve(
      { type: 'wikilink', target: 'normal', isEmbed: false, line: 5 },
      'notes/with-wikilink.md',
    )
    expect(result.resolved).toBe(true)
    expect(result.href).toBe('normal.html')
  })

  it('resolves a cross-directory wikilink', () => {
    const result = resolver.resolve(
      { type: 'wikilink', target: 'setup', isEmbed: false, line: 3 },
      'notes/with-wikilink.md',
    )
    expect(result.resolved).toBe(true)
    expect(result.href).toBe('../guides/setup.html')
  })

  it('strips .md suffix from target when matching', () => {
    const result = resolver.resolve(
      { type: 'wikilink', target: 'notes/normal.md', isEmbed: false, line: 1 },
      'guides/setup.md',
    )
    expect(result.resolved).toBe(true)
    expect(result.href).toBe('../notes/normal.html')
  })

  it('resolves path-style target relative to source directory', () => {
    // From wiki/log.md the link [[entities/_index]] should hit wiki/entities/_index
    const pages = new Map([
      ['wiki/entities/_index', 'wiki/entities/_index.html'],
    ])
    const r = createLinkResolver(pages)
    const result = r.resolve(
      { type: 'wikilink', target: 'entities/_index', isEmbed: false, line: 10 },
      'wiki/log.md',
    )
    expect(result.resolved).toBe(true)
    expect(result.href).toBe('entities/_index.html')
  })

  it('marks unresolvable wikilinks as dead', () => {
    const result = resolver.resolve(
      { type: 'wikilink', target: 'missing-note', isEmbed: false, line: 7 },
      'notes/with-wikilink.md',
    )
    expect(result.resolved).toBe(false)
    expect(result.href).toBeNull()
  })

  it('collects dead links with reason=target-missing when no vault index', () => {
    const r = createLinkResolver(publishedPages)
    r.resolve(
      { type: 'wikilink', target: 'missing', isEmbed: false, line: 3 },
      'notes/test.md',
    )
    const dead = r.getDeadLinks()
    expect(dead).toHaveLength(1)
    expect(dead[0]).toMatchObject({
      sourcePath: 'notes/test.md',
      targetLink: 'missing',
      line: 3,
      reason: 'target-missing',
    })
    expect(dead[0].hint).toMatch(/no file named/)
  })

  it('classifies .excalidraw as unsupported-asset', () => {
    const r = createLinkResolver(publishedPages)
    r.resolve(
      {
        type: 'wikilink',
        target: 'diagram.excalidraw',
        isEmbed: false,
        line: 5,
      },
      'notes/test.md',
    )
    const dead = r.getDeadLinks()
    expect(dead[0].reason).toBe('unsupported-asset')
    expect(dead[0].hint).toMatch(/not rendered/)
  })

  it('classifies not-published when file exists in vault but outside publishDirs', () => {
    const vaultIndex: VaultFileIndex = {
      unpublishedMd: new Set(['raw/articles/Skill Issue']),
      unpublishedMdByBasename: new Map([
        ['Skill Issue', ['raw/articles/Skill Issue']],
      ]),
      assets: new Set(),
      assetsByBasename: new Map(),
    }
    const r = createLinkResolver(publishedPages, vaultIndex)
    r.resolve(
      {
        type: 'wikilink',
        target: 'raw/articles/Skill Issue.md',
        isEmbed: false,
        line: 8,
      },
      'notes/test.md',
    )
    const dead = r.getDeadLinks()
    expect(dead[0].reason).toBe('not-published')
    expect(dead[0].hint).toMatch(/publishDirs/)
  })

  it('classifies ambiguous when multiple unpublished files share basename', () => {
    const vaultIndex: VaultFileIndex = {
      unpublishedMd: new Set(['foo/note', 'bar/note']),
      unpublishedMdByBasename: new Map([['note', ['foo/note', 'bar/note']]]),
      assets: new Set(),
      assetsByBasename: new Map(),
    }
    const r = createLinkResolver(publishedPages, vaultIndex)
    r.resolve(
      { type: 'wikilink', target: 'note', isEmbed: false, line: 1 },
      'notes/test.md',
    )
    const dead = r.getDeadLinks()
    expect(dead[0].reason).toBe('ambiguous')
  })

  it('lookup resolves without recording dead links', () => {
    const r = createLinkResolver(publishedPages)
    const result = r.lookup('nonexistent', 'notes/test.md')
    expect(result.resolved).toBe(false)
    expect(r.getDeadLinks()).toHaveLength(0)

    const found = r.lookup('normal', 'notes/test.md')
    expect(found.resolved).toBe(true)
    expect(found.href).toBe('normal.html')
  })
})
