/**
 * Encode each path segment so spaces, parentheses and special chars in folder/file names work as URLs.
 * `encodeURI` alone does not encode `()`, which breaks static servers for paths like `Detalle ( 2 imagenes )`.
 */
export function assetUrl(path) {
  if (path == null || typeof path !== 'string') return path
  const trimmed = path.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (!trimmed.startsWith('/')) {
    const parts = trimmed.split('/').filter(Boolean)
    return parts.map((s) => encodeURIComponent(s)).join('/')
  }
  const segments = trimmed.split('/').filter(Boolean)
  if (segments.length === 0) return '/'
  return '/' + segments.map((s) => encodeURIComponent(s)).join('/')
}

/** WebP variant path — run `npm run optimize-images` to generate files alongside originals. */
export function webpUrl(path) {
  const base = path.replace(/\.(jpe?g|png)$/i, '')
  return assetUrl(`${base}.webp`)
}
