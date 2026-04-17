import { describe, it, expect } from 'vitest'
import { buildNavTree } from '../../src/site/nav-tree.js'
import { buildBreadcrumb } from '../../src/site/breadcrumb.js'

describe('buildNavTree', () => {
  it('builds tree from flat page paths', () => {
    const pages = [
      { path: 'notes/normal.html', title: 'Normal' },
      { path: 'notes/deep/nested.html', title: 'Nested' },
      { path: 'guides/setup.html', title: 'Setup' },
    ]
    const tree = buildNavTree(pages)
    expect(tree.name).toBe('root')
    expect(tree.children).toHaveLength(2)
    const notes = tree.children.find(c => c.name === 'notes')!
    expect(notes.children.some(c => c.name === 'Normal' && c.path === 'notes/normal.html')).toBe(true)
    const deep = notes.children.find(c => c.name === 'deep')!
    expect(deep.children.some(c => c.name === 'Nested' && c.path === 'notes/deep/nested.html')).toBe(true)
    const guides = tree.children.find(c => c.name === 'guides')!
    expect(guides.children.some(c => c.name === 'Setup' && c.path === 'guides/setup.html')).toBe(true)
  })

  it('sorts directories before files, then alphabetically', () => {
    const pages = [
      { path: 'b-file.html', title: 'B File' },
      { path: 'a-dir/child.html', title: 'Child' },
      { path: 'a-file.html', title: 'A File' },
    ]
    const tree = buildNavTree(pages)
    expect(tree.children[0].name).toBe('a-dir')
    expect(tree.children[1].name).toBe('A File')
    expect(tree.children[2].name).toBe('B File')
  })
})

describe('buildBreadcrumb', () => {
  it('builds breadcrumb for nested page', () => {
    const crumbs = buildBreadcrumb('notes/deep/nested.html')
    expect(crumbs).toEqual([
      { name: 'notes', path: 'notes/' },
      { name: 'deep', path: 'notes/deep/' },
      { name: 'nested', path: null },
    ])
  })

  it('builds breadcrumb for top-level page', () => {
    const crumbs = buildBreadcrumb('setup.html')
    expect(crumbs).toEqual([
      { name: 'setup', path: null },
    ])
  })
})
