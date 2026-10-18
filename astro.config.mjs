// @ts-check
import { defineConfig, envField } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'

export default defineConfig({
  // Adresse publique du site : à remplacer par le nom de domaine du club
  site: 'https://morezhandball.fr',
  // Les pages restent statiques ; seules les routes /api/admin/* tournent sur le serveur
  output: 'static',
  adapter: vercel(),
  // Chaque page devient un dossier avec index.html (/club/ → club/index.html)
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
  // Secrets de l'espace admin, lus au moment de l'exécution (variables d'environnement Vercel)
  env: {
    schema: {
      // Personnes autorisées : « email:code » séparés par des points-virgules
      ADMIN_USERS: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Chaîne aléatoire qui signe les cookies de connexion
      ADMIN_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Jeton GitHub (droit « Contents: read and write » sur le dépôt) pour enregistrer les modifications
      GITHUB_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      GITHUB_REPO: envField.string({ context: 'server', access: 'secret', default: 'KingIrdawen/Morez-Handball-site-web' }),
      GITHUB_BRANCH: envField.string({ context: 'server', access: 'secret', default: 'main' }),
    },
  },
})
