import type { APIRoute } from 'astro'
import { checkCredentials, isConfigured, json, setSessionCookie } from '@/lib/admin/auth'

export const prerender = false

export const POST: APIRoute = async context => {
  if (!isConfigured()) return json({ error: "L'espace admin n'est pas configuré." }, 503)
  const body = await context.request.json().catch(() => ({}))
  const email = checkCredentials(String(body.email ?? ''), String(body.code ?? ''))
  if (!email) {
    // Ralentit les essais en série
    await new Promise(r => setTimeout(r, 1000))
    return json({ error: 'Adresse e-mail ou code incorrect.' }, 401)
  }
  setSessionCookie(context, email)
  return json({ email })
}
