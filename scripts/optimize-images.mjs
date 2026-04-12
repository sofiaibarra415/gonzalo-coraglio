/**
 * Generates .webp next to each JPG/PNG under public (project image folders).
 * Max width 1920px, quality ~82. Re-run after adding new photos.
 */
import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')

const REL_DIRS = ['IMG random', 'Master plan', 'Mediateca']

const exts = new Set(['.jpg', '.jpeg', '.png'])

async function processFile(absPath) {
  const ext = path.extname(absPath).toLowerCase()
  if (!exts.has(ext)) return

  const outPath = absPath.replace(/\.(jpe?g|png)$/i, '.webp')

  const meta = await sharp(absPath).metadata()
  let pipeline = sharp(absPath)

  if (meta.width && meta.width > 1920) {
    pipeline = pipeline.resize(1920, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
  }

  await pipeline.webp({ quality: 82, alphaQuality: 90, effort: 5 }).toFile(outPath)

  const inB = (await stat(absPath)).size
  const outB = (await stat(outPath)).size
  console.log(
    `OK  ${path.relative(publicDir, outPath)}  (${Math.round(inB / 1024)} KB → ${Math.round(outB / 1024)} KB)`
  )
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) await walk(full)
    else await processFile(full)
  }
}

for (const rel of REL_DIRS) {
  const dir = path.join(publicDir, rel)
  try {
    await walk(dir)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`Skip missing folder: ${rel}`)
    } else throw err
  }
}

console.log('optimize-images done.')
