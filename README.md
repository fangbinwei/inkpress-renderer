# inkpress-renderer

Render Obsidian vault folders into a static HTML site with navigation, breadcrumbs, and dark mode.

## Install

```bash
pnpm add inkpress-renderer
```

## Basic Usage

```ts
import { renderSite, DefaultTheme, FileSystemAdapter } from 'inkpress-renderer'

const adapter = new FileSystemAdapter('/path/to/vault')

const result = await renderSite({
  adapter,
  theme: DefaultTheme,
  publishDirs: ['Notes', 'Blog'],
  siteTitle: 'My Site',
})

console.log(result.pages)   // rendered HTML pages
console.log(result.assets)  // theme assets to copy
```

## Key Interfaces

### RenderOptions

| Field | Type | Description |
|-------|------|-------------|
| `adapter` | `FileSystemAdapter` | Provides file access to the vault |
| `theme` | `Theme` | Theme object (use `DefaultTheme`) |
| `publishDirs` | `string[]` | Vault folders to include |
| `siteTitle` | `string` | Site title shown in navigation |
| `baseUrl` | `string?` | Optional base URL prefix |

### RenderResult

| Field | Type | Description |
|-------|------|-------------|
| `pages` | `RenderedPage[]` | Array of rendered HTML pages |
| `assets` | `ThemeAsset[]` | Static assets required by the theme |
| `siteJson` | `object` | Site metadata (see below) |

## site.json

Each render produces a `site.json` manifest that describes the page tree, navigation structure, and metadata. This file is intended for future extensions such as search indexing, incremental rebuilds, and CI diffing.

## Inkpress Ecosystem

- **obsidian-inkpress** — Obsidian plugin for one-click publish to Aliyun OSS: [fangbinwei/obsidian-inkpress](https://github.com/fangbinwei/obsidian-inkpress)
- **inkpress-render-action** — GitHub Action for CI-based publishing: [fangbinwei/inkpress-render-action](https://github.com/fangbinwei/inkpress-render-action)

---

# inkpress-renderer（中文）

将 Obsidian 知识库文件夹渲染为带有导航栏、面包屑和暗色模式的静态 HTML 站点。

## 安装

```bash
pnpm add inkpress-renderer
```

## 基本用法

```ts
import { renderSite, DefaultTheme, FileSystemAdapter } from 'inkpress-renderer'

const adapter = new FileSystemAdapter('/path/to/vault')

const result = await renderSite({
  adapter,
  theme: DefaultTheme,
  publishDirs: ['Notes', 'Blog'],
  siteTitle: 'My Site',
})

console.log(result.pages)   // rendered HTML pages
console.log(result.assets)  // theme assets to copy
```

## 核心接口

### RenderOptions

| 字段 | 类型 | 说明 |
|------|------|------|
| `adapter` | `FileSystemAdapter` | 提供对知识库文件的访问 |
| `theme` | `Theme` | 主题对象（使用 `DefaultTheme`） |
| `publishDirs` | `string[]` | 需要发布的知识库文件夹 |
| `siteTitle` | `string` | 显示在导航栏中的站点标题 |
| `baseUrl` | `string?` | 可选的基础 URL 前缀 |

### RenderResult

| 字段 | 类型 | 说明 |
|------|------|------|
| `pages` | `RenderedPage[]` | 渲染后的 HTML 页面数组 |
| `assets` | `ThemeAsset[]` | 主题所需的静态资源 |
| `siteJson` | `object` | 站点元数据（见下文） |

## site.json

每次渲染都会生成一个 `site.json` 清单文件，描述页面树、导航结构和元数据。该文件面向未来扩展，例如搜索索引、增量重建和 CI 差异对比。

## Inkpress 生态

- **obsidian-inkpress** — 一键发布到阿里云 OSS 的 Obsidian 插件：[fangbinwei/obsidian-inkpress](https://github.com/fangbinwei/obsidian-inkpress)
- **inkpress-render-action** — 基于 CI 发布的 GitHub Action：[fangbinwei/inkpress-render-action](https://github.com/fangbinwei/inkpress-render-action)
