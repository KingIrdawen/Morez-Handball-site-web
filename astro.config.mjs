// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Adresse publique du site : à remplacer par le nom de domaine du club
  site: 'https://morezhandball.fr',
  // Chaque page devient un dossier avec index.html (/club/ → club/index.html) :
  // fonctionne sur n'importe quel hébergeur, même un simple serveur de fichiers
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
})
