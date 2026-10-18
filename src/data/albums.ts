import type { ImageMetadata } from 'astro'

// Albums photo de la galerie.
// Pour créer un album : créer un dossier src/assets/galerie/<slug>/, y déposer les photos,
// puis ajouter une entrée ci-dessous avec le même <slug>. Les photos du dossier sont
// détectées automatiquement (ordre alphabétique des noms de fichiers, la couverture en premier).
export interface Album {
  slug: string
  title: string
  season: string
  team: string
  place: string
  cover: string // nom du fichier de couverture dans le dossier de l'album
  captions?: Record<string, string> // légendes facultatives, par nom de fichier
}

export const albums: Album[] = [
  {
    slug: 'match-seniors-13-09',
    title: 'Match Seniors 13.09',
    season: 'Saison 2025-2026',
    team: 'Équipe Seniors',
    place: 'Gymnase de la Citadelle',
    cover: 'DSC_0504.jpg',
    captions: {
      'DSC_0475.jpg': 'relance du gardien',
      'DSC_0479.jpg': 'tir en suspension',
      'DSC_0480.jpg': 'armé du bras au tir',
      'DSC_0484.jpg': 'tir face au gardien',
      'DSC_0491.jpg': 'envol au tir',
      'DSC_0498.jpg': 'tir en suspension',
      'DSC_0500.jpg': 'montée de balle',
      'DSC_0503.jpg': 'tir en extension',
      'DSC_0504.jpg': 'ailier en suspension',
      'DSC_0507.jpg': 'duel avec le gardien',
      'DSC_0509.jpg': 'placement en attaque',
      'DSC_0510.jpg': 'échange entre joueurs',
      'DSC_0512.jpg': 'percussion au centre',
      'DSC_0513.jpg': "organisation de l'attaque",
      'DSC_0519.jpg': 'défense au contact',
      'DSC_0522.jpg': "duel sur l'aile",
      'DSC_0523.jpg': 'un contre un',
      'DSC_0526.jpg': 'attaque placée',
      'DSC_0527.jpg': 'replacement défensif',
      'DSC_0530.jpg': 'engagement',
    },
  },
]

// Toutes les photos de la galerie, chargées depuis src/assets/galerie/
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/galerie/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true },
)

export interface AlbumPhoto {
  file: string
  image: ImageMetadata
  caption: string
}

export function albumPhotos(album: Album): AlbumPhoto[] {
  const prefix = `/src/assets/galerie/${album.slug}/`
  const photos = Object.entries(files)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, mod]) => {
      const file = path.slice(prefix.length)
      const detail = album.captions?.[file]
      return { file, image: mod.default, caption: detail ? `${album.title} — ${detail}` : album.title }
    })
    .sort((a, b) => a.file.localeCompare(b.file))
  const cover = photos.findIndex(p => p.file === album.cover)
  if (cover > 0) photos.unshift(...photos.splice(cover, 1))
  return photos
}

export function albumCover(album: Album): ImageMetadata {
  return albumPhotos(album)[0].image
}

// Albums regroupés par saison, la plus récente en premier
export function albumsBySeason(): [string, Album[]][] {
  const groups = new Map<string, Album[]>()
  for (const a of albums) groups.set(a.season, [...(groups.get(a.season) ?? []), a])
  return [...groups.entries()].sort(([a], [b]) => b.localeCompare(a))
}
