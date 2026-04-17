import { describe, it, expect } from 'vitest'
import { parseMarkdown } from '../../src/parser/markdown.js'

describe('parseMarkdown', () => {
  it('renders basic markdown to HTML', async () => {
    const html = await parseMarkdown('# Hello\n\nA paragraph with **bold**.')
    expect(html).toContain('<h1>Hello</h1>')
    expect(html).toContain('<strong>bold</strong>')
  })

  it('renders lists', async () => {
    const html = await parseMarkdown('- item 1\n- item 2')
    expect(html).toContain('<ul>')
    expect(html).toContain('<li>item 1</li>')
  })

  it('renders blockquotes', async () => {
    const html = await parseMarkdown('> A quote')
    expect(html).toContain('<blockquote>')
  })

  it('renders tables', async () => {
    const html = await parseMarkdown('| A | B |\n|---|---|\n| 1 | 2 |')
    expect(html).toContain('<table>')
    expect(html).toContain('<td>1</td>')
  })

  it('renders standard markdown links', async () => {
    const html = await parseMarkdown('[Example](https://example.com)')
    expect(html).toContain('<a href="https://example.com">Example</a>')
  })

  it('renders standard markdown images', async () => {
    const html = await parseMarkdown('![Alt](image.png)')
    expect(html).toContain('<img src="image.png" alt="Alt"')
  })

  it('renders code blocks with language annotation', async () => {
    const html = await parseMarkdown('```javascript\nconsole.log("hi")\n```')
    expect(html).toContain('<pre')
    expect(html).toContain('console')
  })

  it('extracts headings', async () => {
    const html = await parseMarkdown('## Introduction\n\n### Details')
    expect(html).toContain('<h2')
    expect(html).toContain('Introduction')
    expect(html).toContain('<h3')
  })
})
