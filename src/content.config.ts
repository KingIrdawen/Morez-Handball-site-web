import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// Actualités : un fichier Markdown par article dans src/content/actualites/.
// Le nom du fichier donne l'adresse de la page (/actualites/<nom-du-fichier>/).
const actualites = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/actualites' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    category: z.string(), // ex. Match, Mercato, Préparation, École de hand
    date: z.coerce.date(), // sert à trier les articles, le plus récent en premier
    excerpt: z.string(), // résumé affiché sur les cartes et en chapô
    image: image(), // chemin relatif vers la photo, ex. ../../assets/actualites/match.jpg
    imageAlt: z.string().optional(),
  }),
})

export const collections = { actualites }
