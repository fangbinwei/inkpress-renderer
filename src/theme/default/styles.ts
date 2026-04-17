export const CSS = `
:root {
  --bg: #ffffff;
  --bg-sidebar: #f6f8fa;
  --text: #24292f;
  --text-secondary: #57606a;
  --border: #d0d7de;
  --link: #0969da;
  --link-hover: #0550ae;
  --code-bg: #f6f8fa;
  --nav-active: #0969da;
  --breadcrumb-sep: #8b949e;
}
[data-theme="dark"] {
  --bg: #0d1117;
  --bg-sidebar: #161b22;
  --text: #c9d1d9;
  --text-secondary: #8b949e;
  --border: #30363d;
  --link: #58a6ff;
  --link-hover: #79c0ff;
  --code-bg: #161b22;
  --nav-active: #58a6ff;
  --breadcrumb-sep: #484f58;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: var(--text); background: var(--bg); line-height: 1.6; }
.layout { display: flex; min-height: 100vh; }
.sidebar { width: 260px; background: var(--bg-sidebar); border-right: 1px solid var(--border); padding: 1rem; position: fixed; top: 0; bottom: 0; overflow-y: auto; }
.sidebar-header { font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.theme-toggle { background: none; border: 1px solid var(--border); border-radius: 4px; cursor: pointer; padding: 2px 6px; color: var(--text); font-size: 0.9rem; }
.nav-tree ul { list-style: none; padding-left: 0.8rem; }
.nav-tree > ul { padding-left: 0; }
.nav-tree li { margin: 2px 0; }
.nav-tree a { color: var(--text-secondary); text-decoration: none; font-size: 0.9rem; }
.nav-tree a:hover { color: var(--link); }
.nav-tree a.active { color: var(--nav-active); font-weight: 600; }
.nav-tree .dir-label { font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.02em; color: var(--text-secondary); cursor: pointer; user-select: none; }
.nav-tree details summary { list-style: none; }
.nav-tree details summary::-webkit-details-marker { display: none; }
.content { margin-left: 260px; padding: 2rem 3rem; max-width: 800px; flex: 1; }
.breadcrumb { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem; }
.breadcrumb a { color: var(--link); text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }
.breadcrumb .sep { margin: 0 0.3rem; color: var(--breadcrumb-sep); }
.content h1 { font-size: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.3rem; }
.content h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 0.5rem; }
.content h3 { font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
.content p { margin-bottom: 1rem; }
.content a { color: var(--link); }
.content a:hover { color: var(--link-hover); }
.content img { max-width: 100%; }
.content blockquote { border-left: 3px solid var(--border); padding-left: 1rem; color: var(--text-secondary); margin-bottom: 1rem; }
.content pre { background: var(--code-bg); padding: 1rem; border-radius: 6px; overflow-x: auto; margin-bottom: 1rem; }
.content code { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 0.9em; }
.content :not(pre) > code { background: var(--code-bg); padding: 0.15em 0.3em; border-radius: 3px; }
.content table { border-collapse: collapse; margin-bottom: 1rem; }
.content th, .content td { border: 1px solid var(--border); padding: 0.5rem 0.75rem; }
.content th { background: var(--bg-sidebar); }
.dead-link { color: var(--text-secondary); text-decoration: line-through; cursor: not-allowed; }
@media (max-width: 768px) { .sidebar { display: none; } .content { margin-left: 0; padding: 1rem; } }
`

export const JS = `
(function() {
  var toggle = document.querySelector('.theme-toggle');
  var stored = localStorage.getItem('inkpress-theme');
  if (stored) document.documentElement.setAttribute('data-theme', stored);
  if (toggle) {
    toggle.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('inkpress-theme', next);
    });
  }
  document.querySelectorAll('.nav-tree details').forEach(function(d) { d.setAttribute('open', ''); });
})();
`
