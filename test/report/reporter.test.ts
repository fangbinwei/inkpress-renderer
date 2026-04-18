import { describe, it, expect } from 'vitest'
import { Reporter } from '../../src/report/reporter.js'

describe('Reporter', () => {
  it('collects rendered count', () => {
    const reporter = new Reporter()
    reporter.rendered()
    reporter.rendered()
    expect(reporter.build().rendered).toBe(2)
  })
  it('collects skipped files', () => {
    const reporter = new Reporter()
    reporter.skipped('notes/private.md', 'publish: false')
    expect(reporter.build().skipped).toEqual([{ path: 'notes/private.md', reason: 'publish: false' }])
  })
  it('collects dead links', () => {
    const reporter = new Reporter()
    reporter.deadLink({ sourcePath: 'notes/a.md', targetLink: 'missing', line: 5, reason: 'target-missing', hint: 'not found' })
    expect(reporter.build().deadLinks).toEqual([{ sourcePath: 'notes/a.md', targetLink: 'missing', line: 5, reason: 'target-missing', hint: 'not found' }])
  })
  it('collects missing images', () => {
    const reporter = new Reporter()
    reporter.missingImage('notes/a.md', 'img.png', 3)
    expect(reporter.build().missingImages).toEqual([{ sourcePath: 'notes/a.md', imagePath: 'img.png', line: 3 }])
  })
  it('collects warnings', () => {
    const reporter = new Reporter()
    reporter.warn('Something unexpected')
    expect(reporter.build().warnings).toEqual(['Something unexpected'])
  })
})
