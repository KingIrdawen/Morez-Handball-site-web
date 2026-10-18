import type { APIRoute } from 'astro'
import { json, requireAdmin } from '@/lib/admin/auth'
import { commit, readText, type FileChange } from '@/lib/admin/repo'
import { decodeImage } from '@/lib/admin/files'
import { clubKey, matchesFileSchema } from '@/lib/schemas'

export const prerender = false

const FILE = 'src/data/matches.json'
const LOGO_DIR = 'src/assets/clubs'

// Calendrier actuel (dernière version enregistrée, même si le site n'est pas encore republié)
export const GET: APIRoute = async context => {
  const auth = requireAdmin(context)
  if (auth instanceof Response) return auth
  const text = await readText(FILE)
  if (!text) return json({ error: 'Calendrier introuvable.' }, 500)
  return json(JSON.parse(text))
}

// Enregistrement du calendrier complet + logos des nouveaux clubs
export const PUT: APIRoute = async context => {
  const auth = requireAdmin(context)
  if (auth instanceof Response) return auth
  try {
    const body = await context.request.json()
    const data = structuredClone(body.data)
    const changes: FileChange[] = []

    // Logos glissés pour de nouveaux clubs (ou pour remplacer un logo existant)
    for (const upload of Array.isArray(body.logos) ? body.logos : []) {
      const key = clubKey.parse(upload.key)
      if (!data?.clubs?.[key]) continue
      const image = decodeImage(upload.image, 1_000_000)
      const file = `${key}-${Date.now().toString(36)}.${image.ext}`
      data.clubs[key].logo = file
      changes.push({ path: `${LOGO_DIR}/${file}`, content: image.buffer })
    }

    const parsed = matchesFileSchema.safeParse(data)
    if (!parsed.success) {
      return json({ error: parsed.error.issues.map(i => i.message).join(' · ') }, 400)
    }
    // Chaque club doit avoir un logo : soit envoyé maintenant, soit déjà présent dans le dépôt
    const current = JSON.parse((await readText(FILE)) ?? '{"clubs":{}}')
    const known = new Set(Object.values(current.clubs as Record<string, { logo: string }>).map(c => c.logo))
    const uploaded = new Set(changes.map(c => c.path.slice(LOGO_DIR.length + 1)))
    const missing = Object.values(parsed.data.clubs).filter(c => !known.has(c.logo) && !uploaded.has(c.logo))
    if (missing.length) return json({ error: `Logo manquant pour : ${missing.map(c => c.name).join(', ')}` }, 400)

    parsed.data.matches.sort((a, b) => a.round - b.round)
    changes.push({ path: FILE, content: `${JSON.stringify(parsed.data, null, 2)}\n` })
    await commit(`Matchs mis à jour (par ${auth})`, changes)
    return json({ ok: true, data: parsed.data })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500)
  }
}
