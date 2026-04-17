import type { NavNode } from '../../types.js'

function renderNavList(node: NavNode): string {
  if (node.path !== null) return `<li><a href="/${node.path}">${escapeHtml(node.name)}</a></li>`
  if (node.name === 'root') return node.children.map(c => renderNavList(c)).join('\n')
  return `<li><strong>${escapeHtml(node.name)}</strong><ul>${node.children.map(c => renderNavList(c)).join('\n')}</ul></li>`
}

export function renderIndexPage(opts: { navTree: NavNode; siteName: string; cssPath: string; jsPath: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(opts.siteName)}</title>
  <link rel="stylesheet" href="/${opts.cssPath}">
</head>
<body>
  <div class="layout">
    <nav class="sidebar">
      <div class="sidebar-header">
        <span>${escapeHtml(opts.siteName)}</span>
        <button class="theme-toggle" aria-label="Toggle dark mode">🌓</button>
      </div>
      <div class="nav-tree"><ul>${renderNavList(opts.navTree)}</ul></div>
    </nav>
    <main class="content">
      <h1>${escapeHtml(opts.siteName)}</h1>
      <ul>${renderNavList(opts.navTree)}</ul>
    </main>
  </div>
  <script src="/${opts.jsPath}"></script>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
