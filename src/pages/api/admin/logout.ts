import type { APIRoute } from 'astro'
import { COOKIE, json } from '@/lib/admin/auth'

export const prerender = false

export const POST: APIRoute = context => {
  context.cookies.delete(COOKIE, { path: '/' })
  return json({ ok: true })
}
