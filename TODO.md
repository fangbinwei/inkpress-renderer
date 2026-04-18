# Inkpress TODO

Tracking outstanding items across the Inkpress project.

## P1 — Before first real users

- [ ] Publish `inkpress-renderer` to npm
- [ ] `inkpress-render-action`: commit `dist/` and verify GitHub Action marketplace publishing
- [ ] Delete failure visibility: add `deleteErrors` to `FullPublishReport` and display in report modal
- [ ] `siteName` should be configurable via `RenderOptions`, not hardcoded as "Inkpress Site"
- [ ] Nav links use absolute paths (`/`) which break with OSS prefix — switch to relative paths
- [ ] `site.json` — currently generated and uploaded but no code consumes it; decide: make opt-in via `RenderOptions.includeSiteIndex` OR strip sensitive frontmatter fields (source/author/etc.) before writing, since frontmatter leaks even in `html`-only mode
- [ ] Submit to Obsidian community plugin marketplace (after BRAT testing)

## P2 — Future enhancements

- [ ] Auto-publish: on-save / interval trigger modes
- [ ] Tier 3 Obsidian semantics: callout, embed/transclusion, block reference, tags
- [ ] Tier 4: backlinks, graph view, full-text search
- [ ] Blog mode: time-sorted article listing
- [ ] Multiple themes / user-customizable themes
- [ ] STS temporary credentials
- [ ] Mobile support (replace Node APIs with browser-compatible alternatives)
- [ ] Bundle size optimization: shiki WASM (9.8MB) — consider highlight.js or lazy loading
- [ ] `unescapeHtml` long-term: extract code at rehype AST level to avoid HTML round-trip
- [ ] `inkpress-render-action`: add smoke tests with test vault in CI
- [ ] i18n (plugin UI in Chinese)
