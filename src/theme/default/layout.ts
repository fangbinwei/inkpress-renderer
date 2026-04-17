import type { NavNode, BreadcrumbItem } from '../../types.js'

function renderNavNode(node: NavNode, currentPath: string): string {
  if (node.path !== null) {
    const activeClass = node.path === currentPath ? ' class="active"' : ''
    return `<li><a href="/${node.path}"${activeClass}>${escapeHtml(node.name)}</a></li>`
  }
  if (node.name === 'root') {
    return `<ul>${node.children.map(c => renderNavNode(c, currentPath)).join('\n')}</ul>`
  }
  return `<li><details open><summary class="dir-label">${escapeHtml(node.name)}</summary><ul>${node.children.map(c => renderNavNode(c, currentPath)).join('\n')}</ul></details></li>`
}

function renderBreadcrumb(items: BreadcrumbItem[]): string {
  return items.map(item => {
    if (item.path !== null) return `<a href="/${item.path}">${escapeHtml(item.name)}</a>`
    return `<span>${escapeHtml(item.name)}</span>`
  }).join('<span class="sep">/</span>')
}

export function renderPageLayout(opts: { title: string; htmlContent: string; breadcrumb: BreadcrumbItem[]; navTree: NavNode; currentPath: string; siteName: string; cssPath: string; jsPath: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(opts.title)}</title>
  <link rel="stylesheet" href="/${opts.cssPath}">
</head>
<body>
  <div class="layout">
    <nav class="sidebar">
      <div class="sidebar-header">
        <span>${escapeHtml(opts.siteName)}</span>
        <button class="theme-toggle" aria-label="Toggle dark mode">🌓</button>
      </div>
      <div class="nav-tree">${renderNavNode(opts.navTree, opts.currentPath)}</div>
    </nav>
    <main class="content">
      <div class="breadcrumb">${renderBreadcrumb(opts.breadcrumb)}</div>
      ${opts.htmlContent}
    </main>
  </div>
  <script src="/${opts.jsPath}"></script>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
