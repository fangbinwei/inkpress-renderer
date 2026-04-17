import type { ParsedPage, SiteIndex, PageMeta } from '../types.js'
import { buildNavTree } from './nav-tree.js'

export function buildSiteIndex(pages: ParsedPage[], resolvedOutlinks: Map<string, string[]>): SiteIndex {
  const pageMetas: PageMeta[] = pages.map(page => ({
    path: page.publishPath,
    sourcePath: page.sourcePath,
    title: page.title,
    frontmatter: page.frontmatter,
    outlinks: resolvedOutlinks.get(page.publishPath) || [],
    headings: page.headings,
  }))
  const navTree = buildNavTree(pages.map(p => ({ path: p.publishPath, title: p.title })))
  return { generatedAt: new Date().toISOString(), pages: pageMetas, navTree }
}
