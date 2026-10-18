import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { APIContext } from 'astro'
import { ADMIN_SECRET, ADMIN_USERS } from 'astro:env/server'

// Accès admin : liste blanche « email:code » dans la variable ADMIN_USERS,
// puis cookie de session signé (HMAC) valable 7 jours.

export const COOKIE = 'morez_admin'
const MAX_AGE = 7 * 24 * 3600

const sha256 = (s: string) => createHash('sha256').update(s).digest()

function allowedUsers(): Map<string, string> {
  const users = new Map<string, string>()
  for (const entry of (ADMIN_USERS ?? '').split(';')) {
    const i = entry.indexOf(':')
    if (i > 0) users.set(entry.slice(0, i).trim().toLowerCase(), entry.slice(i + 1).trim())
  }
  return users
}

export function isConfigured(): boolean {
  return Boolean(ADMIN_SECRET && ADMIN_SECRET.length >= 16 && allowedUsers().size > 0)
}

export function checkCredentials(email: string, code: string): string | null {
  const normalized = email.trim().toLowerCase()
  const expected = allowedUsers().get(normalized)
  // Comparaison à temps constant, même pour un email inconnu
  const ok = timingSafeEqual(sha256(code.trim()), sha256(expected ?? `\0${Math.random()}`))
  return ok && expected ? normalized : null
}

function sign(payload: string): string {
  return createHmac('sha256', ADMIN_SECRET!).update(payload).digest('base64url')
}

export function createSession(email: string): string {
  const payload = Buffer.from(JSON.stringify({ e: email, exp: Date.now() + MAX_AGE * 1000 })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function readSession(value: string | undefined): string | null {
  if (!value || !isConfigured()) return null
  const [payload, signature] = value.split('.')
  if (!payload || !signature) return null
  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  try {
    const { e, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    // Un email retiré de la liste blanche perd l'accès immédiatement
    return typeof e === 'string' && exp > Date.now() && allowedUsers().has(e) ? e : null
  } catch {
    return null
  }
}

export function setSessionCookie(context: APIContext, email: string) {
  context.cookies.set(COOKIE, createSession(email), {
    path: '/', httpOnly: true, secure: import.meta.env.PROD, sameSite: 'strict', maxAge: MAX_AGE,
  })
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
}

// À appeler en tête de chaque route admin : renvoie l'email connecté, ou une réponse d'erreur
export function requireAdmin(context: APIContext): string | Response {
  if (!isConfigured()) return json({ error: "L'espace admin n'est pas configuré (ADMIN_USERS / ADMIN_SECRET)." }, 503)
  const email = readSession(context.cookies.get(COOKIE)?.value)
  return email ?? json({ error: 'Session expirée, reconnectez-vous.' }, 401)
}
