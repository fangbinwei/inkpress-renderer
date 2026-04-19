import { describe, expect, it } from 'vitest'
import { renderPage } from '../../src/generator/html-renderer.js'

describe('renderPage', () => {
  it('renders basic markdown to HTML fragment with heading ids', async () => {
    const result = await renderPage({
      markdown: '# Hello\n\nA paragraph.',
      sourcePath: 'notes/test.md',
      resolveLink: () => ({ resolved: false, href: null }),
      resolveImage: () => null,
      deadLinkPolicy: 'silent',
    })
    expect(result.html).toContain('<h1 id="hello">Hello</h1>')
    expect(result.html).toContain('<p>A paragraph.</p>')
    expect(result.headings).toEqual([
      { level: 1, text: 'Hello', slug: 'hello' },
    ])
  })

  it('adds stable ids to multiple headings', async () => {
    const result = await renderPage({
      markdown: '## Introduction\n\nText.\n\n### Details\n\nMore text.',
      sourcePath: 'notes/test.md',
      resolveLink: () => ({ resolved: false, href: null }),
      resolveImage: () => null,
      deadLinkPolicy: 'silent',
    })
    expect(result.html).toContain('<h2 id="introduction">Introduction</h2>')
    expect(result.html).toContain('<h3 id="details">Details</h3>')
    expect(result.headings).toHaveLength(2)
  })

  it('deduplicates heading slugs', async () => {
    const result = await renderPage({
      markdown:
        '## Example\n\nFirst.\n\n## Example\n\nSecond.\n\n## Example\n\nThird.',
      sourcePath: 'notes/test.md',
      resolveLink: () => ({ resolved: false, href: null }),
      resolveImage: () => null,
      deadLinkPolicy: 'silent',
    })
    expect(result.headings[0].slug).toBe('example')
    expect(result.headings[1].slug).toBe('example-1')
    expect(result.headings[2].slug).toBe('example-2')
    expect(result.html).toContain('id="example"')
    expect(result.html).toContain('id="example-1"')
    expect(result.html).toContain('id="example-2"')
  })

  it('highlights fenced code blocks with language', async () => {
    const result = await renderPage({
      markdown: '```javascript\nconst x = 1;\n```',
      sourcePath: 'notes/test.md',
      resolveLink: () => ({ resolved: false, href: null }),
      resolveImage: () => null,
      deadLinkPolicy: 'silent',
    })
    // shiki produces spans with style attributes for dual-theme
    expect(result.html).toContain('<span')
    expect(result.html).toContain('const')
  })

  it('renders code blocks without language as plain pre/code', async () => {
    const result = await renderPage({
      markdown: '```\nplain text\n```',
      sourcePath: 'notes/test.md',
      resolveLink: () => ({ resolved: false, href: null }),
      resolveImage: () => null,
      deadLinkPolicy: 'silent',
    })
    // no language class → no shiki processing, rendered as plain <pre><code>
    expect(result.html).toContain('<pre>')
    expect(result.html).toContain('plain text')
  })

  it('replaces wikilinks with resolved HTML links', async () => {
    const result = await renderPage({
      markdown: 'See [[other-note]] for info.',
      sourcePath: 'notes/test.md',
      resolveLink: target => {
        if (target === 'other-note')
          return { resolved: true, href: 'other-note.html' }
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
      resolveImage: target =>
        target === 'photo.png' ? 'assets/photo.png' : null,
      deadLinkPolicy: 'silent',
    })
    expect(result.html).toContain('<img src="assets/photo.png"')
  })
})
