import { createHash } from 'node:crypto'
import type {
  IndexContext,
  OutputFile,
  PageContext,
  Theme,
} from '../../types.js'
import { renderIndexPage } from './index-page.js'
import { renderPageLayout } from './layout.js'
import { CSS, JS } from './styles.js'

function shortHash(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 8)
}

const CSS_PATH = `_assets/inkpress/style.${shortHash(CSS)}.css`
const JS_PATH = `_assets/inkpress/script.${shortHash(JS)}.js`
const BASE_URL = ''

export class DefaultTheme implements Theme {
  name = 'default'

  renderPage(ctx: PageContext): string {
    const groupName = deriveGroupName(ctx.currentPath, ctx.breadcrumb)
    return renderPageLayout({
      title: ctx.title,
      htmlContent: ctx.htmlContent,
      breadcrumb: ctx.breadcrumb,
      navTree: ctx.navTree,
      currentPath: ctx.currentPath,
      siteName: ctx.siteConfig.siteName || 'Inkpress Site',
      variant: ctx.siteConfig.variant,
      cssPath: CSS_PATH,
      jsPath: JS_PATH,
      baseUrl: BASE_URL,
      headings: ctx.headings,
      pageIndex: ctx.pageIndex,
      totalPages: ctx.totalPages,
      modified: ctx.modified,
      groupName: ctx.groupName || groupName,
      readingTime: ctx.readingTime,
      wordCount: ctx.wordCount,
      backlinks: ctx.backlinks,
    })
  }

  renderIndex(ctx: IndexContext): string {
    return renderIndexPage({
      navTree: ctx.navTree,
      siteName: ctx.siteConfig.siteName || 'Inkpress Site',
      variant: ctx.siteConfig.variant,
      cssPath: CSS_PATH,
      jsPath: JS_PATH,
      baseUrl: BASE_URL,
    })
  }

  getAssets(): OutputFile[] {
    return [
      {
        relativePath: CSS_PATH,
        content: CSS,
        contentType: 'text/css',
        cacheControl: 'max-age=2592000',
      },
      {
        relativePath: JS_PATH,
        content: JS,
        contentType: 'application/javascript',
        cacheControl: 'max-age=2592000',
      },
    ]
  }
}

function deriveGroupName(
  currentPath: string,
  breadcrumb: PageContext['breadcrumb'],
): string {
  const fromBc =
    breadcrumb.find(b => b.path === null && b.name) ??
    breadcrumb.find(b => b.path !== null)
  if (fromBc) return fromBc.name
  const seg = currentPath.split('/')
  return seg.length > 1 ? seg[0] : ''
}
