import type { APIRoute } from 'astro'
import { json, requireAdmin } from '@/lib/admin/auth'
import { commit, listDir, readText } from '@/lib/admin/repo'
import { decodeImage, slugify, yamlString } from '@/lib/admin/files'

export const prerender = false

const DIR = 'src/content/actualites'
const IMAGE_DIR = 'src/assets/actualites'

// Lit les champs simples de l'en-tête d'un article
function frontmatter(md: string): Record<string, string> {
  const block = md.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
  const fields: Record<string, string> = {}
  for (const line of block.split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/)
    if (!m) continue
    try { fields[m[1]] = m[2].startsWith('"') ? JSON.parse(m[2]) : m[2] } catch { fields[m[1]] = m[2] }
  }
  return fields
}

// Liste des articles publiés (du plus récent au plus ancien)
export const GET: APIRoute = async context => {
  const auth = requireAdmin(context)
  if (auth instanceof Response) return auth
  const files = (await listDir(DIR)).filter(f => f.endsWith('.md'))
  const articles = await Promise.all(files.map(async file => {
    const fm = frontmatter((await readText(`${DIR}/${file}`)) ?? '')
    return { slug: file.replace(/\.md$/, ''), title: fm.title ?? file, category: fm.category ?? '', date: fm.date ?? '' }
  }))
  articles.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
  return json({ articles })
}

// Publication d'un nouvel article
export const POST: APIRoute = async context => {
  const auth = requireAdmin(context)
  if (auth instanceof Response) return auth
  try {
    const body = await context.request.json()
    const title = String(body.title ?? '').trim()
    const category = String(body.category ?? '').trim()
    const excerpt = String(body.excerpt ?? '').trim().replace(/\s+/g, ' ')
    const text = String(body.text ?? '').replace(/\r\n?/g, '\n').trim()
    const imageAlt = String(body.imageAlt ?? '').trim()

    if (title.length < 3 || title.length > 120) return json({ error: 'Le titre doit faire entre 3 et 120 caractères.' }, 400)
    if (category.length < 2 || category.length > 40) return json({ error: 'Indiquez une catégorie (ex. Match).' }, 400)
    if (excerpt.length < 10 || excerpt.length > 300) return json({ error: 'Le résumé doit faire entre 10 et 300 caractères.' }, 400)
    if (text.length < 10 || text.length > 20000) return json({ error: "Le texte de l'article est trop court ou trop long." }, 400)
    const image = decodeImage(body.image, 3_000_000)

    // Adresse de la page tirée du titre, rendue unique si besoin
    const existing = new Set(await listDir(DIR))
    const base = slugify(title) || 'article'
    let slug = base
    for (let i = 2; existing.has(`${slug}.md`); i++) slug = `${base}-${i}`

    // Mise en page automatique : chaque ligne saisie devient un paragraphe
    const paragraphs = text.split('\n').map(l => l.trim()).filter(Boolean).join('\n\n')
    const imagePath = `${IMAGE_DIR}/${slug}.${image.ext}`
    const markdown = [
      '---',
      `title: ${yamlString(title)}`,
      `category: ${yamlString(category)}`,
      `date: ${new Date().toISOString()}`,
      `excerpt: ${yamlString(excerpt)}`,
      `image: ../../assets/actualites/${slug}.${image.ext}`,
      ...(imageAlt ? [`imageAlt: ${yamlString(imageAlt)}`] : []),
      '---',
      '',
      paragraphs,
      '',
    ].join('\n')

    await commit(`Actualité : ${title} (par ${auth})`, [
      { path: imagePath, content: image.buffer },
      { path: `${DIR}/${slug}.md`, content: markdown },
    ])
    return json({ slug, url: `/actualites/${slug}/` })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500)
  }
}

// Suppression d'un article (et de sa photo)
export const DELETE: APIRoute = async context => {
  const auth = requireAdmin(context)
  if (auth instanceof Response) return auth
  try {
    const slug = slugify(context.url.searchParams.get('slug') ?? '')
    const md = slug && await readText(`${DIR}/${slug}.md`)
    if (!md) return json({ error: 'Article introuvable.' }, 404)
    const image = frontmatter(md).image?.match(/^\.\.\/\.\.\/assets\/actualites\/([a-z0-9-]+\.(?:jpe?g|png|webp))$/)?.[1]
    // La photo n'est supprimée que si aucun autre article ne l'utilise
    const others = (await listDir(DIR)).filter(f => f.endsWith('.md') && f !== `${slug}.md`)
    const shared = image && (await Promise.all(others.map(f => readText(`${DIR}/${f}`)))).some(t => t?.includes(`/actualites/${image}`))
    await commit(`Actualité supprimée : ${slug} (par ${auth})`, [
      { path: `${DIR}/${slug}.md` },
      ...(image && !shared ? [{ path: `${IMAGE_DIR}/${image}` }] : []),
    ])
    return json({ ok: true })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500)
  }
}
