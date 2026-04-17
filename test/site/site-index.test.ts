import { describe, it, expect } from 'vitest'
import { buildSiteIndex } from '../../src/site/site-index.js'
import type { ParsedPage } from '../../src/types.js'

describe('buildSiteIndex', () => {
  it('builds site index from parsed pages', () => {
    const pages: ParsedPage[] = [
      {
        sourcePath: 'notes/normal.md',
        publishPath: 'notes/normal.html',
        title: 'Normal Note',
        frontmatter: { tags: ['test'] },
        rawLinks: [{ type: 'wikilink', target: 'setup', isEmbed: false, line: 3 }],
        headings: [
          { level: 1, text: 'Normal Note', slug: 'normal-note' },
          { level: 2, text: 'Details', slug: 'details' },
        ],
        htmlContent: '<h1>Normal Note</h1>',
      },
      {
        sourcePath: 'guides/setup.md',
        publishPath: 'guides/setup.html',
        title: 'Setup Guide',
        frontmatter: {},
        rawLinks: [],
        headings: [{ level: 1, text: 'Setup Guide', slug: 'setup-guide' }],
        htmlContent: '<h1>Setup Guide</h1>',
      },
    ]
    const resolvedOutlinks = new Map<string, string[]>([
      ['notes/normal.html', ['guides/setup.html']],
      ['guides/setup.html', []],
    ])
    const index = buildSiteIndex(pages, resolvedOutlinks)
    expect(index.pages).toHaveLength(2)
    expect(index.pages[0].path).toBe('notes/normal.html')
    expect(index.pages[0].outlinks).toEqual(['guides/setup.html'])
    expect(index.pages[0].headings).toHaveLength(2)
    expect(index.navTree.children).toHaveLength(2)
    expect(index.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})
