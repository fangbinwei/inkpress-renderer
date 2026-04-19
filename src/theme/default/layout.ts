import type {
  BacklinkEntry,
  BreadcrumbItem,
  HeadingMeta,
  NavNode,
  ThemeVariant,
} from '../../types.js'

export function flattenNavPaths(root: NavNode): string[] {
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

function countLeaves(node: NavNode): number {
  let n = 0
  for (const c of node.children) {
    if (c.path) n += 1
    else n += countLeaves(c)
  }
  return n
}

function renderNavInner(
  node: NavNode,
  currentPath: string,
  baseUrl: string,
): string {
  const items = node.children.map(c => {
    if (c.path !== null) {
      const activeClass = c.path === currentPath ? ' active' : ''
      const nameAttr = escapeHtml(c.name)
      return `<li><a href="${baseUrl}/${c.path}" class="nav-leaf${activeClass}" data-nav-leaf data-name="${nameAttr}">${nameAttr}</a></li>`
    }
    const sublabel = escapeHtml(c.name)
    return `<li><div class="nav-subgroup"><div class="nav-subgroup-label">${sublabel}</div>${renderNavInner(c, currentPath, baseUrl)}</div></li>`
  })
  return `<ul>${items.join('')}</ul>`
}

function renderNavTree(
  root: NavNode,
  currentPath: string,
  baseUrl: string,
): string {
  const rootLeaves = root.children.filter(c => c.path !== null)
  const dirGroups = root.children.filter(c => c.path === null)

  const parts: string[] = []

  if (rootLeaves.length > 0) {
    const pseudoGroup: NavNode = {
      name: 'Pages',
      path: null,
      children: rootLeaves,
    }
    parts.push(renderGroup(pseudoGroup, currentPath, baseUrl))
  }
  for (const g of dirGroups) {
    parts.push(renderGroup(g, currentPath, baseUrl))
  }
  parts.push('<div class="nav-empty" style="display:none"></div>')
  return parts.join('')
}

function renderGroup(
  group: NavNode,
  currentPath: string,
  baseUrl: string,
): string {
  const count = countLeaves(group)
  const nameAttr = escapeHtml(group.name)
  const displayName = escapeHtml(group.name.toUpperCase())
  return `<div class="nav-group" data-group="${nameAttr}">
    <button type="button" class="nav-group-label" aria-expanded="true">
      <svg class="nav-caret" width="8" height="8" viewBox="0 0 8 8" aria-hidden="true"><path d="M2 1l4 3-4 3z" fill="currentColor"/></svg>
      <span class="nav-group-name">${displayName}</span>
      <span class="nav-count">${count}</span>
    </button>
    ${renderNavInner(group, currentPath, baseUrl)}
  </div>`
}

function renderBreadcrumb(items: BreadcrumbItem[], baseUrl: string): string {
  if (items.length === 0) return ''
  const parts = items.map((item, i) => {
    const name = escapeHtml(item.name)
    const cell =
      item.path !== null
        ? `<a href="${baseUrl}/${item.path}">${name}</a>`
        : `<span>${name}</span>`
    const sep = i < items.length - 1 ? '<span class="sep">/</span>' : ''
    return cell + sep
  })
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${parts.join('')}</nav>`
}

function renderTOC(headings: HeadingMeta[]): string {
  const entries = headings.filter(h => h.level === 2 || h.level === 3)
  if (entries.length < 2) return ''
  const items = entries
    .map(h => {
      const cls = h.level === 3 ? 'toc-h3' : 'toc-h2'
      return `<li class="${cls}"><a href="#${h.slug}" data-slug="${h.slug}">${escapeHtml(h.text)}</a></li>`
    })
    .join('')
  const ticks = entries
    .map(h => {
      const cls =
        h.level === 3
          ? 'toc-rail-tick toc-rail-h3'
          : 'toc-rail-tick toc-rail-h2'
      return `<span class="${cls}" data-slug="${h.slug}"></span>`
    })
    .join('')
  return `<aside class="toc open" aria-label="On this page">
    <div class="toc-head">
      <span class="toc-label">On this page</span>
      <button type="button" class="toc-toggle" aria-label="Hide outline" title="Hide">
        <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 4l-4 4 4 4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><line x1="13" y1="3" x2="13" y2="13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <span class="toc-toggle-label">hide</span>
      </button>
    </div>
    <ul>${items}</ul>
    <button type="button" class="toc-rail" aria-label="Show outline" title="On this page">
      <span class="toc-rail-ticks">${ticks}</span>
      <span class="toc-rail-label">
        <svg width="9" height="9" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>outline</span>
      </span>
    </button>
  </aside>`
}

function renderFolio(opts: {
  pageIndex: number
  totalPages: number
  groupName: string
}): string {
  if (!opts.totalPages) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  const num = pad(opts.pageIndex)
  const tot = pad(opts.totalPages)
  const group = escapeHtml(opts.groupName || '')
  return `<aside class="folio" aria-hidden="true">
    <span class="folio-num">${num} / ${tot}</span>
    ${group ? `<span class="folio-group">${group}</span>` : ''}
  </aside>`
}

function renderArticleFooter(modified?: string): string {
  if (!modified) return ''
  return `<footer class="article-footer">
    <div class="article-footer-rule"></div>
    <div class="article-footer-meta"><span>Last edited <strong>${escapeHtml(modified)}</strong></span></div>
  </footer>`
}

function renderReadingMeta(opts: {
  readingTime?: number
  wordCount?: number
}): string {
  const parts: string[] = []
  if (opts.readingTime) parts.push(`${opts.readingTime} min read`)
  if (opts.wordCount) parts.push(`${opts.wordCount} words`)
  if (parts.length === 0) return ''
  return `<div class="note-meta">${parts.map(escapeHtml).join(' · ')}</div>`
}

function injectMetaAfterH1(html: string, metaHtml: string): string {
  if (!metaHtml) return html
  const idx = html.indexOf('</h1>')
  if (idx === -1) return metaHtml + html
  const end = idx + '</h1>'.length
  return html.slice(0, end) + metaHtml + html.slice(end)
}

function renderBacklinks(entries: BacklinkEntry[], baseUrl: string): string {
  if (!entries || entries.length === 0) return ''
  const items = entries
    .map(
      b => `<li><a href="${baseUrl}/${b.path}">
      <span class="bl-title">${escapeHtml(b.title)}</span>
      ${b.excerpt ? `<span class="bl-excerpt">${escapeHtml(b.excerpt)}</span>` : ''}
    </a></li>`,
    )
    .join('')
  return `<section class="backlinks" aria-label="Backlinks">
    <div class="backlinks-header">
      <span class="backlinks-title">Linked from</span>
      <span class="backlinks-count">${entries.length}</span>
    </div>
    <ul class="backlinks-list">${items}</ul>
  </section>`
}

function renderShortcutsOverlay(): string {
  const rows: Array<{ keys: string[]; desc: string }> = [
    { keys: ['g'], desc: 'Jump to home' },
    { keys: ['d'], desc: 'Toggle dark mode' },
    { keys: ['/'], desc: 'Focus search' },
    { keys: ['['], desc: 'Previous note' },
    { keys: [']'], desc: 'Next note' },
    { keys: ['?'], desc: 'Show this panel' },
    { keys: ['Esc'], desc: 'Close or blur input' },
  ]
  const items = rows
    .map(
      r =>
        `<dt>${r.keys.map(k => `<kbd>${escapeHtml(k)}</kbd>`).join('')}</dt><dd>${escapeHtml(r.desc)}</dd>`,
    )
    .join('')
  return `<div class="shortcuts-scrim" role="dialog" aria-label="Keyboard shortcuts" aria-hidden="true">
    <div class="shortcuts-card">
      <div class="shortcuts-head">
        <span class="shortcuts-title">Keyboard shortcuts</span>
        <button type="button" class="shortcuts-close" aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </div>
      <dl class="shortcuts-list">${items}</dl>
      <div class="shortcuts-foot">Press <kbd>?</kbd> anywhere to open this.</div>
    </div>
  </div>`
}

function renderThemeIcons(): string {
  const sun = `<svg class="icon-sun" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="3.2" fill="currentColor"/><g stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><line x1="8" y1="1.5" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="14.5"/><line x1="1.5" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="14.5" y2="8"/><line x1="3.2" y1="3.2" x2="4.3" y2="4.3"/><line x1="11.7" y1="11.7" x2="12.8" y2="12.8"/><line x1="3.2" y1="12.8" x2="4.3" y2="11.7"/><line x1="11.7" y1="4.3" x2="12.8" y2="3.2"/></g></svg>`
  const moon = `<svg class="icon-moon" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M12.5 9.5A5 5 0 0 1 6.5 3.5a5 5 0 1 0 6 6z" fill="currentColor"/></svg>`
  return sun + moon
}
function renderIconSearch(): string {
  return `<svg width="12" height="12" viewBox="0 0 16 16" class="search-icon" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.3" fill="none"/><line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`
}
function renderIconMenu(): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`
}

export interface ShellOptions {
  title: string
  siteName: string
  variant?: ThemeVariant
  baseUrl: string
  cssPath: string
  jsPath: string
  navTree: NavNode
  currentPath: string
  breadcrumb?: BreadcrumbItem[]
  headings?: HeadingMeta[]
  folio?: { pageIndex: number; totalPages: number; groupName: string }
  modified?: string
  article: string
  bodyClasses?: string[]
  readingTime?: number
  wordCount?: number
  backlinks?: BacklinkEntry[]
}

export function renderShell(opts: ShellOptions): string {
  const {
    title,
    siteName,
    baseUrl,
    cssPath,
    jsPath,
    navTree,
    currentPath,
    breadcrumb = [],
    headings = [],
    folio,
    modified,
    article,
    bodyClasses = [],
    readingTime,
    wordCount,
    backlinks,
  } = opts

  const metaHtml = renderReadingMeta({ readingTime, wordCount })
  const articleHtml = injectMetaAfterH1(article, metaHtml)

  const variant = opts.variant || 'technical'
  const htmlClasses = [`variant-${variant}`, 'mode-light']
  const bodyClassAttr = bodyClasses.length
    ? ` class="${bodyClasses.join(' ')}"`
    : ''
  const homeHref = `${baseUrl}/` || '/'

  return `<!DOCTYPE html>
<html lang="en" class="${htmlClasses.join(' ')}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,500&family=Inter+Tight:wght@400;450;500;550;600;650&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${baseUrl}/${cssPath}">
</head>
<body${bodyClassAttr}>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-inner">
        <header class="sidebar-header">
          <a class="brand" href="${homeHref}">
            <span class="brand-mark">I<span class="brand-dot"></span></span>
            <span class="brand-name">${escapeHtml(siteName)}</span>
          </a>
          <button type="button" class="icon-btn theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">${renderThemeIcons()}</button>
        </header>
        <div class="sidebar-search">
          ${renderIconSearch()}
          <input type="text" placeholder="Filter notes…" aria-label="Filter notes">
          <button type="button" class="search-clear" aria-label="Clear search" style="display:none"><svg width="10" height="10" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button>
          <span class="search-kbd">/</span>
        </div>
        <nav class="nav-tree">${renderNavTree(navTree, currentPath, baseUrl)}</nav>
        <footer class="sidebar-footer">
          <div class="foot-line">Rendered by <span class="foot-mark">inkpress</span></div>
          <button type="button" class="foot-help" title="Keyboard shortcuts">
            <span>?</span>
            <span class="foot-help-label">shortcuts</span>
          </button>
        </footer>
      </div>
    </aside>
    <div class="sidebar-scrim"></div>
    <div class="main-col">
      <div class="topbar">
        <button type="button" class="icon-btn menu-btn" aria-label="Open navigation">${renderIconMenu()}</button>
        <div class="topbar-brand">
          <span class="brand-mark small">I<span class="brand-dot"></span></span>
          <span>${escapeHtml(siteName)}</span>
        </div>
        <button type="button" class="icon-btn theme-toggle" aria-label="Toggle dark mode">${renderThemeIcons()}</button>
      </div>
      <div class="content-wrap">
        ${folio ? renderFolio(folio) : ''}
        <article class="content">
          ${renderBreadcrumb(breadcrumb, baseUrl)}
          ${articleHtml}
          ${renderArticleFooter(modified)}
          ${renderBacklinks(backlinks || [], baseUrl)}
        </article>
      </div>
      ${renderTOC(headings)}
    </div>
  </div>
  ${renderShortcutsOverlay()}
  <script src="${baseUrl}/${jsPath}"></script>
</body>
</html>`
}

export function renderPageLayout(opts: {
  title: string
  htmlContent: string
  breadcrumb: BreadcrumbItem[]
  navTree: NavNode
  currentPath: string
  siteName: string
  variant?: ThemeVariant
  cssPath: string
  jsPath: string
  baseUrl: string
  headings: HeadingMeta[]
  pageIndex: number
  totalPages: number
  modified?: string
  groupName?: string
  readingTime?: number
  wordCount?: number
  backlinks?: BacklinkEntry[]
}): string {
  return renderShell({
    title: opts.title,
    siteName: opts.siteName,
    variant: opts.variant,
    baseUrl: opts.baseUrl,
    cssPath: opts.cssPath,
    jsPath: opts.jsPath,
    navTree: opts.navTree,
    currentPath: opts.currentPath,
    breadcrumb: opts.breadcrumb,
    headings: opts.headings,
    folio: {
      pageIndex: opts.pageIndex,
      totalPages: opts.totalPages,
      groupName: opts.groupName || '',
    },
    modified: opts.modified,
    article: opts.htmlContent,
    readingTime: opts.readingTime,
    wordCount: opts.wordCount,
    backlinks: opts.backlinks,
  })
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
