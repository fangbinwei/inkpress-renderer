/**
 * E2E test: render test vault → write to disk → upload to OSS → verify → cleanup
 *
 * Usage: npx tsx test/e2e/run-e2e.ts
 *
 * Requires env vars (or reads from ../../goProject/aliyun-oss-website-action/.env.local):
 *   ACCESS_KEY_ID, ACCESS_KEY_SECRET
 */

import 'dotenv/config'
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import OSS from 'ali-oss'
import { config } from 'dotenv'
import { DefaultTheme, renderSite } from '../../src/index.js'
import { createNodeAdapter, TEST_VAULT_PATH } from '../helpers/mock-fs.js'

// Load .env.local (dotenv/config only loads .env by default)
config({
  path: join(dirname(new URL(import.meta.url).pathname), '../../.env.local'),
})

// --- Config ---
const OSS_PREFIX = '_inkpress-e2e-test/'
const BUCKET = 'fangbinwei-blog'
const REGION = 'oss-cn-shanghai'
const ENDPOINT = 'oss-cn-shanghai.aliyuncs.com'

function loadCredentials(): { accessKeyId: string; accessKeySecret: string } {
  const { ACCESS_KEY_ID, ACCESS_KEY_SECRET } = process.env
  if (!ACCESS_KEY_ID || !ACCESS_KEY_SECRET) {
    throw new Error(
      'No OSS credentials found. Create .env.local with ACCESS_KEY_ID and ACCESS_KEY_SECRET, or set env vars.',
    )
  }
  return { accessKeyId: ACCESS_KEY_ID, accessKeySecret: ACCESS_KEY_SECRET }
}

// --- Helpers ---
function walkDir(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walkDir(fullPath))
    else files.push(fullPath)
  }
  return files
}

