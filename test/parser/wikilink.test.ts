import { describe, it, expect } from 'vitest'
import { parseWikilinks } from '../../src/parser/wikilink.js'

describe('parseWikilinks', () => {
  it('parses basic wikilink [[target]]', () => {
    const md = 'See [[my-note]] for details.'
    const links = parseWikilinks(md)
    expect(links).toEqual([
      { type: 'wikilink', target: 'my-note', isEmbed: false, line: 1 },
    ])
  })

  it('parses wikilink with display text [[target|display]]', () => {
    const md = 'See [[my-note|My Note]] for details.'
    const links = parseWikilinks(md)
    expect(links).toEqual([
      { type: 'wikilink', target: 'my-note', isEmbed: false, line: 1 },
    ])
  })

  it('parses embedded wikilink ![[image.png]]', () => {
    const md = 'Here is an image: ![[photo.png]]'
    const links = parseWikilinks(md)
    expect(links).toEqual([
      { type: 'wikilink', target: 'photo.png', isEmbed: true, line: 1 },
    ])
  })

  it('parses multiple wikilinks on different lines', () => {
    const md = '[[note-a]]\n\n[[note-b]]\n\n![[img.png]]'
    const links = parseWikilinks(md)
    expect(links).toHaveLength(3)
    expect(links[0]).toMatchObject({ target: 'note-a', line: 1 })
    expect(links[1]).toMatchObject({ target: 'note-b', line: 3 })
    expect(links[2]).toMatchObject({ target: 'img.png', isEmbed: true, line: 5 })
  })

  it('returns empty array for markdown with no wikilinks', () => {
    const md = '# Just a heading\n\nNo links here.'
    const links = parseWikilinks(md)
    expect(links).toEqual([])
  })

  it('ignores wikilinks inside code blocks', () => {
    const md = '```\n[[not-a-link]]\n```\n\n[[real-link]]'
    const links = parseWikilinks(md)
    expect(links).toHaveLength(1)
    expect(links[0]).toMatchObject({ target: 'real-link' })
  })

  it('ignores wikilinks inside inline code', () => {
    const md = 'Use `[[not-a-link]]` syntax. But [[real-link]] works.'
    const links = parseWikilinks(md)
    expect(links).toHaveLength(1)
    expect(links[0]).toMatchObject({ target: 'real-link' })
  })
})
