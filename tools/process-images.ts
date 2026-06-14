import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const DEFAULT_WIDTH = 800
const DEFAULT_HEIGHT = 600
const DEFAULT_QUALITY = 85

const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.bmp',
  '.tiff',
  '.tif',
  '.avif',
  '.heic',
  '.heif',
])

export interface ProcessImagesOptions {
  width?: number
  height?: number
  quality?: number
  /** Remove the source file when converting from a non-JPEG format. Default true. */
  removeOriginal?: boolean
}

export interface ProcessImagesResult {
  processed: string[]
  skipped: string[]
  errors: { file: string; error: string }[]
}

function isImageFile(filePath: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

function outputPathFor(filePath: string): string {
  return path.join(path.dirname(filePath), `${path.parse(filePath).name}.jpg`)
}

async function processImageFile(
  filePath: string,
  options: Required<Pick<ProcessImagesOptions, 'width' | 'height' | 'quality' | 'removeOriginal'>>,
): Promise<void> {
  const outputPath = outputPathFor(filePath)
  const tempPath = `${outputPath}.tmp`

  await sharp(filePath)
    .resize(options.width, options.height, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: options.quality })
    .toFile(tempPath)

  await fs.rename(tempPath, outputPath)

  if (options.removeOriginal && path.resolve(filePath) !== path.resolve(outputPath)) {
    await fs.unlink(filePath)
  }
}

async function* walkFiles(rootDir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name)

    if (entry.isDirectory()) {
      yield* walkFiles(fullPath)
      continue
    }

    if (entry.isFile()) {
      yield fullPath
    }
  }
}

export async function processImages(
  rootDir: string,
  options: ProcessImagesOptions = {},
): Promise<ProcessImagesResult> {
  const resolvedOptions = {
    width: options.width ?? DEFAULT_WIDTH,
    height: options.height ?? DEFAULT_HEIGHT,
    quality: options.quality ?? DEFAULT_QUALITY,
    removeOriginal: options.removeOriginal ?? true,
  }

  const result: ProcessImagesResult = {
    processed: [],
    skipped: [],
    errors: [],
  }

  for await (const filePath of walkFiles(rootDir)) {
    if (!isImageFile(filePath) || filePath.endsWith('.tmp')) {
      result.skipped.push(filePath)
      continue
    }

    try {
      await processImageFile(filePath, resolvedOptions)
      result.processed.push(filePath)
    } catch (error) {
      result.errors.push({
        file: filePath,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return result
}

async function main(): Promise<void> {
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const imagesDir = path.join(projectRoot, 'public', 'assets', 'images')

  const result = await processImages(imagesDir)

  for (const file of result.processed) {
    console.log(`Processed: ${path.relative(projectRoot, file)}`)
  }

  for (const file of result.skipped) {
    console.log(`Skipped: ${path.relative(projectRoot, file)}`)
  }

  for (const { file, error } of result.errors) {
    console.error(`Failed: ${path.relative(projectRoot, file)} — ${error}`)
  }

  if (result.errors.length > 0) {
    process.exitCode = 1
  }
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url)

if (isMainModule) {
  await main()
}
