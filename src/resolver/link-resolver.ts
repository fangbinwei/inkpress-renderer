import { posix } from 'node:path'
import type { DeadLinkEntry, DeadLinkReason, RawLink } from '../types.js'

export interface ResolveResult {
  resolved: boolean
  href: string | null
}

/**
 * Index of files that exist anywhere in the vault (not just publishDirs).
 * Keys are paths without extension for .md files, or full path for assets.
 * Values describe where the file lives and whether the renderer handles it.
 */
export interface VaultFileIndex {
  /** Full paths (without .md) of md files that exist in the vault but are NOT in publishedPages */
  unpublishedMd: Set<string>
  /** Basename (without .md) → full path, for md files not in publishedPages */
  unpublishedMdByBasename: Map<string, string[]>
  /** Full asset paths that exist in the vault (any extension) */
  assets: Set<string>
  /** Basename → full path(s) for assets */
  assetsByBasename: Map<string, string[]>
}

export interface LinkResolver {
  resolve(link: RawLink, fromSourcePath: string): ResolveResult
  /** Lookup only — does not record dead links */
  lookup(target: string, fromSourcePath: string): ResolveResult
  getDeadLinks(): DeadLinkEntry[]
}

const UNSUPPORTED_ASSET_EXTS = new Set(['.excalidraw', '.canvas'])

function stripMd(target: string): string {
  return target.replace(/\.md$/i, '')
}

export function createLinkResolver(
  publishedPages: Map<string, string>,
  vaultIndex?: VaultFileIndex,
): LinkResolver {
  const deadLinks: DeadLinkEntry[] = []

  const shortNameIndex = new Map<string, string[]>()
  for (const [fullName, htmlPath] of publishedPages) {
    const shortName = posix.basename(fullName)
    const existing = shortNameIndex.get(shortName) || []
    existing.push(htmlPath)
    shortNameIndex.set(shortName, existing)
  }

  function findTarget(target: string, fromSourcePath: string): string | null {
    const normalized = stripMd(target)

    // 1. Exact full-path match
    const exact = publishedPages.get(normalized)
    if (exact) return exact

    // 2. Path-style target: resolve relative to source's directory
    if (normalized.includes('/')) {
      const fromDir = posix.dirname(fromSourcePath)
      const relResolved = posix.normalize(posix.join(fromDir, normalized))
      const hit = publishedPages.get(relResolved)
      if (hit) return hit
    }

    // 3. Short-name unique match (basename)
    const shortMatches = shortNameIndex.get(posix.basename(normalized))
    if (shortMatches && shortMatches.length === 1) return shortMatches[0]

    return null
  }

  function classify(
    target: string,
    fromSourcePath: string,
  ): { reason: DeadLinkReason; hint: string } {
    const ext = posix.extname(target).toLowerCase()

    if (UNSUPPORTED_ASSET_EXTS.has(ext)) {
      return {
        reason: 'unsupported-asset',
        hint: `${ext} files are not rendered by Inkpress yet`,
      }
    }

    const normalized = stripMd(target)
    const basename = posix.basename(normalized)

    if (vaultIndex) {
      // Check: does this target exist in vault as an unpublished md?
      if (vaultIndex.unpublishedMd.has(normalized)) {
        return {
          reason: 'not-published',
          hint: `file exists at ${normalized}.md but its directory is not in publishDirs — add it to publish settings to include this page`,
        }
      }
      // Try relative-to-source resolution against vault index
      if (normalized.includes('/')) {
        const fromDir = posix.dirname(fromSourcePath)
        const relResolved = posix.normalize(posix.join(fromDir, normalized))
        if (vaultIndex.unpublishedMd.has(relResolved)) {
          return {
            reason: 'not-published',
            hint: `file exists at ${relResolved}.md but its directory is not in publishDirs`,
          }
        }
      }
      // Basename match against unpublished md
      const unpubMatches =
        vaultIndex.unpublishedMdByBasename.get(basename) || []
      if (unpubMatches.length === 1) {
        return {
          reason: 'not-published',
          hint: `file exists at ${unpubMatches[0]}.md but is outside publishDirs`,
        }
      }
      if (unpubMatches.length > 1) {
        return {
          reason: 'ambiguous',
          hint: `multiple files named "${basename}.md" outside publishDirs: ${unpubMatches.slice(0, 3).join(', ')}${unpubMatches.length > 3 ? '…' : ''}`,
        }
      }
      // Asset match (exact or basename)
      if (vaultIndex.assets.has(target)) {
        return {
          reason: 'unsupported-asset',
          hint: `${target} is an asset file, not a markdown page`,
        }
      }
      const assetMatches =
        vaultIndex.assetsByBasename.get(posix.basename(target)) || []
      if (assetMatches.length > 0) {
        return {
          reason: 'unsupported-asset',
          hint: `file exists at ${assetMatches[0]} but is not a markdown page`,
        }
      }
    }

    // Ambiguous in published set
    const publishedShortMatches = shortNameIndex.get(basename) || []
    if (publishedShortMatches.length > 1) {
      return {
        reason: 'ambiguous',
        hint: `multiple published pages share the name "${basename}" — use a path prefix to disambiguate`,
      }
    }

    return {
      reason: 'target-missing',
      hint: `no file named "${basename}" found anywhere in the vault`,
    }
  }

  return {
    resolve(link: RawLink, fromSourcePath: string): ResolveResult {
      const targetHtmlPath = findTarget(link.target, fromSourcePath)
      if (!targetHtmlPath) {
        const { reason, hint } = classify(link.target, fromSourcePath)
        deadLinks.push({
          sourcePath: fromSourcePath,
          targetLink: link.target,
          line: link.line,
          reason,
          hint,
        })
        return { resolved: false, href: null }
      }
      const fromDir = posix.dirname(fromSourcePath.replace(/\.md$/, '.html'))
      const relativePath = posix.relative(fromDir, targetHtmlPath)
      return { resolved: true, href: relativePath }
    },
    lookup(target: string, fromSourcePath: string): ResolveResult {
      const targetHtmlPath = findTarget(target, fromSourcePath)
      if (!targetHtmlPath) return { resolved: false, href: null }
      const fromDir = posix.dirname(fromSourcePath.replace(/\.md$/, '.html'))
      const relativePath = posix.relative(fromDir, targetHtmlPath)
      return { resolved: true, href: relativePath }
    },
    getDeadLinks(): DeadLinkEntry[] {
      return [...deadLinks]
    },
  }
}
