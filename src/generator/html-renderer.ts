import { parseMarkdown } from '../parser/markdown.js'
import type { HeadingMeta } from '../types.js'
import type { ResolveResult } from '../resolver/link-resolver.js'

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

export async function renderPage(opts: RenderPageOptions): Promise<RenderPageResult> {
  const processedMd = substituteWikilinks(opts)
  const html = await parseMarkdown(processedMd)
  const headings = extractHeadings(html)
  return { html, headings }
}

function substituteWikilinks(opts: RenderPageOptions): string {
  const { markdown, resolveLink, resolveImage, deadLinkPolicy } = opts

  const codeBlocks: string[] = []
  let protected_ = markdown.replace(CODE_BLOCK_RE, (match) => {
    codeBlocks.push(match)
    return `%%CODEBLOCK_${codeBlocks.length - 1}%%`
  })

  protected_ = protected_.replace(WIKILINK_RE, (_match, bang, target, display) => {
    const trimmedTarget = target.trim()
    const displayText = display?.trim() || trimmedTarget

    if (bang === '!') {
      const resolvedPath = resolveImage(trimmedTarget)
      if (resolvedPath) return `![${displayText}](${resolvedPath})`
      return `![${displayText}](${trimmedTarget})`
    }

    const result = resolveLink(trimmedTarget)
    if (result.resolved && result.href) return `[${displayText}](${result.href})`
    if (deadLinkPolicy === 'marked') return `<span class="dead-link">${displayText}</span>`
    return displayText
  })

  for (let i = 0; i < codeBlocks.length; i++) {
    protected_ = protected_.replace(`%%CODEBLOCK_${i}%%`, codeBlocks[i])
  }

  return protected_
}

function extractHeadings(html: string): HeadingMeta[] {
  const headings: HeadingMeta[] = []
  const headingRe = /<h([1-6])>(.*?)<\/h\1>/g
  let match
  while ((match = headingRe.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, '')
    headings.push({ level: parseInt(match[1], 10), text, slug: slugify(text) })
  }
  return headings
}

function addHeadingIds(html: string, headings: HeadingMeta[]): string {
  let idx = 0
  return html.replace(/<h([1-6])>/g, (original, level) => {
    const heading = headings[idx++]
    return heading ? `<h${heading.level} id="${heading.slug}">` : original
  })
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}
