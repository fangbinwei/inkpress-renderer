/**
 * Build and serve a rich preview of the default theme.
 *
 *   pnpm tsx scripts/preview.ts
 *
 * Writes a sample knowledge-garden vault to a temp dir, renders the site,
 * writes output to ./.preview-output, and serves it on http://localhost:8765.
 * Ctrl+C to stop.
 */

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import type { ThemeVariant } from '../src/index.js'
import { DefaultTheme, renderSite } from '../src/index.js'
import { createNodeAdapter } from '../test/helpers/mock-fs.js'

const VAULT_DIR = join(process.cwd(), '.preview-vault')
const OUT_DIR = join(process.cwd(), '.preview-output')
const PORT = 8765

const VARIANTS: ThemeVariant[] = ['technical', 'editorial', 'manuscript']
const arg = process.argv[2]
const VARIANT: ThemeVariant = VARIANTS.includes(arg as ThemeVariant)
  ? (arg as ThemeVariant)
  : 'technical'

// ---- Sample vault content ----

const WELCOME_MD = `---
title: A small knowledge garden
modified: 2026-04-18
---

# A small knowledge garden

This is a slow-growing collection of notes — things I'm learning, half-formed ideas, quotes I don't want to lose. It's tended, not published. Expect typos, broken links, and changes of mind.

Inkpress renders my Obsidian vault into static HTML on every save. The pages you're reading are the output: no JavaScript framework, no database, just files that link to other files.

## Where to start

- [[typography|Typography for long-form reading]] — why measure and leading matter more than font choice
- [[plain-text|The case for plain text]] — why markdown outlives every proprietary format
- [[systems|On note-taking systems]] — PARA, Zettelkasten, and why I gave up on all of them

## Currently reading

> The best way to have a good idea is to have a lot of ideas, and throw the bad ones away.
> — Linus Pauling

More in the [[reading-log|reading log]].

## Recently updated

1. [[constraints|Why constraints are kind]]
2. [[craft|Craft]]
3. [[bringhurst|Notes on Bringhurst]]

You can press \`/\` to filter the sidebar, \`d\` to flip dark mode, and \`?\` for the full keyboard shortcuts panel.
`

const TYPOGRAPHY_MD = `---
title: Typography for long-form reading
modified: 2026-04-11
---

# Typography for long-form reading

Reading on screens is tiring in ways print isn't. Some of this is backlight, some is posture, but a lot of it is typography. A paragraph set in 16px Arial at 1.2 line-height is an eye-chart compared to the same paragraph in a well-set book.

## Three things that matter

1. **Measure** — 60 to 75 characters per line. Narrower on mobile.
2. **Leading** — 1.5 to 1.7 for body copy. Tighter feels cramped.
3. **Contrast** — pure black on pure white is actually too much. Use an *ink gray*.

## A quick example

Here is the same sentence set three ways. The first is the platform default. The second fixes only measure and leading. The third adds an old-style serif. The difference is not subtle.

\`\`\`css
.prose {
  max-width: 68ch;
  line-height: 1.65;
  font-family: 'Source Serif 4', Georgia, serif;
  color: var(--ink);
}

/* Optional: opentype features for real book feel */
.prose {
  font-feature-settings: 'kern', 'liga', 'onum';
}
\`\`\`

The \`onum\` feature gives you old-style figures — numbers with descenders, like 3 and 9 dropping below the baseline. They blend into running text instead of shouting.

## What I'm not doing

I used to fuss with \`font-size-adjust\`, optical sizing, variable-font axes. All good tools, none of them matter if measure and leading are wrong. Fix the structure first.

## A table of format lifespans

| Format | Alive in 10 years? | Portable? |
|---|---|---|
| Notion doc | Unlikely | No |
| Apple Notes | Maybe | No |
| Markdown | Yes | Yes |
| Plain text | Yes | Yes |

---

See also: [[bringhurst|Notes on Bringhurst]] and [[plain-text|the case for plain text]].
`

const PLAIN_TEXT_MD = `---
title: The case for plain text
modified: 2026-03-28
---

# The case for plain text

I write everything in markdown. Not because markdown is elegant — it isn't — but because markdown files survive.

## What outlives what

The tool doesn't matter; the substrate does. A plain-text file from 1995 still opens today. A proprietary note from 2015 might not.

\`\`\`bash
# The most portable archive format
tar -czf notes-$(date +%Y%m%d).tar.gz notes/
\`\`\`

## When I use rich formats

Only when the output is the whole point — a slide deck, a PDF, a webpage. For my own thinking, markdown is the floor.

Related: [[typography|Typography for long-form reading]].
`

const SYSTEMS_MD = `---
title: On note-taking systems
modified: 2026-04-02
---

# On note-taking systems

Zettelkasten, PARA, Second Brain, Johnny Decimal. I tried them all. They all work. They all fail.

## The pattern

A new system starts out exciting. The scaffolding feels like progress. Then the scaffolding becomes the work, and the original goal — *thinking* — gets crowded out.

> The map is not the territory.
> — Korzybski

## What I do now

1. A folder called \`notes\`
2. Any note links to any other note by filename, with dates when relevant
3. Write dense index pages when a topic gets more than six linked notes
4. No tags, no metadata, no dashboards

Structure emerges from linking. When a note becomes the destination of a lot of inbound links, it grows into a real topic page. If a note never gets linked, it just sits there — that's fine too.
`

