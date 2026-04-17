import { posix } from 'path'
import type { RawLink, DeadLinkEntry } from '../types.js'

export interface ResolveResult {
  resolved: boolean
  href: string | null
}

export interface LinkResolver {
  resolve(link: RawLink, fromSourcePath: string): ResolveResult
  getDeadLinks(): DeadLinkEntry[]
}

export function createLinkResolver(publishedPages: Map<string, string>): LinkResolver {
  const deadLinks: DeadLinkEntry[] = []

  const shortNameIndex = new Map<string, string[]>()
  for (const [fullName, htmlPath] of publishedPages) {
    const shortName = posix.basename(fullName)
    const existing = shortNameIndex.get(shortName) || []
    existing.push(htmlPath)
    shortNameIndex.set(shortName, existing)
  }

  function findTarget(target: string): string | null {
    const exact = publishedPages.get(target)
    if (exact) return exact
    const shortMatches = shortNameIndex.get(target)
    if (shortMatches && shortMatches.length === 1) return shortMatches[0]
    return null
  }

  return {
    resolve(link: RawLink, fromSourcePath: string): ResolveResult {
      const targetHtmlPath = findTarget(link.target)
      if (!targetHtmlPath) {
        deadLinks.push({ sourcePath: fromSourcePath, targetLink: link.target, line: link.line })
        return { resolved: false, href: null }
      }
      const fromDir = posix.dirname(fromSourcePath.replace(/\.md$/, '.html'))
      const relativePath = posix.relative(fromDir, targetHtmlPath)
      return { resolved: true, href: relativePath }
    },
    getDeadLinks(): DeadLinkEntry[] {
      return [...deadLinks]
    },
  }
}
