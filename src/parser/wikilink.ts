import type { RawLink } from '../types.js'

// Matches ![[target]] or [[target]] or [[target|display]]
const WIKILINK_RE = /(!)?\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g

// Matches YAML frontmatter block at the start of the file
const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/

// Matches fenced code blocks
const CODE_BLOCK_RE = /^```[\s\S]*?^```/gm

// Matches inline code
const INLINE_CODE_RE = /`[^`]+`/g

export function parseWikilinks(markdown: string): RawLink[] {
  // Mask frontmatter, code blocks, and inline code so wikilink-looking tokens inside them are ignored.
  // Use equal-length space runs (not replacements that remove content) so character offsets stay aligned.
  const stripped = markdown
    .replace(FRONTMATTER_RE, match => ' '.repeat(match.length))
    .replace(CODE_BLOCK_RE, match => ' '.repeat(match.length))
    .replace(INLINE_CODE_RE, match => ' '.repeat(match.length))

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
    const line =
      lineOffsets.findIndex((start, idx) => {
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
