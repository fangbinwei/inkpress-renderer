import type { Theme, PageContext, IndexContext, OutputFile } from '../../types.js'
import { renderPageLayout } from './layout.js'
import { renderIndexPage } from './index-page.js'
import { CSS, JS } from './styles.js'

const CSS_PATH = '_assets/inkpress/style.css'
const JS_PATH = '_assets/inkpress/script.js'

export class DefaultTheme implements Theme {
  name = 'default'

  renderPage(ctx: PageContext): string {
    return renderPageLayout({
      title: ctx.title, htmlContent: ctx.htmlContent, breadcrumb: ctx.breadcrumb,
      navTree: ctx.navTree, currentPath: ctx.currentPath,
      siteName: ctx.siteConfig.siteName || 'Inkpress Site', cssPath: CSS_PATH, jsPath: JS_PATH,
    })
  }

  renderIndex(ctx: IndexContext): string {
    return renderIndexPage({
      navTree: ctx.navTree, siteName: ctx.siteConfig.siteName || 'Inkpress Site',
      cssPath: CSS_PATH, jsPath: JS_PATH,
    })
  }

  getAssets(): OutputFile[] {
    return [
      { relativePath: CSS_PATH, content: CSS, contentType: 'text/css', cacheControl: 'max-age=2592000' },
      { relativePath: JS_PATH, content: JS, contentType: 'application/javascript', cacheControl: 'max-age=2592000' },
    ]
  }
}
