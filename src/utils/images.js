/** Encode path for URLs with spaces/special chars. */
export function assetUrl(path) {
  return encodeURI(path)
}

/** WebP variant path (same folder, .webp) — run `npm run optimize-images` to generate. */
export function webpUrl(path) {
  const base = path.replace(/\.(jpe?g|png)$/i, '')
  return encodeURI(`${base}.webp`)
}
