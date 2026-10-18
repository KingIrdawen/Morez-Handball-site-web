import type { ImageMetadata } from 'astro'
import data from './matches.json'
import type { Match, MatchesFile } from '@/lib/schemas'

// Le calendrier se modifie depuis l'espace admin (/admin/matchs/), ou à la main dans matches.json.
// Après un match, il suffit d'ajouter le score : la rencontre passe automatiquement
// en « Dernier résultat » et la suivante devient le « Prochain match ».

export type { Match }
export type ClubKey = string

const file = data as MatchesFile

// Logos des clubs, chargés depuis src/assets/clubs/
const logos = import.meta.glob<{ default: ImageMetadata }>('/src/assets/clubs/*.{png,jpg,jpeg,webp}', { eager: true })

export const clubs: Record<string, { name: string; logo: ImageMetadata }> = Object.fromEntries(
  Object.entries(file.clubs).map(([key, club]) => {
    const logo = logos[`/src/assets/clubs/${club.logo}`]
    if (!logo) throw new Error(`Logo introuvable pour ${club.name} : src/assets/clubs/${club.logo}`)
    return [key, { name: club.name, logo: logo.default }]
  }),
)

export const matches: Match[] = [...file.matches].sort((a, b) => a.round - b.round)

export const playedMatches = matches.filter(m => m.score)
export const upcomingMatches = matches.filter(m => !m.score)
export const lastResult = playedMatches.at(-1)
export const nextMatch = upcomingMatches[0]

export function opponentOf(match: Match): ClubKey {
  return match.home === 'morez' ? match.away : match.home
}

export function outcome(match: Match): 'Victoire' | 'Défaite' | 'Nul' | undefined {
  if (!match.score) return undefined
  const [home, away] = match.score
  const morez = match.home === 'morez' ? home : away
  const other = match.home === 'morez' ? away : home
  return morez > other ? 'Victoire' : morez < other ? 'Défaite' : 'Nul'
}

export function formatDate(date: string): string {
  const formatted = new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
