import type { NavNode } from '../types.js'

interface PageEntry {
  path: string
  title: string
}

export function buildNavTree(pages: PageEntry[]): NavNode {
  const root: NavNode = { name: 'root', path: null, children: [] }
  for (const page of pages) {
    const parts = page.path.split('/')
    let current = root
    for (let i = 0; i < parts.length - 1; i++) {
      let child = current.children.find(
        c => c.name === parts[i] && c.path === null,
      )
      if (!child) {
        child = { name: parts[i], path: null, children: [] }
        current.children.push(child)
      }
      current = child
    }
    current.children.push({ name: page.title, path: page.path, children: [] })
  }
  sortNavTree(root)
  return root
}

function sortNavTree(node: NavNode): void {
  node.children.sort((a, b) => {
    const aIsDir = a.path === null ? 0 : 1
    const bIsDir = b.path === null ? 0 : 1
    if (aIsDir !== bIsDir) return aIsDir - bIsDir
    return a.name.localeCompare(b.name)
  })
  for (const child of node.children) sortNavTree(child)
}
