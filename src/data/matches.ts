import type { ImageMetadata } from 'astro'
import logoMorez from '@/assets/club/logo.jpg'
import arboisPoligny from '@/assets/adversaires/arbois-poligny.png'
import varoisArc from '@/assets/adversaires/varois-arc.webp'
import etoileAuxonnaise from '@/assets/adversaires/etoile-auxonnaise.jpg'
import longvic from '@/assets/adversaires/longvic.png'
import saintVit from '@/assets/adversaires/saint-vit.jpg'
import seurre from '@/assets/adversaires/seurre.webp'

// Clubs rencontrés. Pour un nouvel adversaire : déposer son logo dans src/assets/adversaires/,
// l'importer ci-dessus et l'ajouter ici.
export const clubs = {
  morez: { name: 'HB Morez Haut Jura', logo: logoMorez },
  arboisPoligny: { name: 'HB Arbois Poligny (B)', logo: arboisPoligny },
  varoisArc: { name: 'HBC Varois-Arc (B)', logo: varoisArc },
  etoileAuxonnaise: { name: 'Etoile Auxonnaise HB', logo: etoileAuxonnaise },
  longvic: { name: 'ALC Longvic (C)', logo: longvic },
  saintVit: { name: 'US Saint Vit HB', logo: saintVit },
  seurre: { name: 'JL Seurre', logo: seurre },
} satisfies Record<string, { name: string; logo: ImageMetadata }>

export type ClubKey = keyof typeof clubs

export interface Match {
  round: number // journée
  home: ClubKey // équipe qui reçoit
  away: ClubKey
  date?: string // AAAA-MM-JJ, à laisser vide si la date n'est pas encore connue
  time?: string // ex. '20h00'
  score?: [number, number] // [domicile, extérieur] — à renseigner après le match
}

// Calendrier Seniors Masculins, dans l'ordre des journées.
// Après un match, il suffit d'ajouter le score : la rencontre passe automatiquement
// en « Dernier résultat » et la suivante devient le « Prochain match ».
export const matches: Match[] = [
  { round: 1, home: 'morez', away: 'varoisArc', date: '2026-09-12', time: '21h00', score: [44, 24] },
  { round: 2, home: 'arboisPoligny', away: 'morez', date: '2026-09-20', time: '14h00' },
  { round: 3, home: 'morez', away: 'etoileAuxonnaise', date: '2026-09-26', time: '20h00' },
  { round: 4, home: 'longvic', away: 'morez', date: '2026-10-03', time: '20h00' },
  { round: 5, home: 'morez', away: 'saintVit' },
  { round: 6, home: 'seurre', away: 'morez' },
]

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
