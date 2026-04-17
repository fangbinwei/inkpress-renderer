import { describe, it, expect } from 'vitest'
import { parseFrontmatter } from '../../src/parser/frontmatter.js'

describe('parseFrontmatter', () => {
  it('parses YAML frontmatter from markdown', () => {
    const md = `---
title: My Note
tags:
  - obsidian
  - oss
publish: true
---

# Content here`

    const result = parseFrontmatter(md)
    expect(result.frontmatter).toEqual({
      title: 'My Note',
      tags: ['obsidian', 'oss'],
      publish: true,
    })
    expect(result.content).toBe('\n# Content here')
  })

  it('returns empty frontmatter for markdown without it', () => {
    const md = '# No Frontmatter\n\nJust content.'
    const result = parseFrontmatter(md)
    expect(result.frontmatter).toEqual({})
    expect(result.content).toBe(md)
  })

  it('returns empty frontmatter for malformed YAML', () => {
    const md = `---
title: [invalid yaml
---

# Content`

    const result = parseFrontmatter(md)
    expect(result.frontmatter).toEqual({})
    expect(result.content).toContain('# Content')
  })

  it('extracts title from frontmatter', () => {
    const md = `---
title: Custom Title
---

# Heading Title`

    const result = parseFrontmatter(md)
    expect(result.frontmatter.title).toBe('Custom Title')
  })

  it('detects publish: false', () => {
    const md = `---
publish: false
---

# Private`

    const result = parseFrontmatter(md)
    expect(result.frontmatter.publish).toBe(false)
  })
})
