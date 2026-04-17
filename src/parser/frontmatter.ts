import { parse as parseYaml } from 'yaml'

export interface FrontmatterResult {
  frontmatter: Record<string, unknown>
  content: string
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export function parseFrontmatter(markdown: string): FrontmatterResult {
  const match = FRONTMATTER_RE.exec(markdown)
  if (!match) {
    return { frontmatter: {}, content: markdown }
  }

  const yamlStr = match[1]
  const content = markdown.slice(match[0].length)

  try {
    const parsed = parseYaml(yamlStr)
    if (typeof parsed !== 'object' || parsed === null) {
      return { frontmatter: {}, content }
    }
    return { frontmatter: parsed as Record<string, unknown>, content }
  } catch {
    return { frontmatter: {}, content }
  }
}
