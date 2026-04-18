import type { PublishReport, FileSkipEntry, DeadLinkEntry, MissingImageEntry } from '../types.js'

export class Reporter {
  private _rendered = 0
  private _skipped: FileSkipEntry[] = []
  private _deadLinks: DeadLinkEntry[] = []
  private _missingImages: MissingImageEntry[] = []
  private _warnings: string[] = []

  rendered(): void { this._rendered++ }
  skipped(path: string, reason: string): void { this._skipped.push({ path, reason }) }
  deadLink(entry: DeadLinkEntry): void { this._deadLinks.push(entry) }
  missingImage(sourcePath: string, imagePath: string, line: number): void { this._missingImages.push({ sourcePath, imagePath, line }) }
  warn(message: string): void { this._warnings.push(message) }

  build(): PublishReport {
    return {
      rendered: this._rendered,
      skipped: [...this._skipped],
      deadLinks: [...this._deadLinks],
      missingImages: [...this._missingImages],
      warnings: [...this._warnings],
    }
  }
}
