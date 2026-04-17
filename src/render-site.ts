import { posix } from 'path'
import type {
  RenderOptions, RenderResult, OutputFile, ParsedPage, RawLink,
} from './types.js'
import { parseFrontmatter } from './parser/frontmatter.js'
import { parseWikilinks } from './parser/wikilink.js'
import { renderPage } from './generator/html-renderer.js'
import { createLinkResolver } from './resolver/link-resolver.js'
import { resolveImagePath } from './resolver/image-resolver.js'
import { AssetCollector } from './resolver/asset-collector.js'
import { buildBreadcrumb } from './site/breadcrumb.js'
import { buildSiteIndex } from './site/site-index.js'
import { Reporter } from './report/reporter.js'

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
  if (contentType === 'text/html' || contentType === 'application/json') return 'no-cache'
  if (contentType === 'text/css' || contentType === 'application/javascript') return 'max-age=2592000'
  if (contentType.startsWith('image/') || contentType === 'application/pdf') return 'max-age=864000'
  if (contentType === 'text/markdown') return 'no-cache'
  return 'no-cache'
}

function extractTitle(frontmatter: Record<string, unknown>, content: string, sourcePath: string): string {
  if (typeof frontmatter.title === 'string') return frontmatter.title
  const headingMatch = /^#\s+(.+)$/m.exec(content)
  if (headingMatch) return headingMatch[1].trim()
  const basename = posix.basename(sourcePath, '.md')
  return basename
}

export async function renderSite(opts: RenderOptions): Promise<RenderResult> {
  const { publishDirs, theme, uploadMode, deadLinkPolicy, fs, onProgress } = opts
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
    parsedInputs.push({ sourcePath: mdFile, frontmatter, content, title, rawLinks })
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

  // 6. Create link resolver
  const linkResolver = createLinkResolver(publishedPages)

  // 7. Render each page
  const parsedPages: ParsedPage[] = []
  const resolvedOutlinks = new Map<string, string[]>()
  const total = parsedInputs.length

  for (let i = 0; i < parsedInputs.length; i++) {
    const input = parsedInputs[i]
    const htmlPath = input.sourcePath.replace(/\.md$/, '.html')

    const { html, headings } = await renderPage({
      markdown: input.content,
      sourcePath: input.sourcePath,
      resolveLink: (target: string) => {
        const rawLink: RawLink = { type: 'wikilink', target, isEmbed: false, line: 0 }
        return linkResolver.resolve(rawLink, input.sourcePath)
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

  // 8. Collect dead links from link resolver
  for (const dl of linkResolver.getDeadLinks()) {
    reporter.deadLink(dl.sourcePath, dl.targetLink, dl.line)
  }

  // 9. Build site index
  const siteIndex = buildSiteIndex(parsedPages, resolvedOutlinks)
  const navTree = siteIndex.navTree

  // 10. Render full HTML pages with theme
  const siteConfig = { siteName: 'Inkpress Site' }

  for (const page of parsedPages) {
    const breadcrumb = buildBreadcrumb(page.publishPath)
    const fullHtml = theme.renderPage({
      title: page.title,
      htmlContent: page.htmlContent,
      breadcrumb,
      navTree,
      currentPath: page.publishPath,
      siteConfig,
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
