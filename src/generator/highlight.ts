import { createHighlighter, type Highlighter } from 'shiki'

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: [
        'javascript',
        'typescript',
        'python',
        'rust',
        'go',
        'bash',
        'json',
        'yaml',
        'html',
        'css',
        'markdown',
      ],
    })
  }
  return highlighterPromise
}

export async function highlightCode(
  code: string,
  lang: string,
): Promise<string> {
  if (!lang) {
    return `<pre><code>${escapeHtml(code)}</code></pre>`
  }

  try {
    const highlighter = await getHighlighter()
    const loadedLangs = highlighter.getLoadedLanguages()
    if (!loadedLangs.includes(lang as any)) {
      return `<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(code)}</code></pre>`
    }
    return highlighter.codeToHtml(code, {
      lang,
      themes: { light: 'github-light', dark: 'github-dark' },
    })
  } catch {
    return `<pre><code>${escapeHtml(code)}</code></pre>`
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
