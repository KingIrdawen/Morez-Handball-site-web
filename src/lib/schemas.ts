import { z } from 'astro/zod'

// Format du fichier src/data/matches.json, partagé par le site et l'espace admin

// Identifiant de club : minuscules, chiffres et tirets (sert aussi de nom de fichier pour le logo)
export const clubKey = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(60)

export const clubSchema = z.object({
  name: z.string().trim().min(1).max(80),
  logo: z.string().regex(/^[a-z0-9-]+\.(png|jpe?g|webp)$/),
})

export const matchSchema = z.object({
  round: z.number().int().min(1).max(99), // journée
  home: clubKey, // équipe qui reçoit
  away: clubKey,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // AAAA-MM-JJ, absent si inconnue
  time: z.string().regex(/^\d{1,2}h\d{2}$/).optional(), // ex. 20h00
  score: z.tuple([z.number().int().min(0).max(199), z.number().int().min(0).max(199)]).optional(),
})

export const matchesFileSchema = z.object({
  clubs: z.record(clubKey, clubSchema),
  matches: z.array(matchSchema).max(200),
}).superRefine((data, ctx) => {
  if (!data.clubs.morez) ctx.addIssue({ code: 'custom', message: 'Le club « morez » doit exister.' })
  data.matches.forEach((m, i) => {
    for (const side of ['home', 'away'] as const) {
      if (!data.clubs[m[side]]) ctx.addIssue({ code: 'custom', path: ['matches', i, side], message: `Club inconnu : ${m[side]}` })
    }
    if (m.home === m.away) ctx.addIssue({ code: 'custom', path: ['matches', i], message: 'Un club ne peut pas jouer contre lui-même.' })
  })
})

export type MatchesFile = z.infer<typeof matchesFileSchema>
export type Match = z.infer<typeof matchSchema>
