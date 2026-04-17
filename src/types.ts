// --- FileSystem Abstraction ---

export interface FileSystemAdapter {
  readFile(path: string): Promise<Buffer>
  readText(path: string): Promise<string>
  listFiles(dir: string): Promise<string[]>
  exists(path: string): Promise<boolean>
  stat(path: string): Promise<{ mtime: number; size: number }>
}

// --- Render Options & Result ---

export interface RenderOptions {
  vaultPath: string
  publishDirs: string[]
  theme: Theme
  uploadMode: 'html' | 'html+md'
  deadLinkPolicy: 'silent' | 'marked'
  fs: FileSystemAdapter
  onProgress?: (phase: 'render', current: number, total: number) => void
}

export interface RenderResult {
  files: OutputFile[]
  report: PublishReport
}

export interface OutputFile {
  relativePath: string
  content: Buffer | string
  contentType: string
  cacheControl: string
}

// --- Report ---

export interface PublishReport {
  rendered: number
  skipped: FileSkipEntry[]
  deadLinks: DeadLinkEntry[]
  missingImages: MissingImageEntry[]
  warnings: string[]
}

export interface FileSkipEntry {
  path: string
  reason: string
}

export interface DeadLinkEntry {
  sourcePath: string
  targetLink: string
  line: number
}

export interface MissingImageEntry {
  sourcePath: string
  imagePath: string
  line: number
}

// --- Theme ---

export interface Theme {
  name: string
  renderPage(ctx: PageContext): string
  renderIndex(ctx: IndexContext): string
  getAssets(): OutputFile[]
}

export interface PageContext {
  title: string
  htmlContent: string
  breadcrumb: BreadcrumbItem[]
  navTree: NavNode
  currentPath: string
  siteConfig: SiteConfig
}

export interface IndexContext {
  navTree: NavNode
  siteConfig: SiteConfig
}

export interface SiteConfig {
  siteName?: string
}

export interface BreadcrumbItem {
  name: string
  path: string | null
}

// --- Navigation ---

export interface NavNode {
  name: string
  path: string | null
  children: NavNode[]
}

// --- Site Index (site.json) ---

export interface SiteIndex {
  generatedAt: string
  pages: PageMeta[]
  navTree: NavNode
}

export interface PageMeta {
  path: string
  sourcePath: string
  title: string
  frontmatter: Record<string, unknown>
  outlinks: string[]
  headings: HeadingMeta[]
}

export interface HeadingMeta {
  level: number
  text: string
  slug: string
}

// --- Internal: parsed page data ---

export interface ParsedPage {
  sourcePath: string
  publishPath: string
  title: string
  frontmatter: Record<string, unknown>
  rawLinks: RawLink[]
  headings: HeadingMeta[]
  htmlContent: string
}

export interface RawLink {
  type: 'wikilink' | 'standard'
  target: string
  isEmbed: boolean
  line: number
}
