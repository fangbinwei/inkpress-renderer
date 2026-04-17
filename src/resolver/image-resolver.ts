import { posix } from 'path'

export function resolveImagePath(imageSrc: string, fromSourcePath: string): string {
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) return imageSrc
  const fromDir = posix.dirname(fromSourcePath)
  return posix.normalize(posix.join(fromDir, imageSrc))
}