const READING_LOG_MD = `---
title: Reading log
modified: 2026-04-18
---

# Reading log

Books I'm reading or have read recently. Stars are a personal "would I recommend it" — nothing more.

- [[bringhurst|The Elements of Typographic Style — Bringhurst]] ★★★★★
- *Thinking, Fast and Slow* — Kahneman ★★★★
- *How to Take Smart Notes* — Ahrens ★★★

Linked discussions: [[typography|Typography for long-form reading]].
`

const BRINGHURST_MD = `---
title: Notes on Bringhurst
modified: 2026-04-11
---

# Notes on Bringhurst

Reading *The Elements of Typographic Style* slowly, a chapter at a time. Collecting quotes and things to try.

> Typography exists to honor content.
> — ch. 2

This one keeps coming back to me. The ornament, the rule, the blackletter display face — none of it is about typography. It is about not trusting the content to carry itself.

## Things to try in the vault theme

- Drop cap on the first paragraph of long notes
- Old-style figures in body text
- Small caps for abbreviations (\`HTML\`, \`CSS\`)
- Hanging punctuation on blockquotes

See also: [[typography|Typography for long-form reading]].
`

const CRAFT_MD = `---
title: Craft
modified: 2026-04-10
---

# Craft

Craft is the part of the work nobody asked for. It's the extra effort that nothing depends on. Nobody is grading the inside of your drawer.

## Why do it anyway

Because the act of polishing the invisible part changes how you approach the visible part. The carpenter who finishes the back of a cabinet isn't doing it for a customer. They're doing it for themselves, and that habit of care leaks into everything else.

Related: [[constraints|Why constraints are kind]]. Also see [[welcome|the home page]].
`

const CONSTRAINTS_MD = `---
title: Why constraints are kind
modified: 2026-04-09
---

# Why constraints are kind

An empty page is not freedom. An empty page is paralysis with good PR.

## The sonnet, the haiku, the 25-page RFC

Every good form is a set of constraints:

- The sonnet is 14 lines, iambic pentameter, volta at line 9
- The haiku is 5–7–5
- The RFC has a fixed section order

Take the constraints away and the work doesn't get better — it gets worse and takes longer.

## Constraints I use

1. Notes under 500 words unless I really mean it
2. One file per idea, filename is a sentence
3. Published means public; "draft" folders are lies I tell myself

\`\`\`ts
// A rule I keep reminding myself of
function isReady(note: Note): boolean {
  return note.wordCount > 100 && note.hasAtLeastOneLink()
}
\`\`\`

Linked from: [[craft|Craft]].
`

// ---- Write the vault ----

function writeVault(): void {
  rmSync(VAULT_DIR, { recursive: true, force: true })
  mkdirSync(VAULT_DIR, { recursive: true })

  const files: Array<[string, string]> = [
    ['notes/welcome.md', WELCOME_MD],
    ['notes/typography.md', TYPOGRAPHY_MD],
    ['notes/plain-text.md', PLAIN_TEXT_MD],
    ['notes/systems.md', SYSTEMS_MD],
    ['reading/reading-log.md', READING_LOG_MD],
    ['reading/bringhurst.md', BRINGHURST_MD],
    ['craft/craft.md', CRAFT_MD],
    ['craft/constraints.md', CONSTRAINTS_MD],
  ]

  for (const [path, content] of files) {
    const dest = join(VAULT_DIR, path)
    mkdirSync(join(VAULT_DIR, path.split('/').slice(0, -1).join('/')), {
      recursive: true,
    })
    writeFileSync(dest, content, 'utf8')
  }
}

// ---- Render ----

async function render(): Promise<void> {
  const theme = new DefaultTheme()
  const fs = createNodeAdapter(VAULT_DIR)
  const result = await renderSite({
    vaultPath: VAULT_DIR,
    publishDirs: ['notes', 'reading', 'craft'],
    theme,
    uploadMode: 'html',
    deadLinkPolicy: 'silent',
    variant: VARIANT,
    fs,
  })

  rmSync(OUT_DIR, { recursive: true, force: true })
  for (const file of result.files) {
    const dest = join(OUT_DIR, file.relativePath)
    mkdirSync(
      join(OUT_DIR, file.relativePath.split('/').slice(0, -1).join('/')),
      {
        recursive: true,
      },
    )
    writeFileSync(dest, file.content)
  }

  console.log(
    `Rendered ${result.report.rendered} pages in variant=${VARIANT} · ${result.files.length} output files`,
  )
}

// ---- Serve ----

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

function serve(): void {
  const server = createServer((req, res) => {
    let url = req.url || '/'
    if (url.endsWith('/')) url += 'index.html'
    const filePath = join(OUT_DIR, url)
    try {
      const data = readFileSync(filePath)
      res.writeHead(200, {
        'Content-Type': MIME[extname(filePath)] || 'application/octet-stream',
      })
      res.end(data)
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
    }
  })
  server.listen(PORT, () => {
    console.log(`\n  Preview → http://localhost:${PORT}/notes/welcome.html`)
    console.log(`  Index   → http://localhost:${PORT}/`)
    console.log('  Ctrl+C to stop\n')
  })
}

// ---- Main ----

async function main(): Promise<void> {
  writeVault()
  await render()
  serve()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
