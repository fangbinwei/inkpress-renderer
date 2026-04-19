import { posix } from 'node:path'
import { renderPage } from './generator/html-renderer.js'
import { parseFrontmatter } from './parser/frontmatter.js'
import { parseWikilinks } from './parser/wikilink.js'
import { Reporter } from './report/reporter.js'
import { AssetCollector } from './resolver/asset-collector.js'
import { resolveImagePath } from './resolver/image-resolver.js'
import {
  createLinkResolver,
  type VaultFileIndex,
} from './resolver/link-resolver.js'
import { buildBreadcrumb } from './site/breadcrumb.js'
import { buildSiteIndex } from './site/site-index.js'
import type {
  NavNode,
  OutputFile,
  ParsedPage,
  RawLink,
  RenderOptions,
  RenderResult,
} from './types.js'

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.html': 'text/html',
  '.json': 'application/json',
  '.md': 'text/markdown',
}

function guessContentType(filePath: string): string {
  const ext = posix.extname(filePath).toLowerCase()
  return CONTENT_TYPES[ext] || 'application/octet-stream'
}

function cacheControlFor(contentType: string): string {
  if (contentType === 'text/html' || contentType === 'application/json')
    return 'no-cache'
  if (contentType === 'text/css' || contentType === 'application/javascript')
    return 'max-age=2592000'
  if (contentType.startsWith('image/') || contentType === 'application/pdf')
    return 'max-age=864000'
  if (contentType === 'text/markdown') return 'no-cache'
  return 'no-cache'
}

function extractTitle(
  frontmatter: Record<string, unknown>,
  content: string,
  sourcePath: string,
): string {
  if (typeof frontmatter.title === 'string') return frontmatter.title
  const headingMatch = /^#\s+(.+)$/m.exec(content)
  if (headingMatch) return headingMatch[1].trim()
  const basename = posix.basename(sourcePath, '.md')
  return basename
}