async function main() {
  const credentials = loadCredentials()
  console.log('=== Inkpress E2E Test ===\n')

  // --- Phase 1: Render ---
  console.log('[1/5] Rendering test vault...')
  const theme = new DefaultTheme()
  const fs = createNodeAdapter(TEST_VAULT_PATH)
  const result = await renderSite({
    vaultPath: TEST_VAULT_PATH,
    publishDirs: ['notes', 'guides'],
    theme,
    uploadMode: 'html',
    deadLinkPolicy: 'silent',
    fs,
  })

  console.log(`  Rendered: ${result.report.rendered} pages`)
  console.log(`  Skipped: ${result.report.skipped.length} files`)
  console.log(`  Dead links: ${result.report.deadLinks.length}`)
  console.log(`  Output files: ${result.files.length}`)

  // --- Phase 2: Write to disk ---
  console.log('\n[2/5] Writing output to disk...')
  const outputDir = join(
    dirname(new URL(import.meta.url).pathname),
    '../../.e2e-output',
  )
  rmSync(outputDir, { recursive: true, force: true })

  for (const file of result.files) {
    const dest = join(outputDir, file.relativePath)
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, file.content)
  }

  const diskFiles = walkDir(outputDir)
  console.log(`  Written ${diskFiles.length} files to ${outputDir}`)

  // --- Phase 3: Verify output ---
  console.log('\n[3/5] Verifying output...')
  const checks: { name: string; pass: boolean; detail?: string }[] = []

  // Check HTML files exist
  const htmlFiles = result.files.filter(f => f.relativePath.endsWith('.html'))
  checks.push({
    name: 'HTML files generated',
    pass: htmlFiles.length >= 7,
    detail: `${htmlFiles.length} HTML files (expected >= 7)`,
  })

  // Check index.html exists
  const indexHtml = result.files.find(f => f.relativePath === 'index.html')
  checks.push({ name: 'index.html exists', pass: !!indexHtml })

  // Check site.json exists and is valid
  const siteJson = result.files.find(f => f.relativePath === 'site.json')
  let siteIndex: any = null
  if (siteJson) {
    try {
      siteIndex = JSON.parse(siteJson.content as string)
      checks.push({ name: 'site.json is valid JSON', pass: true })
      checks.push({
        name: 'site.json has pages',
        pass: siteIndex.pages.length >= 6,
        detail: `${siteIndex.pages.length} pages`,
      })
      checks.push({ name: 'site.json has navTree', pass: !!siteIndex.navTree })
    } catch {
      checks.push({ name: 'site.json is valid JSON', pass: false })
    }
  } else {
    checks.push({ name: 'site.json exists', pass: false })
  }

  // Check CSS asset exists
  checks.push({
    name: 'CSS asset exists',
    pass: result.files.some(f => f.relativePath.endsWith('.css')),
  })

  // Check JS asset exists
  checks.push({
    name: 'JS asset exists',
    pass: result.files.some(f => f.relativePath.endsWith('.js')),
  })

  // Check image asset included
  checks.push({
    name: 'Image asset (img.png) included',
    pass: result.files.some(f => f.relativePath.includes('img.png')),
  })

  // Check unpublished.md was skipped
  checks.push({
    name: 'unpublished.md was skipped',
    pass:
      !result.files.some(f => f.relativePath.includes('unpublished')) &&
      result.report.skipped.some(s => s.path.includes('unpublished')),
  })

  // Check dead links reported
  checks.push({
    name: 'Dead link (missing-note) reported',
    pass: result.report.deadLinks.some(d => d.targetLink === 'missing-note'),
  })

  // Check Cache-Control headers
  const htmlFile = htmlFiles[0]
  checks.push({
    name: 'HTML Cache-Control is no-cache',
    pass: htmlFile?.cacheControl === 'no-cache',
  })
  const cssFile = result.files.find(f => f.relativePath.endsWith('.css'))
  checks.push({
    name: 'CSS Cache-Control is max-age=2592000',
    pass: cssFile?.cacheControl === 'max-age=2592000',
  })

  // Check HTML contains expected content
  const normalHtml = result.files.find(f =>
    f.relativePath.includes('normal.html'),
  )
  if (normalHtml) {
    const content = normalHtml.content as string
    checks.push({
      name: 'HTML contains DOCTYPE',
      pass: content.includes('<!DOCTYPE html>'),
    })
    checks.push({
      name: 'HTML contains sidebar nav',
      pass: content.includes('nav-tree'),
    })
    checks.push({
      name: 'HTML contains breadcrumb',
      pass: content.includes('breadcrumb'),
    })
    checks.push({
      name: 'HTML contains dark mode toggle',
      pass: content.includes('theme-toggle'),
    })
  }

  // Check wikilink resolution
  const wikilinkHtml = result.files.find(f =>
    f.relativePath.includes('with-wikilink.html'),
  )
  if (wikilinkHtml) {
    const content = wikilinkHtml.content as string
    checks.push({
      name: 'Wikilink resolved to HTML link',
      pass: content.includes('normal.html'),
    })
    checks.push({
      name: 'Dead wikilink rendered as plain text',
      pass: !content.includes('href="missing-note"'),
    })
  }

  // Check frontmatter title used
  const frontmatterHtml = result.files.find(f =>
    f.relativePath.includes('with-frontmatter.html'),
  )
  if (frontmatterHtml) {
    const content = frontmatterHtml.content as string
    checks.push({
      name: 'Frontmatter title used in <title>',
      pass: content.includes('<title>Custom Title</title>'),
    })
  }

  // Print results
  let allPassed = true
  for (const check of checks) {
    const icon = check.pass ? '  ✓' : '  ✗'
    const detail = check.detail ? ` (${check.detail})` : ''
    console.log(`${icon} ${check.name}${detail}`)
    if (!check.pass) allPassed = false
  }

  if (!allPassed) {
    console.error('\n❌ Some checks failed!')
    process.exit(1)
  }

  // --- Phase 4: Upload to OSS ---
  console.log('\n[4/5] Uploading to OSS...')
  const client = new OSS({
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    bucket: BUCKET,
    region: REGION,
    endpoint: ENDPOINT,
    secure: true,
  })

  let uploadCount = 0
  const uploadErrors: string[] = []

  for (const file of result.files) {
    const ossPath = OSS_PREFIX + file.relativePath
    const content =
      typeof file.content === 'string'
        ? Buffer.from(file.content)
        : file.content

    try {
      await client.put(ossPath, content, {
        headers: {
          'Content-Type': file.contentType,
          'Cache-Control': file.cacheControl,
        },
      })
      uploadCount++
    } catch (e) {
      uploadErrors.push(
        `${file.relativePath}: ${e instanceof Error ? e.message : String(e)}`,
      )
    }
  }

  console.log(`  Uploaded: ${uploadCount}/${result.files.length} files`)
  if (uploadErrors.length > 0) {
    console.error(`  Errors: ${uploadErrors.length}`)
    for (const err of uploadErrors) console.error(`    ${err}`)
  }

  // Verify a file exists on OSS
  try {
    const headResult = await client.head(`${OSS_PREFIX}index.html`)
    console.log(
      `  Verified: index.html exists on OSS (status: ${headResult.status})`,
    )
  } catch (e) {
    console.error(`  Failed to verify index.html on OSS: ${e}`)
  }

  // --- Phase 5: Cleanup ---
  console.log('\n[5/5] Cleaning up OSS test files...')
  try {
    const listResult = await client.list(
      { prefix: OSS_PREFIX, 'max-keys': 1000 },
      {},
    )
    if (listResult.objects && listResult.objects.length > 0) {
      const keys = listResult.objects.map((o: any) => o.name)
      await client.deleteMulti(keys, { quiet: true })
      console.log(`  Deleted ${keys.length} test files from OSS`)
    } else {
      console.log('  No files to clean up')
    }
  } catch (e) {
    console.error(`  Cleanup failed: ${e}`)
  }

  // Cleanup local output
  rmSync(outputDir, { recursive: true, force: true })
  console.log('  Cleaned up local output directory')

  console.log('\n=== E2E Test PASSED ===')
}

main().catch(e => {
  console.error('E2E test failed:', e)
  process.exit(1)
})
