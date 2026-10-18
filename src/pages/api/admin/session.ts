import type { APIRoute } from 'astro'
import { json, requireAdmin } from '@/lib/admin/auth'

export const prerender = false

export const GET: APIRoute = context => {
  const email = requireAdmin(context)
  return typeof email === 'string' ? json({ email }) : email
}
