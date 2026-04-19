import { parseMarkdown } from '../parser/markdown.js'
import type { ResolveResult } from '../resolver/link-resolver.js'
import type { HeadingMeta } from '../types.js'
import { highlightCode } from './highlight.js'

const WIKILINK_RE = /(!)?\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
const CODE_BLOCK_RE = /```[\s\S]*?```/g

interface RenderPageOptions {
  markdown: string
  sourcePath: string
  resolveLink: (target: string) => ResolveResult
  resolveImage: (target: string) => string | null
  deadLinkPolicy: 'silent' | 'marked'
}

interface RenderPageResult {
  html: string
  headings: HeadingMeta[]
}

export async function renderPage(
  opts: RenderPageOptions,
): Promise<RenderPageResult> {
  const processedMd = substituteWikilinks(opts)
  let html = await parseMarkdown(processedMd)
  html = await highlightCodeBlocks(html)
  const headings = extractHeadings(html)
  html = addHeadingIds(html, headings)
  return { html, headings }
}

function substituteWikilinks(opts: RenderPageOptions): string {
  const { markdown, resolveLink, resolveImage, deadLinkPolicy } = opts

  const codeBlocks: string[] = []
  let protected_ = markdown.replace(CODE_BLOCK_RE, match => {
    codeBlocks.push(match)
    return `%%CODEBLOCK_${codeBlocks.length - 1}%%`
  })

  protected_ = protected_.replace(
    WIKILINK_RE,
    (_match, bang, target, display) => {
      const trimmedTarget = target.trim()
      const displayText = display?.trim() || trimmedTarget

      if (bang === '!') {
        const resolvedPath = resolveImage(trimmedTarget)
        if (resolvedPath) return `![${displayText}](${resolvedPath})`
        return `![${displayText}](${trimmedTarget})`
      }

      const result = resolveLink(trimmedTarget)
      if (result.resolved && result.href)
        return `[${displayText}](${result.href})`
      if (deadLinkPolicy === 'marked')
        return `<span class="dead-link">${displayText}</span>`
      return displayText
    },
  )

  for (let i = 0; i < codeBlocks.length; i++) {
    protected_ = protected_.replace(`%%CODEBLOCK_${i}%%`, codeBlocks[i])
  }

  return protected_
}

function extractHeadings(html: string): HeadingMeta[] {
  const headings: HeadingMeta[] = []
  const slugCounts = new Map<string, number>()
  const headingRe = /<h([1-6])>(.*?)<\/h\1>/g
  let match
  while ((match = headingRe.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, '')
    let slug = slugify(text)
    const count = slugCounts.get(slug) || 0
    slugCounts.set(slug, count + 1)
    if (count > 0) slug = `${slug}-${count}`
    headings.push({ level: parseInt(match[1], 10), text, slug })
  }
  return headings
}

function addHeadingIds(html: string, headings: HeadingMeta[]): string {
  let idx = 0
  return html.replace(/<h([1-6])>/g, (original, _level) => {
    const heading = headings[idx++]
    return heading ? `<h${heading.level} id="${heading.slug}">` : original
  })
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Post-process: replace <pre><code class="language-xxx">...</code></pre> with shiki output
const CODE_HTML_RE =
  /<pre><code class="language-([\w+#.-]+)">([\s\S]*?)<\/code><\/pre>/g

async function highlightCodeBlocks(html: string): Promise<string> {
  const matches: { full: string; lang: string; code: string }[] = []
  let m: RegExpExecArray | null
  CODE_HTML_RE.lastIndex = 0
  while ((m = CODE_HTML_RE.exec(html)) !== null) {
    matches.push({ full: m[0], lang: m[1], code: unescapeHtml(m[2]) })
  }

  for (const { full, lang, code } of matches) {
    const highlighted = await highlightCode(code, lang)
    html = html.replace(full, highlighted)
  }

  return html
}

function unescapeHtml(str: string): string {
  return str
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 16)),
    )
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}
