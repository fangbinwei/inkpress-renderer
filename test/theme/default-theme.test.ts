import { describe, it, expect } from 'vitest'
import { DefaultTheme } from '../../src/theme/default/theme.js'
import type { PageContext, IndexContext, NavNode } from '../../src/types.js'

const testNavTree: NavNode = {
  name: 'root', path: null, children: [
    { name: 'notes', path: null, children: [
      { name: 'My Note', path: 'notes/my-note.html', children: [] },
    ]},
  ],
}

describe('DefaultTheme', () => {
  const theme = new DefaultTheme()

  it('has a name', () => { expect(theme.name).toBe('default') })

  it('renders a page with valid HTML structure', () => {
    const ctx: PageContext = {
      title: 'My Note',
      htmlContent: '<p>Hello world</p>',
      breadcrumb: [{ name: 'notes', path: 'notes/' }, { name: 'My Note', path: null }],
      navTree: testNavTree,
      currentPath: 'notes/my-note.html',
      siteConfig: { siteName: 'My Site' },
    }
    const html = theme.renderPage(ctx)
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<html')
    expect(html).toContain('</html>')
    expect(html).toContain('<title>My Note</title>')
    expect(html).toContain('Hello world')
    expect(html).toContain('notes')
    expect(html).toContain('my-note.html')
    expect(html).toContain('My Note')
  })

  it('renders an index page', () => {
    const ctx: IndexContext = { navTree: testNavTree, siteConfig: { siteName: 'My Site' } }
    const html = theme.renderIndex(ctx)
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('My Site')
    expect(html).toContain('notes')
  })

  it('provides CSS and JS assets', () => {
    const assets = theme.getAssets()
    expect(assets.length).toBeGreaterThanOrEqual(1)
    const cssAsset = assets.find(a => a.relativePath.endsWith('.css'))
    expect(cssAsset).toBeDefined()
    expect(cssAsset!.contentType).toBe('text/css')
  })

  it('includes dark mode toggle', () => {
    const ctx: PageContext = {
      title: 'Test', htmlContent: '<p>content</p>', breadcrumb: [],
      navTree: testNavTree, currentPath: 'test.html', siteConfig: {},
    }
    const html = theme.renderPage(ctx)
    expect(html).toContain('theme-toggle')
  })
})
