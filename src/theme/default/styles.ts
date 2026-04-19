export const CSS = `
/* ============ DESIGN TOKENS — variant: technical (default) ============ */

:root {
  --bg: #fafafa;
  --bg-sidebar: #f3f3f2;
  --bg-elev: #ffffff;
  --text: #0e0e10;
  --text-secondary: #5a5a5e;
  --text-muted: #8e8e93;
  --border: #e5e5e4;
  --border-strong: #cbcbc8;
  --accent: oklch(0.52 0.14 250);
  --accent-hover: oklch(0.44 0.16 250);
  --code-bg: #f3f3f2;
  --code-border: #e5e5e4;
  --selection: oklch(0.85 0.08 250 / 0.5);
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  --font-body: 'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-head: 'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-ui: 'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Consolas, monospace;
  --head-weight: 650;
  --body-size: 16px;
  --line-height: 1.6;
  --radius-sm: 3px;
  --radius-md: 5px;
  --measure: 72;
  --sidebar-w: 280px;
  --gap: 1rem;
}

html.mode-dark {
  --bg: #0e0e10;
  --bg-sidebar: #07070a;
  --bg-elev: #17171a;
  --text: #e8e8ea;
  --text-secondary: #9d9da3;
  --text-muted: #6a6a70;
  --border: #23232a;
  --border-strong: #34343d;
  --accent: oklch(0.72 0.12 250);
  --accent-hover: oklch(0.82 0.11 250);
  --code-bg: #0a0a0d;
  --code-border: #23232a;
  --selection: oklch(0.55 0.14 250 / 0.4);
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

html.variant-editorial {
  --bg: #faf8f3;
  --bg-sidebar: #f3efe6;
  --bg-elev: #ffffff;
  --text: #1a1814;
  --text-secondary: #6b655c;
  --text-muted: #9a9387;
  --border: #e4dfd2;
  --border-strong: #cec8b8;
  --accent: oklch(0.55 0.11 45);
  --accent-hover: oklch(0.48 0.12 45);
  --code-bg: #f0ebdf;
  --code-border: #e4dfd2;
  --selection: oklch(0.85 0.08 80 / 0.5);
  --font-body: 'Source Serif 4', Georgia, serif;
  --font-head: 'Source Serif 4', Georgia, serif;
  --head-weight: 600;
  --body-size: 17.5px;
  --line-height: 1.65;
  --measure: 68;
  --radius-sm: 2px;
  --radius-md: 3px;
}

html.variant-editorial.mode-dark {
  --bg: #1a1815;
  --bg-sidebar: #141310;
  --bg-elev: #22201c;
  --text: #e8e3d6;
  --text-secondary: #a39d8e;
  --text-muted: #6b655a;
  --border: #2e2a24;
  --border-strong: #3d3830;
  --accent: oklch(0.72 0.11 60);
  --accent-hover: oklch(0.82 0.10 60);
  --code-bg: #12100d;
  --code-border: #2e2a24;
}

html.variant-manuscript {
  --bg: #f5f1e8;
  --bg-sidebar: #ede8da;
  --bg-elev: #fbf8ef;
  --text: #2a2520;
  --text-secondary: #6e6558;
  --text-muted: #9c9382;
  --border: #ddd6c3;
  --border-strong: #c2baa2;
  --accent: oklch(0.48 0.11 25);
  --accent-hover: oklch(0.40 0.12 25);
  --code-bg: #eae4d2;
  --code-border: #ddd6c3;
  --selection: oklch(0.85 0.08 60 / 0.5);
  --font-body: 'Source Serif 4', Georgia, serif;
  --font-head: 'Source Serif 4', Georgia, serif;
  --font-ui: 'Source Serif 4', Georgia, serif;
  --head-weight: 600;
  --body-size: 18px;
  --line-height: 1.7;
  --measure: 64;
  --radius-sm: 1px;
  --radius-md: 2px;
}

html.variant-manuscript.mode-dark {
  --bg: #1f1b16;
  --bg-sidebar: #181410;
  --bg-elev: #26221c;
  --text: #ece5d3;
  --text-secondary: #a69e8a;
  --text-muted: #6c6454;
  --border: #332d24;
  --border-strong: #433b2e;
  --accent: oklch(0.72 0.10 35);
  --accent-hover: oklch(0.82 0.09 35);
  --code-bg: #15120d;
  --code-border: #332d24;
}

/* ============ RESET ============ */

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: var(--body-size);
  line-height: var(--line-height);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "kern", "liga";
  transition: background 0.25s ease, color 0.25s ease;
}

::selection { background: var(--selection); }

a { color: var(--accent); text-decoration: none; }
a:hover { color: var(--accent-hover); }

/* ============ LAYOUT ============ */

.layout {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
  min-height: 100vh;
}

.sidebar {
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  font-family: var(--font-ui);
  transition: box-shadow 0.3s ease;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: calc(var(--gap) * 1.5) var(--gap);
  gap: calc(var(--gap) * 1.25);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: calc(var(--gap) * 0.9);
  border-bottom: 1px solid var(--border);
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  cursor: pointer;
  font-family: var(--font-head);
  color: var(--text);
}

.brand-mark {
  font-family: var(--font-head);
  font-weight: 600;
  font-size: 1.25rem;
  font-style: italic;
  color: var(--text);
  position: relative;
  padding-right: 0.15em;
  line-height: 1;
}
.brand-mark.small { font-size: 1rem; }

.brand-dot {
  position: absolute;
  right: -0.05em;
  top: 0.05em;
  width: 0.28em;
  height: 0.28em;
  background: var(--accent);
  border-radius: 50%;
  display: inline-block;
}

.brand-name {
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--text);
  letter-spacing: 0.005em;
}

.icon-btn {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--font-ui);
}
.icon-btn:hover {
  color: var(--text);
  border-color: var(--border-strong);
  background: var(--bg-elev);
}

.theme-toggle .icon-sun { display: none; }
.theme-toggle .icon-moon { display: inline; }
html.mode-dark .theme-toggle .icon-sun { display: inline; }
html.mode-dark .theme-toggle .icon-moon { display: none; }

/* ============ SIDEBAR SEARCH ============ */

.sidebar-search {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0 0.5rem;
  height: 30px;
  margin: 0.2rem 0 0.6rem;
  min-width: 0;
}
.sidebar-search:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px color-mix(in oklch, var(--accent) 18%, transparent);
}
.sidebar-search .search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
  margin-right: 0.45rem;
}
.sidebar-search input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font: inherit;
  font-size: 0.82rem;
  color: var(--text);
  font-family: var(--font-ui);
  min-width: 0;
}
.sidebar-search input::placeholder { color: var(--text-muted); }
.search-clear {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
}
.search-clear:hover { color: var(--text); }
.search-kbd {
  border: 1px solid var(--border-strong);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 1px 5px;
  border-radius: 3px;
  margin-left: 0.3rem;
  line-height: 1;
}
.sidebar-search:focus-within .search-kbd { display: none; }

.nav-empty {
  padding: 0.6rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  font-style: italic;
}

/* ============ NAV TREE ============ */

.nav-tree {
  flex: 1;
  overflow-y: auto;
  margin: 0 calc(var(--gap) * -0.5);
  padding: 0 calc(var(--gap) * 0.5);
}

.nav-group {
  margin-bottom: calc(var(--gap) * 1.1);
}

.nav-tree ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.nav-tree li {
  position: relative;
}

.nav-tree a {
  display: block;
  padding: 0.26rem 0.6rem;
  font-size: 0.88rem;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition: all 0.12s ease;
  line-height: 1.35;
  position: relative;
  font-family: var(--font-ui);
  font-weight: 450;
}
.nav-tree a:hover {
  color: var(--text);
  background: var(--bg-elev);
}
.nav-tree a.active {
  color: var(--accent);
  background: var(--bg-elev);
  font-weight: 550;
}
.nav-tree a.active::before {
  content: "";
  position: absolute;
  left: -2px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: var(--accent);
  border-radius: 2px;
}

.nav-group-label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 0.4rem 0.6rem;
  margin-bottom: 0.1rem;
  font-family: var(--font-mono);
  border-radius: var(--radius-sm);
  transition: background 0.12s ease, color 0.12s ease;
  text-align: left;
  line-height: 1;
}
.nav-group-label > span.nav-group-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nav-group-label:hover {
  background: var(--bg-elev);
  color: var(--text-secondary);
}
.nav-caret {
  transition: transform 0.2s ease;
  color: var(--text-muted);
  flex-shrink: 0;
}
.nav-group.collapsed .nav-caret { transform: rotate(0deg); }
.nav-group:not(.collapsed) .nav-caret { transform: rotate(90deg); }
.nav-group.collapsed > ul { display: none; }
.nav-count {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--text-muted);
  opacity: 0.7;
  letter-spacing: 0;
}
.nav-subgroup {
  margin-top: 0.2rem;
  padding-left: 0.6rem;
}
.nav-subgroup > .nav-subgroup-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
  font-family: var(--font-head);
  padding: 0.25rem 0 0.15rem 0.6rem;
  letter-spacing: 0.01em;
}
.nav-tree mark {
  background: color-mix(in oklch, var(--accent) 25%, transparent);
  color: inherit;
  padding: 0 1px;
  border-radius: 2px;
}

.sidebar-footer {
  padding-top: var(--gap);
  border-top: 1px solid var(--border);
  font-size: 0.72rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  line-height: 1.5;
}
.foot-line.muted { color: var(--text-muted); opacity: 0.7; }
.foot-mark {
  color: var(--text-secondary);
  font-style: italic;
  font-family: var(--font-head);
}
.foot-help {
  margin-top: 0.8rem;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  padding: 3px 7px 3px 5px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  transition: color 0.12s ease, border-color 0.12s ease, background 0.12s ease;
}
.foot-help:hover {
  color: var(--text);
  border-color: var(--border-strong);
  background: var(--bg-elev);
}
.foot-help > span:first-child {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid currentColor;
  border-radius: 3px;
  font-size: 0.7rem;
  line-height: 1;
  opacity: 0.7;
}
.foot-help-label {
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ============ MAIN COL + CONTENT ============
   Main column is a grid [ content-wrap | toc ].
   Topbar and sidebar-scrim span both. TOC lives OUTSIDE content-wrap. */

.main-col {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-rows: auto 1fr;
  min-width: 0;
}
.main-col > .topbar { grid-column: 1 / -1; }
.main-col > .sidebar-scrim { grid-column: 1 / -1; }

/* content-wrap: 2-col grid (folio gutter + content). */
.content-wrap {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  column-gap: 3rem;
  padding: 3rem 3rem 6rem 2rem;
  min-height: 100vh;
  width: 100%;
  max-width: 74rem;
  margin: 0 auto;
  min-width: 0;
}
@media (max-width: 1100px) {
  .content-wrap {
    padding: 2.5rem 2rem 4rem 2rem;
    grid-template-columns: 2rem minmax(0, 1fr);
    column-gap: 1.5rem;
  }
}
@media (min-width: 1600px) {
  .content-wrap { max-width: 82rem; column-gap: 4rem; }
}
@media (min-width: 2000px) {
  .content-wrap { max-width: 92rem; padding-top: 4rem; column-gap: 5rem; }
}

.content {
  grid-column: 2;
  width: 100%;
  justify-self: center;
  max-width: 56rem;
  position: relative;
  transition: max-width 0.25s ease;
  animation: fadeUp 0.35s ease-out;
}
/* When TOC is collapsed or absent, reading column can breathe wider */
body[data-toc="collapsed"] .content,
body[data-toc="none"] .content {
  max-width: 62rem;
}
@media (min-width: 1600px) {
  .content { max-width: 62rem; }
  body[data-toc="collapsed"] .content,
  body[data-toc="none"] .content {
    max-width: 70rem;
  }
}
@media (min-width: 2000px) {
  .content { max-width: 70rem; }
  body[data-toc="collapsed"] .content,
  body[data-toc="none"] .content {
    max-width: 80rem;
  }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ============ FOLIO ============ */

.folio {
  grid-column: 1;
  position: sticky;
  top: 3rem;
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.9rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  user-select: none;
  width: 3rem;
  margin-top: 0.2rem;
}
.folio-num {
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}
.folio-group {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-style: italic;
  font-family: var(--font-head);
  text-transform: none;
  letter-spacing: 0.01em;
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.1;
  max-height: 12rem;
  overflow: hidden;
}
@media (max-width: 1180px) { .folio { display: none; } }
@media (min-width: 2000px) { .folio { margin-left: -1rem; } }

/* ============ BREADCRUMB ============ */

.breadcrumb {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-bottom: calc(var(--gap) * 2);
  font-family: var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0;
}
.breadcrumb a {
  color: var(--text-secondary);
  transition: color 0.12s ease;
}
.breadcrumb a:hover { color: var(--accent); }
.breadcrumb .sep {
  margin: 0 0.5em;
  color: var(--text-muted);
  opacity: 0.5;
}

/* ============ NOTE CONTENT ============ */

.content > h1 {
  font-family: var(--font-head);
  font-weight: var(--head-weight);
  font-size: clamp(1.9rem, 3.8vw, 2.7rem);
  line-height: 1.08;
  letter-spacing: -0.015em;
  color: var(--text);
  margin-bottom: 0.3em;
  text-wrap: balance;
  position: relative;
  padding-right: 0.35em;
}
.content > h1::after {
  content: "";
  display: block;
  margin-top: 0.55em;
  width: 56px;
  height: 6px;
  background-color: var(--accent);
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 6'><rect x='0' y='2' width='46' height='2' fill='black'/><circle cx='52' cy='3' r='3' fill='black'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 6'><rect x='0' y='2' width='46' height='2' fill='black'/><circle cx='52' cy='3' r='3' fill='black'/></svg>");
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}

html.variant-editorial .content > h1 {
  font-style: italic;
  letter-spacing: -0.02em;
}
html.variant-manuscript .content > h1 {
  font-variant: small-caps;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  font-weight: 500;
  font-family: var(--font-head);
}
html.variant-technical .content > h1 {
  font-weight: 680;
  letter-spacing: -0.025em;
}

.content h2 {
  font-family: var(--font-head);
  font-weight: var(--head-weight);
  font-size: 1.35rem;
  line-height: 1.25;
  letter-spacing: -0.005em;
  margin-top: 2.2em;
  margin-bottom: 0.5em;
  text-wrap: balance;
}
.content h3 {
  font-family: var(--font-head);
  font-weight: var(--head-weight);
  font-size: 1.1rem;
  margin-top: 1.8em;
  margin-bottom: 0.4em;
}
.content h4, .content h5, .content h6 {
  font-family: var(--font-head);
  font-weight: var(--head-weight);
  margin-top: 1.6em;
  margin-bottom: 0.4em;
  color: var(--text-secondary);
}

.content p {
  margin-bottom: 1.15em;
  color: var(--text);
}

.content ul, .content ol {
  margin-bottom: 1.4em;
  padding-left: 1.5em;
}
.content ul li, .content ol li {
  margin-bottom: 0.4em;
  padding-left: 0.25em;
}
.content ul li::marker { color: var(--text-muted); }
.content ol li::marker { color: var(--text-muted); font-variant-numeric: oldstyle-nums; }

.content blockquote {
  border-left: 2px solid var(--accent);
  padding: 0.8em 0 0.8em 1.5em;
  margin: 2em 0 2em -0.2em;
  color: var(--text-secondary);
  font-style: italic;
  position: relative;
}
.content blockquote::before {
  content: "\\201C";
  position: absolute;
  left: -0.3em;
  top: -0.15em;
  font-family: var(--font-head);
  font-size: 3.2em;
  line-height: 1;
  color: var(--accent);
  opacity: 0.25;
  font-style: normal;
  pointer-events: none;
}
.content blockquote p { margin-bottom: 0.4em; font-size: 1.05em; }
.content blockquote cite {
  display: block;
  font-size: 0.82em;
  font-style: normal;
  color: var(--text-muted);
  letter-spacing: 0.01em;
}

.content p a, .content li a {
  text-decoration: none;
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: 0 100%;
  padding-bottom: 1px;
  transition: background-size 0.2s ease;
}
.content p a:hover, .content li a:hover {
  background-size: 100% 2px;
}

/* Backlinks card links must NOT inherit the body-link underline */
.content .backlinks-list a,
.content .backlinks-list li a {
  background-image: none;
  background-size: 0;
  padding-bottom: 0;
}

.content img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
}
.content figure { margin: 2em 0; }
.content figure figcaption {
  margin-top: 0.7em;
  font-size: 0.8rem;
  color: var(--text-muted);
  font-style: italic;
  font-family: var(--font-head);
  text-align: center;
}

.content table {
  border-collapse: collapse;
  margin: 1.4em 0;
  font-size: 0.94em;
  width: 100%;
}
.content th, .content td {
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  text-align: left;
}
.content th {
  background: var(--bg-sidebar);
  font-weight: 600;
  color: var(--text);
}

.content hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2.4em 0;
}

/* ============ CODE ============ */

.content pre {
  margin: 1.4em 0 1.6em;
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.55;
  position: relative;
}
.content pre::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--accent);
  opacity: 0.8;
  z-index: 1;
}
.content pre code {
  display: block;
  padding: 1em 1.1em;
  overflow-x: auto;
  white-space: pre;
  color: var(--text);
  background: transparent;
}
.content pre.shiki,
.content pre.shiki code {
  background-color: transparent !important;
}
html.mode-dark .shiki,
html.mode-dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: transparent !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}

.pre-chrome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4em 0.9em;
  font-size: 0.7rem;
  border-bottom: 1px solid var(--code-border);
  color: var(--text-muted);
  background: var(--bg-sidebar);
  letter-spacing: 0.04em;
  text-transform: lowercase;
  font-family: var(--font-mono);
}

.copy-btn {
  background: none;
  border: 1px solid transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  padding: 2px 6px;
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.12s ease;
  text-transform: lowercase;
  letter-spacing: 0.02em;
  line-height: 1;
}
.copy-btn:hover {
  color: var(--text);
  border-color: var(--border);
  background: var(--bg);
}

.content :not(pre) > code {
  font-family: var(--font-mono);
  font-size: 0.88em;
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  padding: 0.1em 0.35em;
  border-radius: var(--radius-sm);
}

/* Wikilinks with a dedicated class (set by link-resolver for now default is same as normal link) */
.content a.wikilink {
  position: relative;
  text-decoration: none;
  border-bottom: 1px solid color-mix(in oklch, var(--accent) 40%, transparent);
  transition: all 0.12s ease;
  background-image: none;
  padding-bottom: 0;
}
.content a.wikilink:hover {
  border-bottom-color: var(--accent);
  background: color-mix(in oklch, var(--accent) 8%, transparent);
}

/* Dead-link marker */
.content .dead-link {
  color: var(--text-muted);
  text-decoration: line-through;
  cursor: not-allowed;
}

/* ============ NOTE META (reading time · words) ============ */

.note-meta {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
  margin-top: 1.1em;
  margin-bottom: 2.4em;
  padding-bottom: 1.1em;
  position: relative;
}
.note-meta::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--border);
  opacity: 0.6;
}
html.variant-technical .note-meta {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.7rem;
}
html.variant-editorial .note-meta,
html.variant-manuscript .note-meta {
  font-style: italic;
  font-family: var(--font-head);
  font-size: 0.85rem;
  letter-spacing: 0;
  text-transform: none;
  color: var(--text-secondary);
}

/* ============ BACKLINKS ============ */

.backlinks {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}
.backlinks-header {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-bottom: 1rem;
  padding-right: 0.2rem;
}
.backlinks-title {
  font-family: var(--font-head);
  font-size: 0.9rem;
  font-style: italic;
  color: var(--text-secondary);
  letter-spacing: 0.01em;
}
.backlinks-count {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--bg-elev);
  padding: 1px 6px;
  border: 1px solid var(--border);
  border-radius: 3px;
}
.backlinks-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
  display: grid;
  gap: 0.2rem;
}
.backlinks-list a {
  display: block;
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  text-decoration: none;
  transition: all 0.15s ease;
  position: relative;
  background-image: none;
}
.backlinks-list a:hover {
  border-color: var(--border);
  background: var(--bg-elev);
}
.backlinks-list a::before {
  content: "\\21B3";
  position: absolute;
  left: -0.3rem;
  top: 0.8rem;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.backlinks-list a:hover::before { opacity: 0.7; }
.bl-title {
  display: block;
  font-weight: 550;
  color: var(--text);
  font-size: 0.92rem;
  margin-bottom: 0.25rem;
  font-family: var(--font-head);
}
.bl-excerpt {
  display: block;
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.4;
  font-family: var(--font-body);
}
@media (max-width: 860px) {
  .backlinks-list a::before { left: 0.1rem; }
  .backlinks-list a { padding-left: 1.2rem; }
}

/* ============ ARTICLE FOOTER ============ */

.article-footer {
  margin-top: 4rem;
}
.article-footer-rule {
  width: 40px;
  height: 1px;
  background: var(--accent);
  margin-bottom: 1rem;
}
.article-footer-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.article-footer-meta strong {
  color: var(--text-secondary);
  font-weight: 500;
}

/* ============ TOPBAR (MOBILE) ============ */

.topbar {
  display: none;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(8px);
}
.topbar-brand {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-family: var(--font-head);
  font-size: 0.95rem;
  font-weight: 500;
}

.sidebar-scrim { display: none; }

@media (max-width: 860px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: min(300px, 86vw);
    height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: 4px 0 24px rgba(0,0,0,0.1);
  }
  .sidebar.mobile-open { transform: translateX(0); }
  .topbar { display: flex; }
  .content-wrap { padding: 1.5rem 1.25rem 4rem; }
  .sidebar-scrim {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
    z-index: 45;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }
  .sidebar-scrim.on {
    opacity: 1;
    pointer-events: auto;
  }
}

/* ============ TOC ============
   TOC lives OUTSIDE content-wrap as a sibling in .main-col (grid col 2). */

.toc {
  grid-column: 2;
  position: sticky;
  top: 2rem;
  align-self: start;
  font-size: 0.78rem;
  padding: 3rem 2rem 2rem 0;
  min-width: 0;
}
.toc.open {
  width: 14rem;
  padding-left: 1rem;
  border-left: 1px solid var(--border);
}
.toc.open > .toc-rail { display: none; }
.toc.collapsed {
  width: auto;
  justify-self: end;
}
.toc.collapsed > .toc-head,
.toc.collapsed > ul { display: none; }
@media (min-width: 1600px) {
  .toc.open { width: 16rem; }
}
@media (min-width: 2000px) {
  .toc.open { width: 18rem; padding-top: 4rem; }
}
.toc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  gap: 0.5rem;
}
.toc-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}
.toc-toggle {
  background: none;
  border: 1px solid transparent;
  cursor: pointer;
  color: var(--text-muted);
  padding: 3px 7px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: color 0.12s ease, background 0.12s ease, border-color 0.12s ease;
}
.toc-toggle:hover {
  color: var(--accent);
  background: var(--bg-elev);
  border-color: var(--border);
}
.toc-toggle-label { line-height: 1; }
.toc ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.toc a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.12s ease;
  display: block;
  padding: 2px 0;
  line-height: 1.35;
  background-image: none;
}
.toc a:hover { color: var(--text-secondary); }
.toc li.active > a { color: var(--accent); font-weight: 500; }
.toc .toc-h3 { padding-left: 0.8rem; font-size: 0.73rem; }

.toc-rail {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  padding: 0.8rem 0.55rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  color: var(--text-muted);
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.toc-rail:hover {
  color: var(--accent);
  background: var(--bg-elev);
  border-color: var(--border-strong);
  transform: translateX(-2px);
}
.toc-rail-ticks {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 2px 0;
}
.toc-rail-tick {
  display: block;
  width: 16px;
  height: 2px;
  background: var(--border-strong);
  border-radius: 1px;
  transition: background 0.15s ease, width 0.15s ease;
}
.toc-rail-tick.toc-rail-h3 { width: 10px; margin-left: 6px; }
.toc-rail-tick.active {
  background: var(--accent);
  width: 22px;
}
.toc-rail-tick.toc-rail-h3.active { width: 14px; }
.toc-rail-label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0;
}

@media (max-width: 1280px) { .toc { display: none; } }

/* ============ SHORTCUTS OVERLAY ============ */

.shortcuts-scrim {
  position: fixed;
  inset: 0;
  background: color-mix(in oklch, var(--bg) 50%, transparent);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 200;
  display: none;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.15s ease-out;
}
.shortcuts-scrim.open { display: flex; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.shortcuts-card {
  background: var(--bg);
  border: 1px solid var(--border-strong);
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.06);
  padding: 1.5rem 1.8rem 1.3rem;
  min-width: 340px;
  max-width: 92vw;
  animation: popIn 0.18s cubic-bezier(0.2, 1, 0.3, 1);
}
@keyframes popIn {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.shortcuts-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--border);
}
.shortcuts-title {
  font-family: var(--font-head);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.01em;
}
.shortcuts-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 3px;
  display: inline-flex;
  transition: color 0.12s ease, background 0.12s ease;
}
.shortcuts-close:hover { color: var(--text); background: var(--bg-elev); }
.shortcuts-list {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.55rem 1.2rem;
  align-items: center;
  margin: 0;
}
.shortcuts-list dt {
  display: flex;
  gap: 0.3rem;
  justify-self: start;
  margin: 0;
}
.shortcuts-list kbd,
.shortcuts-foot kbd {
  font-family: var(--font-mono);
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-bottom-width: 2px;
  color: var(--text);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.78rem;
  line-height: 1;
  min-width: 22px;
  text-align: center;
  font-weight: 500;
}
.shortcuts-list dd {
  color: var(--text-secondary);
  font-size: 0.88rem;
  margin: 0;
}
.shortcuts-foot {
  margin-top: 1.2rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--border);
  font-size: 0.78rem;
  color: var(--text-muted);
  font-family: var(--font-head);
  font-style: italic;
}
.shortcuts-foot kbd { font-size: 0.7rem; padding: 1px 6px; }

/* ============ SCROLL SHADOW ============ */

body.scrolled .sidebar {
  box-shadow: inset -1px 0 0 var(--border-strong);
}

/* ============ PRINT ============ */

@media print {
  .sidebar, .topbar, .folio, .toc, .sidebar-scrim, .shortcuts-scrim { display: none !important; }
  .layout { grid-template-columns: 1fr; }
  .content-wrap { padding: 0; }
  .content { max-width: 100%; animation: none; }
  body { background: #fff; color: #000; font-size: 11pt; }
  .content > h1, .content h2, .content h3 { page-break-after: avoid; }
  .content pre, .content blockquote, .content figure { page-break-inside: avoid; }
  .copy-btn { display: none; }
  a { color: #000; text-decoration: none; }
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 9pt; color: #555; }
}
`

