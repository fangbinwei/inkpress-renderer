import type { BreadcrumbItem } from '../types.js'

export function buildBreadcrumb(pagePath: string): BreadcrumbItem[] {
  const parts = pagePath.split('/')
  const crumbs: BreadcrumbItem[] = []
  for (let i = 0; i < parts.length; i++) {
    const isLast = i === parts.length - 1
    const name = isLast ? parts[i].replace(/\.html$/, '') : parts[i]
    const path = isLast ? null : parts.slice(0, i + 1).join('/') + '/'
    crumbs.push({ name, path })
  }
  return crumbs
}
