// Outils partagés par les pages de l'espace admin (exécutés dans le navigateur)

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/admin/${path}`, {
    ...init,
    headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'same-origin',
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401 && path !== 'login') {
    location.href = `/admin/?retour=${encodeURIComponent(location.pathname)}`
    throw new Error('Session expirée')
  }
  if (!res.ok) throw new Error(data.error ?? `Erreur ${res.status}`)
  return data as T
}

// Vérifie la connexion avant d'afficher une page admin ; renvoie l'email connecté
export async function requireSession(): Promise<string> {
  const { email } = await api<{ email: string }>('session')
  document.querySelectorAll('[data-admin-email]').forEach(el => { el.textContent = email })
  document.documentElement.classList.add('admin-ready')
  return email
}

// Réduit une photo dans le navigateur avant l'envoi (les photos de téléphone font souvent 5 à 10 Mo)
export async function resizeImage(file: File, maxSize: number, type: 'image/jpeg' | 'image/png' | 'image/webp', quality = 0.85): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Ce fichier n’est pas une image.')
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL(type, quality)
}

// Zone où l'on peut glisser un fichier image (ou cliquer pour le choisir)
export function dropzone(zone: HTMLElement, onFile: (file: File) => void) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.hidden = true
  zone.append(input)
  zone.addEventListener('click', e => { if (e.target !== input) input.click() })
  zone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click() } })
  input.addEventListener('change', () => { if (input.files?.[0]) onFile(input.files[0]); input.value = '' })
  zone.addEventListener('dragover', e => {
    if (!e.dataTransfer?.types.includes('Files')) return
    e.preventDefault()
    zone.classList.add('is-dragover')
  })
  zone.addEventListener('dragleave', () => zone.classList.remove('is-dragover'))
  zone.addEventListener('drop', e => {
    if (!e.dataTransfer?.files.length) return
    e.preventDefault()
    zone.classList.remove('is-dragover')
    onFile(e.dataTransfer.files[0])
  })
}

export function toast(message: string, kind: 'ok' | 'error' = 'ok') {
  const el = document.createElement('div')
  el.className = `admin-toast ${kind === 'ok' ? 'border-gold/60' : 'border-red-500/70'}`
  el.setAttribute('role', 'status')
  el.textContent = message
  document.body.append(el)
  setTimeout(() => el.remove(), kind === 'ok' ? 6000 : 9000)
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
