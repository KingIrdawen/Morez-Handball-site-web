// Outils communs aux routes admin : noms de fichiers sûrs et images envoyées depuis le navigateur

export function slugify(text: string): string {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/, '')
}

const SIGNATURES: { ext: string; test: (b: Buffer) => boolean }[] = [
  { ext: 'jpg', test: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: 'png', test: b => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { ext: 'webp', test: b => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' },
]

// Décode une image « data:image/...;base64,... » et vérifie son vrai format (pas seulement l'extension)
export function decodeImage(dataUrl: unknown, maxBytes: number): { buffer: Buffer; ext: string } {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) throw new Error('Image manquante ou invalide.')
  const buffer = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64')
  if (buffer.length > maxBytes) throw new Error(`Image trop lourde (${Math.round(buffer.length / 1024)} Ko).`)
  const format = SIGNATURES.find(s => s.test(buffer))
  if (!format) throw new Error('Format d’image non pris en charge (JPEG, PNG ou WebP).')
  return { buffer, ext: format.ext }
}

// Chaîne YAML sûre pour l'en-tête des articles (JSON est un sous-ensemble valide de YAML)
export const yamlString = (s: string) => JSON.stringify(s)
