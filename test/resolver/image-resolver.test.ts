import { describe, it, expect } from 'vitest'
import { resolveImagePath } from '../../src/resolver/image-resolver.js'
import { AssetCollector } from '../../src/resolver/asset-collector.js'

describe('resolveImagePath', () => {
  it('resolves relative image path', () => {
    const result = resolveImagePath('../assets/img.png', 'notes/with-images.md')
    expect(result).toBe('assets/img.png')
  })

  it('resolves same-directory image', () => {
    const result = resolveImagePath('photo.png', 'notes/with-images.md')
    expect(result).toBe('notes/photo.png')
  })

  it('resolves wikilink-style image (just filename)', () => {
    const collector = new AssetCollector()
    collector.registerAsset('assets/img.png')
    collector.registerAsset('notes/other.png')
    const result = collector.findAsset('img.png')
    expect(result).toBe('assets/img.png')
  })

  it('returns null for unknown wikilink image', () => {
    const collector = new AssetCollector()
    collector.registerAsset('assets/img.png')
    const result = collector.findAsset('nonexistent.png')
    expect(result).toBeNull()
  })
})

describe('AssetCollector', () => {
  it('collects unique assets', () => {
    const collector = new AssetCollector()
    collector.registerAsset('assets/img.png')
    collector.registerAsset('assets/doc.pdf')
    collector.registerAsset('assets/img.png')
    expect(collector.getAssets()).toEqual(['assets/img.png', 'assets/doc.pdf'])
  })
})
