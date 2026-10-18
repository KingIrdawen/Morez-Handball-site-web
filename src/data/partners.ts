import type { ImageMetadata } from 'astro'
import century21 from '@/assets/partenaires/century-21.png'
import h24Box from '@/assets/partenaires/h24-box.jpg'
import capAssurances from '@/assets/partenaires/cap-assurances.jpg'
import villeMorez from '@/assets/partenaires/ville-morez.png'
import galliez from '@/assets/partenaires/controle-technique-galliez.jpg'

// Partenaires du club. `url` (facultatif) rend le logo cliquable vers leur site.
export interface Partner {
  name: string
  logo: ImageMetadata
  url?: string
}

export const partners: Partner[] = [
  { name: 'Century 21 Martinot Immobilier', logo: century21 },
  { name: 'H24 Box', logo: h24Box },
  { name: 'CAP Assurances', logo: capAssurances },
  { name: 'Ville de Morez', logo: villeMorez },
  { name: 'Contrôle Technique Galliez', logo: galliez },
]
