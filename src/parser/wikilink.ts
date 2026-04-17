import type { RawLink } from '../types.js'

// Matches ![[target]] or [[target]] or [[target|display]]
const WIKILINK_RE = /(!)?\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g

// Matches fenced code blocks
const CODE_BLOCK_RE = /^```[\s\S]*?^```/gm

// Matches inline code
const INLINE_CODE_RE = /`[^`]+`/g

export function parseWikilinks(markdown: string): RawLink[] {
  // Remove code blocks and inline code to avoid matching inside them
  const stripped = markdown
    .replace(CODE_BLOCK_RE, (match) => ' '.repeat(match.length))
    .replace(INLINE_CODE_RE, (match) => ' '.repeat(match.length))

  const links: RawLink[] = []

  // Build a line offset map from the original markdown
  const lineOffsets: number[] = [0]
  for (let i = 0; i < markdown.length; i++) {
    if (markdown[i] === '\n') {
      lineOffsets.push(i + 1)
    }
  }

  let match: RegExpExecArray | null
  WIKILINK_RE.lastIndex = 0
  while ((match = WIKILINK_RE.exec(stripped)) !== null) {
    const offset = match.index
    const line = lineOffsets.findIndex((start, idx) => {
      const nextStart = lineOffsets[idx + 1] ?? Infinity
      return offset >= start && offset < nextStart
    }) + 1

    links.push({
      type: 'wikilink',
      target: match[2].trim(),
      isEmbed: match[1] === '!',
      line,
    })
  }

  return links
}
