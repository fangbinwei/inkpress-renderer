import { describe, it, expect } from 'vitest'
import { renderSite } from '../../src/index.js'
import { DefaultTheme } from '../../src/theme/default/theme.js'
import { createNodeAdapter, TEST_VAULT_PATH } from '../helpers/mock-fs.js'

describe('renderSite (integration)', () => {
  const theme = new DefaultTheme()
  const fs = createNodeAdapter(TEST_VAULT_PATH)

  it('renders test vault and produces OutputFile array', async () => {
    const result = await renderSite({
      vaultPath: TEST_VAULT_PATH,
      publishDirs: ['notes', 'guides'],
      theme,
      uploadMode: 'html',
      deadLinkPolicy: 'silent',
      fs,
    })
    const htmlFiles = result.files.filter(f => f.relativePath.endsWith('.html'))
    // 5 published notes (normal, with-wikilink, with-images, with-frontmatter, has-code-blocks)
    // + 1 guide (setup) + 1 index.html = 7 minimum
    expect(htmlFiles.length).toBeGreaterThanOrEqual(7)
    const cssFile = result.files.find(f => f.relativePath.endsWith('.css'))
    expect(cssFile).toBeDefined()
    const siteJson = result.files.find(f => f.relativePath === 'site.json')
    expect(siteJson).toBeDefined()
    const index = JSON.parse(siteJson!.content as string)
    expect(index.pages.length).toBeGreaterThanOrEqual(6)
    expect(index.navTree).toBeDefined()
  })

  it('skips files with publish: false', async () => {
    const result = await renderSite({
      vaultPath: TEST_VAULT_PATH,
      publishDirs: ['notes', 'guides'],
      theme, uploadMode: 'html', deadLinkPolicy: 'silent', fs,
    })
    const unpublishedHtml = result.files.find(f => f.relativePath.includes('unpublished'))
    expect(unpublishedHtml).toBeUndefined()
    expect(result.report.skipped.some(s => s.path.includes('unpublished'))).toBe(true)
  })

  it('reports dead links', async () => {
    const result = await renderSite({
      vaultPath: TEST_VAULT_PATH,
      publishDirs: ['notes', 'guides'],
      theme, uploadMode: 'html', deadLinkPolicy: 'silent', fs,
    })
    expect(result.report.deadLinks.some(d => d.targetLink === 'missing-note')).toBe(true)
  })

  it('includes source md files when uploadMode is html+md', async () => {
    const result = await renderSite({
      vaultPath: TEST_VAULT_PATH,
      publishDirs: ['notes', 'guides'],
      theme, uploadMode: 'html+md', deadLinkPolicy: 'silent', fs,
    })
    const mdFiles = result.files.filter(f => f.relativePath.endsWith('.md'))
    expect(mdFiles.length).toBeGreaterThanOrEqual(6)
  })

  it('includes images in output', async () => {
    const result = await renderSite({
      vaultPath: TEST_VAULT_PATH,
      publishDirs: ['notes', 'guides'],
      theme, uploadMode: 'html', deadLinkPolicy: 'silent', fs,
    })
    const imgFile = result.files.find(f => f.relativePath.includes('img.png'))
    expect(imgFile).toBeDefined()
    expect(imgFile!.contentType).toBe('image/png')
  })

  it('sets correct Cache-Control headers', async () => {
    const result = await renderSite({
      vaultPath: TEST_VAULT_PATH,
      publishDirs: ['notes', 'guides'],
      theme, uploadMode: 'html', deadLinkPolicy: 'silent', fs,
    })
    const htmlFile = result.files.find(f => f.relativePath.endsWith('.html'))!
    expect(htmlFile.cacheControl).toBe('no-cache')
    const cssFile = result.files.find(f => f.relativePath.endsWith('.css'))!
    expect(cssFile.cacheControl).toBe('max-age=2592000')
  })
})
