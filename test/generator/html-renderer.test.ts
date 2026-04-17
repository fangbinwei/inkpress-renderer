import { describe, it, expect } from 'vitest'
import { renderPage } from '../../src/generator/html-renderer.js'

describe('renderPage', () => {
  it('renders basic markdown to HTML fragment', async () => {
    const result = await renderPage({
      markdown: '# Hello\n\nA paragraph.',
      sourcePath: 'notes/test.md',
      resolveLink: () => ({ resolved: false, href: null }),
      resolveImage: () => null,
      deadLinkPolicy: 'silent',
    })
    expect(result.html).toContain('<h1>Hello</h1>')
    expect(result.html).toContain('<p>A paragraph.</p>')
    expect(result.headings).toEqual([{ level: 1, text: 'Hello', slug: 'hello' }])
  })

  it('replaces wikilinks with resolved HTML links', async () => {
    const result = await renderPage({
      markdown: 'See [[other-note]] for info.',
      sourcePath: 'notes/test.md',
      resolveLink: (target) => {
        if (target === 'other-note') return { resolved: true, href: 'other-note.html' }
        return { resolved: false, href: null }
      },
      resolveImage: () => null,
      deadLinkPolicy: 'silent',
    })
    expect(result.html).toContain('<a href="other-note.html">other-note</a>')
  })

  it('replaces wikilinks with display text', async () => {
    const result = await renderPage({
      markdown: 'See [[other-note|Other Note]] for info.',
      sourcePath: 'notes/test.md',
      resolveLink: () => ({ resolved: true, href: 'other-note.html' }),
      resolveImage: () => null,
      deadLinkPolicy: 'silent',
    })
    expect(result.html).toContain('<a href="other-note.html">Other Note</a>')
  })

  it('renders dead wikilinks as plain text when policy is silent', async () => {
    const result = await renderPage({
      markdown: 'See [[missing-note]] here.',
      sourcePath: 'notes/test.md',
      resolveLink: () => ({ resolved: false, href: null }),
      resolveImage: () => null,
      deadLinkPolicy: 'silent',
    })
    expect(result.html).not.toContain('<a')
    expect(result.html).toContain('missing-note')
  })

  it('renders dead wikilinks with dead-link class when policy is marked', async () => {
    const result = await renderPage({
      markdown: 'See [[missing-note]] here.',
      sourcePath: 'notes/test.md',
      resolveLink: () => ({ resolved: false, href: null }),
      resolveImage: () => null,
      deadLinkPolicy: 'marked',
    })
    expect(result.html).toContain('class="dead-link"')
    expect(result.html).toContain('missing-note')
  })

  it('resolves wikilink images', async () => {
    const result = await renderPage({
      markdown: 'Image: ![[photo.png]]',
      sourcePath: 'notes/test.md',
      resolveLink: () => ({ resolved: false, href: null }),
      resolveImage: (target) => target === 'photo.png' ? 'assets/photo.png' : null,
      deadLinkPolicy: 'silent',
    })
    expect(result.html).toContain('<img src="assets/photo.png"')
  })
})