export const JS = `
(function () {
  'use strict';
  var doc = document;
  var html = doc.documentElement;
  var body = doc.body;

  // ---- Dark mode ----
  try {
    var storedMode = localStorage.getItem('inkpress-mode');
    if (storedMode === 'dark') html.classList.add('mode-dark');
    else if (storedMode === 'light') html.classList.remove('mode-dark');
  } catch (e) {}

  function setMode(dark) {
    html.classList.toggle('mode-dark', !!dark);
    try { localStorage.setItem('inkpress-mode', dark ? 'dark' : 'light'); } catch (e) {}
  }
  function isDark() { return html.classList.contains('mode-dark'); }

  doc.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () { setMode(!isDark()); });
  });

  // ---- Mobile sidebar ----
  var sidebar = doc.querySelector('.sidebar');
  var scrim = doc.querySelector('.sidebar-scrim');
  var menuBtn = doc.querySelector('.menu-btn');
  function openSidebar() { if (sidebar) { sidebar.classList.add('mobile-open'); } if (scrim) { scrim.classList.add('on'); } }
  function closeSidebar() { if (sidebar) { sidebar.classList.remove('mobile-open'); } if (scrim) { scrim.classList.remove('on'); } }
  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (scrim) scrim.addEventListener('click', closeSidebar);

  // ---- Nav group collapse ----
  var collapsedGroups = {};
  try { collapsedGroups = JSON.parse(localStorage.getItem('inkpress-collapsed') || '{}'); } catch (e) {}

  doc.querySelectorAll('.nav-group').forEach(function (g) {
    var name = g.getAttribute('data-group');
    if (name && collapsedGroups[name]) g.classList.add('collapsed');
    var label = g.querySelector('.nav-group-label');
    if (!label) return;
    label.addEventListener('click', function () {
      if (g.classList.contains('search-active')) return;
      g.classList.toggle('collapsed');
      if (name) {
        collapsedGroups[name] = g.classList.contains('collapsed');
        try { localStorage.setItem('inkpress-collapsed', JSON.stringify(collapsedGroups)); } catch (e) {}
      }
    });
  });

  // ---- Sidebar search ----
  var searchInput = doc.querySelector('.sidebar-search input');
  var searchClear = doc.querySelector('.search-clear');
  var navEmpty = doc.querySelector('.nav-empty');

  function filterNav(q) {
    q = (q || '').trim().toLowerCase();
    var anyVisible = false;
    doc.querySelectorAll('.nav-group').forEach(function (g) {
      var group = g.getAttribute('data-group') || '';
      var groupMatches = group.toLowerCase().indexOf(q) !== -1;
      var matched = 0;
      g.querySelectorAll('a[data-nav-leaf]').forEach(function (a) {
        var name = a.getAttribute('data-name') || a.textContent || '';
        var lower = name.toLowerCase();
        var show = !q || groupMatches || lower.indexOf(q) !== -1;
        var li = a.closest('li');
        if (li) li.style.display = show ? '' : 'none';
        if (show) {
          matched += 1;
          // highlight
          if (q && !groupMatches) {
            var idx = lower.indexOf(q);
            if (idx !== -1) {
              a.innerHTML = escapeHtml(name.slice(0, idx)) + '<mark>' + escapeHtml(name.slice(idx, idx + q.length)) + '</mark>' + escapeHtml(name.slice(idx + q.length));
            } else {
              a.textContent = name;
            }
          } else {
            a.textContent = name;
          }
        } else {
          a.textContent = name;
        }
      });
      if (q) {
        g.classList.add('search-active');
        g.classList.remove('collapsed');
        g.style.display = matched > 0 || groupMatches ? '' : 'none';
      } else {
        g.classList.remove('search-active');
        g.style.display = '';
        if (collapsedGroups[group]) g.classList.add('collapsed');
        else g.classList.remove('collapsed');
      }
      if (matched > 0 || groupMatches) anyVisible = true;
    });
    if (navEmpty) navEmpty.style.display = q && !anyVisible ? '' : 'none';
    if (navEmpty) navEmpty.textContent = q ? 'No notes match "' + q + '"' : '';
    if (searchClear) searchClear.style.display = q ? '' : 'none';
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }
  if (searchInput) {
    searchInput.addEventListener('input', function (e) { filterNav(e.target.value); });
    if (searchClear) searchClear.addEventListener('click', function () { searchInput.value=''; filterNav(''); searchInput.focus(); });
    filterNav('');
  }

  // ---- Code copy buttons ----
  doc.querySelectorAll('.content pre').forEach(function (pre) {
    if (pre.querySelector('.pre-chrome')) return;
    var code = pre.querySelector('code');
    var lang = '';
    // Try shiki class
    var m = pre.className.match(/language-([A-Za-z0-9+#.-]+)/);
    if (m) lang = m[1];
    if (!lang && code) {
      var cm = code.className.match(/language-([A-Za-z0-9+#.-]+)/);
      if (cm) lang = cm[1];
    }
    if (!lang) lang = 'text';

    var chrome = doc.createElement('div');
    chrome.className = 'pre-chrome';
    chrome.innerHTML = '<span class="pre-lang">' + escapeHtml(lang) + '</span>' +
      '<button type="button" class="copy-btn" aria-label="Copy code">' +
      '<svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8" height="8" rx="1.2" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M3 11V4a1 1 0 0 1 1-1h7" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>' +
      '<span class="copy-label">copy</span></button>';
    pre.insertBefore(chrome, pre.firstChild);
    var btn = chrome.querySelector('.copy-btn');
    btn.addEventListener('click', function () {
      var text = code ? code.innerText : pre.innerText;
      var done = function () {
        var label = btn.querySelector('.copy-label');
        if (label) label.textContent = 'copied';
        btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="copy-label">copied</span>';
        setTimeout(function () {
          btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8" height="8" rx="1.2" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M3 11V4a1 1 0 0 1 1-1h7" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg><span class="copy-label">copy</span>';
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = doc.createElement('textarea');
        ta.value = text;
        doc.body.appendChild(ta);
        ta.select();
        try { doc.execCommand('copy'); } catch (e) {}
        ta.remove();
        done();
      }
    });
  });

  // ---- TOC (active section + collapse) ----
  var toc = doc.querySelector('.toc');
  if (toc) {
    var tocToggle = toc.querySelector('.toc-toggle');
    var tocRail = toc.querySelector('.toc-rail');
    var tocHeadings = Array.prototype.map.call(toc.querySelectorAll('a[data-slug]'), function (a) {
      return { id: a.getAttribute('data-slug'), el: a };
    });
    var railTicks = Array.prototype.slice.call(toc.querySelectorAll('.toc-rail-tick'));

    var tocOpen = true;
    try { tocOpen = localStorage.getItem('inkpress-toc-open') !== '0'; } catch (e) {}

    function applyTocState() {
      toc.classList.toggle('open', tocOpen);
      toc.classList.toggle('collapsed', !tocOpen);
      body.setAttribute('data-toc', tocOpen ? 'open' : 'collapsed');
    }
    if (tocHeadings.length < 2) {
      body.setAttribute('data-toc', 'none');
      toc.style.display = 'none';
    } else {
      applyTocState();
      if (tocToggle) tocToggle.addEventListener('click', function () {
        tocOpen = false;
        try { localStorage.setItem('inkpress-toc-open', '0'); } catch (e) {}
        applyTocState();
      });
      if (tocRail) tocRail.addEventListener('click', function () {
        tocOpen = true;
        try { localStorage.setItem('inkpress-toc-open', '1'); } catch (e) {}
        applyTocState();
      });

      // Smooth scroll
      toc.querySelectorAll('a[data-slug]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var id = a.getAttribute('data-slug');
          var target = doc.getElementById(id);
          if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 24, behavior: 'smooth' });
            history.replaceState(null, '', '#' + id);
          }
        });
      });

      // Active tracking
      var activeId = null;
      var obs = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (e) { return e.isIntersecting; })
          .sort(function (a, b) { return a.target.offsetTop - b.target.offsetTop; })[0];
        if (visible) {
          activeId = visible.target.id;
          tocHeadings.forEach(function (h) {
            var li = h.el.closest('li');
            if (li) li.classList.toggle('active', h.id === activeId);
          });
          railTicks.forEach(function (t) {
            t.classList.toggle('active', t.getAttribute('data-slug') === activeId);
          });
        }
      }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
      tocHeadings.forEach(function (h) {
        var el = doc.getElementById(h.id);
        if (el) obs.observe(el);
      });
    }
  } else {
    body.setAttribute('data-toc', 'none');
  }

  // ---- Shortcuts overlay ----
  var scrimEl = doc.querySelector('.shortcuts-scrim');
  var scOpenBtn = doc.querySelector('.foot-help');
  function openShortcuts() { if (scrimEl) scrimEl.classList.add('open'); }
  function closeShortcuts() { if (scrimEl) scrimEl.classList.remove('open'); }
  if (scOpenBtn) scOpenBtn.addEventListener('click', openShortcuts);
  if (scrimEl) {
    scrimEl.addEventListener('click', function (e) { if (e.target === scrimEl) closeShortcuts(); });
    var scClose = scrimEl.querySelector('.shortcuts-close');
    if (scClose) scClose.addEventListener('click', closeShortcuts);
  }

  // ---- Keyboard shortcuts ----
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.nav-tree a[data-nav-leaf]'));
  var homeHref = (doc.querySelector('.brand') && doc.querySelector('.brand').getAttribute('href')) || '/';

  doc.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
      if (e.key === 'Escape') t.blur();
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'g') {
      window.location.href = homeHref;
    } else if (e.key === 'd') {
      setMode(!isDark());
    } else if (e.key === '/') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    } else if (e.key === '[') {
      var idx = navLinks.findIndex(function (a) { return a.classList.contains('active'); });
      if (idx > 0) navLinks[idx - 1].click();
    } else if (e.key === ']') {
      var idx2 = navLinks.findIndex(function (a) { return a.classList.contains('active'); });
      if (idx2 !== -1 && idx2 < navLinks.length - 1) navLinks[idx2 + 1].click();
    } else if (e.key === '?') {
      e.preventDefault();
      if (scrimEl && scrimEl.classList.contains('open')) closeShortcuts();
      else openShortcuts();
    } else if (e.key === 'Escape') {
      if (scrimEl && scrimEl.classList.contains('open')) closeShortcuts();
    }
  });

  // ---- Scroll shadow ----
  function onScroll() { body.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
`
