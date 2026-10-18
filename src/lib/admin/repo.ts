import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { GITHUB_BRANCH, GITHUB_REPO, GITHUB_TOKEN } from 'astro:env/server'

// Lecture / écriture des fichiers du site.
// En production : directement dans le dépôt GitHub (un commit par enregistrement),
// ce qui déclenche une nouvelle publication automatique sur Vercel.
// En local sans jeton GitHub : dans les fichiers du projet, pour tester.

export interface FileChange {
  path: string // chemin depuis la racine du dépôt, ex. src/data/matches.json
  content?: string | Buffer // absent = suppression
}

const local = !GITHUB_TOKEN
if (local && import.meta.env.PROD) console.warn('GITHUB_TOKEN absent : les modifications admin ne peuvent pas être enregistrées.')

function assertWritable() {
  if (local && import.meta.env.PROD) throw new Error("Enregistrement impossible : le jeton GitHub (GITHUB_TOKEN) n'est pas configuré.")
}

async function gh(path: string, init: RequestInit & { raw?: boolean } = {}) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: init.raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub ${res.status} : ${(await res.text()).slice(0, 200)}`)
  return init.raw ? res.text() : res.json()
}

export async function readText(path: string): Promise<string | null> {
  if (local) return readFile(join(process.cwd(), path), 'utf8').catch(() => null)
  return gh(`/contents/${encodeURI(path)}?ref=${GITHUB_BRANCH}`, { raw: true })
}

export async function listDir(path: string): Promise<string[]> {
  if (local) return readdir(join(process.cwd(), path)).catch(() => [])
  const items = await gh(`/contents/${encodeURI(path)}?ref=${GITHUB_BRANCH}`)
  return Array.isArray(items) ? items.map((i: { name: string }) => i.name) : []
}

export async function commit(message: string, changes: FileChange[]): Promise<void> {
  assertWritable()
  if (local) {
    for (const c of changes) {
      const file = join(process.cwd(), c.path)
      if (c.content === undefined) await rm(file, { force: true })
      else { await mkdir(dirname(file), { recursive: true }); await writeFile(file, c.content) }
    }
    return
  }

  // Un seul commit pour tous les fichiers (API « Git Data » de GitHub)
  for (let attempt = 0; attempt < 2; attempt++) {
    const ref = await gh(`/git/ref/heads/${GITHUB_BRANCH}`)
    const parent = await gh(`/git/commits/${ref.object.sha}`)
    const tree = await Promise.all(changes.map(async c => {
      if (c.content === undefined) return { path: c.path, mode: '100644', type: 'blob', sha: null }
      const blob = await gh('/git/blobs', {
        method: 'POST',
        body: JSON.stringify({ content: Buffer.from(c.content).toString('base64'), encoding: 'base64' }),
      })
      return { path: c.path, mode: '100644', type: 'blob', sha: blob.sha }
    }))
    const newTree = await gh('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: parent.tree.sha, tree }) })
    const newCommit = await gh('/git/commits', {
      method: 'POST',
      body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] }),
    })
    try {
      await gh(`/git/refs/heads/${GITHUB_BRANCH}`, { method: 'PATCH', body: JSON.stringify({ sha: newCommit.sha }) })
      return
    } catch (e) {
      // Quelqu'un a enregistré entre-temps : on recommence sur la nouvelle version
      if (attempt === 1) throw e
    }
  }
}