export async function renderSite(opts: RenderOptions): Promise<RenderResult> {
  const {
    publishDirs,
    theme,
    uploadMode,
    deadLinkPolicy,
    fs,
    onProgress,
    signal,
  } = opts
  const reporter = new Reporter()
  const assetCollector = new AssetCollector()
  const outputFiles: OutputFile[] = []

  // 1. Discover all files in publishDirs
  const allFiles: string[] = []
  for (const dir of publishDirs) {
    try {
      const files = await fs.listFiles(dir)
      allFiles.push(...files)
    } catch {
      reporter.warn(`Could not list directory: ${dir}`)
    }
  }

  // 2. Also scan root-level assets/ directory
  const assetFiles: string[] = []
  try {
    if (await fs.exists('assets')) {
      const files = await fs.listFiles('assets')
      assetFiles.push(...files)
      for (const f of files) {
        assetCollector.registerAsset(f)
      }
    }
  } catch {
    // assets dir may not exist
  }

  // 3. Separate md files from other assets in publishDirs
  const mdFiles = allFiles.filter(f => f.endsWith('.md'))
  const dirAssets = allFiles.filter(f => !f.endsWith('.md'))
  for (const a of dirAssets) {
    assetCollector.registerAsset(a)
  }

  // 4. Parse frontmatter for each md file, skip if publish: false
  interface ParsedInput {
    sourcePath: string
    frontmatter: Record<string, unknown>
    content: string
    title: string
    rawLinks: RawLink[]
  }

  const parsedInputs: ParsedInput[] = []
  for (const mdFile of mdFiles) {
    const raw = await fs.readText(mdFile)
    const { frontmatter, content } = parseFrontmatter(raw)
    if (frontmatter.publish === false) {
      reporter.skipped(mdFile, 'publish: false')
      continue
    }
    const title = extractTitle(frontmatter, content, mdFile)
    const rawLinks = parseWikilinks(raw)
    parsedInputs.push({
      sourcePath: mdFile,
      frontmatter,
      content,
      title,
      rawLinks,
    })
  }

  // 5. Build published pages map (name without .md -> html path) for link resolution
  const publishedPages = new Map<string, string>()
  for (const p of parsedInputs) {
    const htmlPath = p.sourcePath.replace(/\.md$/, '.html')
    // Register by full name without extension
    const nameNoExt = p.sourcePath.replace(/\.md$/, '')
    publishedPages.set(nameNoExt, htmlPath)
    // Also register by basename without extension (for short wikilink references)
    const baseName = posix.basename(p.sourcePath, '.md')
    if (!publishedPages.has(baseName)) {
      publishedPages.set(baseName, htmlPath)
    }
  }

  // 6. Build vault-wide file index so link resolver can classify dead links
  const vaultIndex = await buildVaultFileIndex(fs, publishedPages)

  // 7. Create link resolver
  const linkResolver = createLinkResolver(publishedPages, vaultIndex)

  // 8. Render each page
  const parsedPages: ParsedPage[] = []
  const resolvedOutlinks = new Map<string, string[]>()
  const total = parsedInputs.length

  for (let i = 0; i < parsedInputs.length; i++) {
    if (signal?.aborted) break

    const input = parsedInputs[i]
    const htmlPath = input.sourcePath.replace(/\.md$/, '.html')

    const { html, headings } = await renderPage({
      markdown: input.content,
      sourcePath: input.sourcePath,
      resolveLink: (target: string) => {
        return linkResolver.lookup(target, input.sourcePath)
      },
      resolveImage: (target: string) => {
        // Try to find the asset
        const resolved = assetCollector.findAsset(target)
        if (resolved) {
          // Return relative path from the page's directory to the asset
          const fromDir = posix.dirname(htmlPath)
          return posix.relative(fromDir, resolved)
        }
        // Try resolving relative to source
        const relResolved = resolveImagePath(target, input.sourcePath)
        return relResolved
      },
      deadLinkPolicy,
    })

    parsedPages.push({
      sourcePath: input.sourcePath,
      publishPath: htmlPath,
      title: input.title,
      frontmatter: input.frontmatter,
      rawLinks: input.rawLinks,
      headings,
      htmlContent: html,
    })

    // Build resolved outlinks for this page
    const outlinks: string[] = []
    for (const link of input.rawLinks) {
      if (!link.isEmbed) {
        const result = linkResolver.resolve(link, input.sourcePath)
        if (result.resolved && result.href) {
          outlinks.push(result.href)
        }
      }
    }
    resolvedOutlinks.set(htmlPath, outlinks)

    onProgress?.('render', i + 1, total)
    reporter.rendered()
  }

  // 9. Collect dead links from link resolver
  for (const dl of linkResolver.getDeadLinks()) {
    reporter.deadLink(dl)
  }

  // 9. Build site index
  const siteIndex = buildSiteIndex(parsedPages, resolvedOutlinks)
  const navTree = siteIndex.navTree

  // Flatten nav tree into a stable ordered path list for page numbering
  const orderedPaths = flattenNavPaths(navTree)

  // Invert outlinks → backlinks
  const backlinksMap = buildBacklinks(
    parsedInputs,
    parsedPages,
    resolvedOutlinks,
  )

  // 10. Render full HTML pages with theme
  const siteConfig = { siteName: 'Inkpress Site', variant: opts.variant }

  for (const page of parsedPages) {
    const breadcrumb = buildBreadcrumb(page.publishPath)
    const orderedIdx = orderedPaths.indexOf(page.publishPath)
    const pageIndex = orderedIdx >= 0 ? orderedIdx + 1 : 0
    const modified = await resolveModified(fs, page)
    const groupName = firstSegment(page.publishPath)
    const sourceInput = parsedInputs.find(p => p.sourcePath === page.sourcePath)
    const wordCount = sourceInput ? countWords(sourceInput.content) : 0
    const readingTime =
      wordCount > 0 ? Math.max(1, Math.round(wordCount / 250)) : undefined
    const backlinks = backlinksMap.get(page.publishPath) || []
    const fullHtml = theme.renderPage({
      title: page.title,
      htmlContent: page.htmlContent,
      breadcrumb,
      navTree,
      currentPath: page.publishPath,
      siteConfig,
      headings: page.headings,
      pageIndex,
      totalPages: orderedPaths.length,
      modified,
      groupName,
      wordCount: wordCount || undefined,
      readingTime,
      backlinks,
    })
    outputFiles.push({
      relativePath: page.publishPath,
      content: fullHtml,
      contentType: 'text/html',
      cacheControl: 'no-cache',
    })
  }

  // Render index.html
  const indexHtml = theme.renderIndex({ navTree, siteConfig })
  outputFiles.push({
    relativePath: 'index.html',
    content: indexHtml,
    contentType: 'text/html',
    cacheControl: 'no-cache',
  })

  // 11. Add theme assets (CSS/JS)
  outputFiles.push(...theme.getAssets())

  // 12. Add site.json
  outputFiles.push({
    relativePath: 'site.json',
    content: JSON.stringify(siteIndex, null, 2),
    contentType: 'application/json',
    cacheControl: 'no-cache',
  })

  // 13. Add referenced assets (images, PDFs)
  for (const assetPath of assetCollector.getAssets()) {
    try {
      const buf = await fs.readFile(assetPath)
      const ct = guessContentType(assetPath)
      outputFiles.push({
        relativePath: assetPath,
        content: buf,
        contentType: ct,
        cacheControl: cacheControlFor(ct),
      })
    } catch {
      reporter.warn(`Could not read asset: ${assetPath}`)
    }
  }

  // 14. Optionally add source md if uploadMode is 'html+md'
  if (uploadMode === 'html+md') {
    for (const input of parsedInputs) {
      const raw = await fs.readText(input.sourcePath)
      outputFiles.push({
        relativePath: input.sourcePath,
        content: raw,
        contentType: 'text/markdown',
        cacheControl: 'no-cache',
      })
    }
  }

  return { files: outputFiles, report: reporter.build() }
}

