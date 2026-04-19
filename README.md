English | [简体中文](./README.zh-CN.md)

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
