import type { NavNode, ThemeVariant } from '../../types.js'
import { escapeHtml, flattenNavPaths, renderShell } from './layout.js'

function renderIndexBody(
  navTree: NavNode,
  baseUrl: string,
  siteName: string,
): string {
  const allPaths = flattenNavPaths(navTree)
  const groups = navTree.children.filter(c => c.path === null)
  const rootLeaves = navTree.children.filter(c => c.path !== null)

  const groupSections: string[] = []

  if (rootLeaves.length > 0) {
    groupSections.push(renderIndexGroup('Pages', rootLeaves, baseUrl))
  }
  for (const g of groups) {
    groupSections.push(renderIndexGroup(g.name, flattenLeaves(g), baseUrl))
  }

  return `<h1>${escapeHtml(siteName)}</h1>
  <p>A collection of ${allPaths.length} note${allPaths.length === 1 ? '' : 's'}, rendered from an Obsidian vault.</p>
  ${groupSections.join('')}`
}

function flattenLeaves(node: NavNode): NavNode[] {
  const out: NavNode[] = []
  for (const c of node.children) {
    if (c.path) out.push(c)
    else out.push(...flattenLeaves(c))
  }
  return out
}

function renderIndexGroup(
  name: string,
  leaves: NavNode[],
  baseUrl: string,
): string {
  const items = leaves
    .map(
      leaf =>
        `<li><a href="${baseUrl}/${leaf.path}">${escapeHtml(leaf.name)}</a></li>`,
    )
    .join('')
  return `<h2 id="${slug(name)}">${escapeHtml(name)}</h2><ul>${items}</ul>`
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function renderIndexPage(opts: {
  navTree: NavNode
  siteName: string
  variant?: ThemeVariant
  cssPath: string
  jsPath: string
  baseUrl: string
}): string {
  return renderShell({
    title: opts.siteName,
    siteName: opts.siteName,
    variant: opts.variant,
    baseUrl: opts.baseUrl,
    cssPath: opts.cssPath,
    jsPath: opts.jsPath,
    navTree: opts.navTree,
    currentPath: 'index.html',
    breadcrumb: [{ name: 'Home', path: null }],
    headings: [],
    article: renderIndexBody(opts.navTree, opts.baseUrl, opts.siteName),
  })
}