function countWords(markdown: string): number {
  // Strip code blocks so their contents don't inflate the count.
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, a, b) => b || a)
  const latin = stripped.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g) || []
  const cjk =
    stripped.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) ||
    []
  return latin.length + cjk.length
}

function extractExcerpt(html: string, maxChars = 160): string {
  // Find the first paragraph and strip tags.
  const paraMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/)
  if (!paraMatch) return ''
  const text = paraMatch[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= maxChars) return text
  return `${text.slice(0, maxChars).replace(/\s+\S*$/, '')}…`
}

interface ParsedInputForBacklinks {
  sourcePath: string
}

function buildBacklinks(
  _inputs: ParsedInputForBacklinks[],
  pages: ParsedPage[],
  resolvedOutlinks: Map<string, string[]>,
): Map<string, Array<{ path: string; title: string; excerpt: string }>> {
  const byPath = new Map<string, ParsedPage>()
  for (const p of pages) byPath.set(p.publishPath, p)

  const result = new Map<
    string,
    Array<{ path: string; title: string; excerpt: string }>
  >()

  for (const srcPage of pages) {
    const outlinks = resolvedOutlinks.get(srcPage.publishPath) || []
    if (outlinks.length === 0) continue
    const excerpt = extractExcerpt(srcPage.htmlContent)
    const seen = new Set<string>()
    const srcDir = posix.dirname(srcPage.publishPath)
    for (const rel of outlinks) {
      // Resolve relative href back to absolute publish path
      const target = posix.normalize(posix.join(srcDir, rel))
      if (target === srcPage.publishPath) continue
      if (seen.has(target)) continue
      seen.add(target)
      if (!byPath.has(target)) continue
      const list = result.get(target) || []
      if (list.some(b => b.path === srcPage.publishPath)) continue
      list.push({ path: srcPage.publishPath, title: srcPage.title, excerpt })
      result.set(target, list)
    }
  }

  return result
}

function flattenNavPaths(root: NavNode): string[] {
  const out: string[] = []
  walk(root)
  return out
  function walk(node: NavNode): void {
    for (const c of node.children) {
      if (c.path) out.push(c.path)
      else walk(c)
    }
  }
}

function firstSegment(publishPath: string): string {
  const idx = publishPath.indexOf('/')
  if (idx === -1) return ''
  return publishPath.slice(0, idx)
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function formatModified(ms: number): string {
  const d = new Date(ms)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

async function resolveModified(
  fs: import('./types.js').FileSystemAdapter,
  page: ParsedPage,
): Promise<string | undefined> {
  const fm = page.frontmatter as Record<string, unknown>
  const raw = fm.modified ?? fm.updated ?? fm.lastmod
  if (typeof raw === 'string' && raw.trim()) {
    const ts = Date.parse(raw)
    if (!Number.isNaN(ts)) return formatModified(ts)
    return raw
  }
  if (raw instanceof Date) return formatModified(raw.getTime())
  try {
    const st = await fs.stat(page.sourcePath)
    if (st.mtime) return formatModified(st.mtime)
  } catch {
    // ignore
  }
  return undefined
}

async function buildVaultFileIndex(
  fs: import('./types.js').FileSystemAdapter,
  publishedPages: Map<string, string>,
): Promise<VaultFileIndex> {
  const unpublishedMd = new Set<string>()
  const unpublishedMdByBasename = new Map<string, string[]>()
  const assets = new Set<string>()
  const assetsByBasename = new Map<string, string[]>()

  let allFiles: string[] = []
  try {
    allFiles = await fs.listFiles('')
  } catch {
    // Vault root not listable — return empty index (resolver still works, just with limited hints)
    return { unpublishedMd, unpublishedMdByBasename, assets, assetsByBasename }
  }

  for (const path of allFiles) {
    if (path.endsWith('.md')) {
      const nameNoExt = path.replace(/\.md$/, '')
      if (publishedPages.has(nameNoExt)) continue
      unpublishedMd.add(nameNoExt)
      const base = posix.basename(nameNoExt)
      const list = unpublishedMdByBasename.get(base) || []
      list.push(nameNoExt)
      unpublishedMdByBasename.set(base, list)
    } else {
      assets.add(path)
      const base = posix.basename(path)
      const list = assetsByBasename.get(base) || []
      list.push(path)
      assetsByBasename.set(base, list)
    }
  }

  return { unpublishedMd, unpublishedMdByBasename, assets, assetsByBasename }
}
