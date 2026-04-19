// --- FileSystem Abstraction ---

export interface FileSystemAdapter {
  readFile(path: string): Promise<Buffer>
  readText(path: string): Promise<string>
  listFiles(dir: string): Promise<string[]>
  exists(path: string): Promise<boolean>
  stat(path: string): Promise<{ mtime: number; size: number }>
}

// --- Render Options & Result ---

export type ThemeVariant = 'technical' | 'editorial' | 'manuscript'

export interface RenderOptions {
  vaultPath: string
  publishDirs: string[]
  theme: Theme
  uploadMode: 'html' | 'html+md'
  deadLinkPolicy: 'silent' | 'marked'
  fs: FileSystemAdapter
  variant?: ThemeVariant
  onProgress?: (phase: 'render', current: number, total: number) => void
  signal?: AbortSignal
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

export type DeadLinkReason =
  | 'target-missing' // No file with this name exists anywhere in the vault
  | 'not-published' // File exists in vault but not in any publishDir
  | 'unsupported-asset' // File exists but renderer does not render it (e.g. .excalidraw, .canvas)
  | 'ambiguous' // Multiple files match and short-name lookup is not unique

export interface DeadLinkEntry {
  sourcePath: string
  targetLink: string
  line: number
  reason: DeadLinkReason
  hint: string
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
  headings: HeadingMeta[]
  pageIndex: number
  totalPages: number
  modified?: string
  groupName?: string
  readingTime?: number
  wordCount?: number
  backlinks: BacklinkEntry[]
}

export interface BacklinkEntry {
  path: string
  title: string
  excerpt: string
}

export interface IndexContext {
  navTree: NavNode
  siteConfig: SiteConfig
}

export interface SiteConfig {
  siteName?: string
  variant?: ThemeVariant
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
