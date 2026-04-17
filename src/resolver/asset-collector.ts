import { posix } from 'path'

export class AssetCollector {
  private assets = new Set<string>()
  private shortNameIndex = new Map<string, string>()

  registerAsset(path: string): void {
    if (this.assets.has(path)) return
    this.assets.add(path)
    const shortName = posix.basename(path)
    if (!this.shortNameIndex.has(shortName)) this.shortNameIndex.set(shortName, path)
  }

  findAsset(shortName: string): string | null {
    return this.shortNameIndex.get(shortName) ?? null
  }

  getAssets(): string[] {
    return [...this.assets]
  }
}
