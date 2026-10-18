import type { ImageMetadata } from 'astro'
import walid from '@/assets/joueurs/walid.jpg'
import woikyl from '@/assets/joueurs/woikyl.jpg'
import mika from '@/assets/joueurs/mika.jpg'
import aykut from '@/assets/joueurs/aykut.jpg'
import mourad from '@/assets/joueurs/mourad.jpg'
import mohamed from '@/assets/joueurs/mohamed.jpg'
import abdelatif from '@/assets/joueurs/abdelatif.jpg'
import mae from '@/assets/joueurs/mae.jpg'

// Effectif Seniors Masculins, dans l'ordre d'affichage du carrousel.
// Pour ajouter un joueur : déposer sa photo dans src/assets/joueurs/, l'importer ci-dessus
// et ajouter une ligne. `focus` règle le cadrage vertical de la photo (0% = haut).
export interface Player {
  firstName: string
  lastName: string
  position: string
  photo: ImageMetadata
  focus?: string
}

export const seniorPlayers: Player[] = [
  { firstName: 'Walid', lastName: 'Laarabi', position: 'Pivot', photo: walid, focus: '22%' },
  { firstName: 'Ouhammou', lastName: 'Woikyll', position: 'Ailier gauche', photo: woikyl },
  { firstName: 'Mickael', lastName: 'Gil Martins', position: 'Gardien de but', photo: mika },
  { firstName: 'Aykut', lastName: 'Demir', position: 'Demi-centre', photo: aykut },
  { firstName: 'Mourad', lastName: 'Messaoudi', position: 'Arrière gauche', photo: mourad, focus: '20%' },
  { firstName: 'Mohamed', lastName: 'Faidi', position: 'Demi-centre', photo: mohamed },
  { firstName: 'Abdellatif', lastName: 'Azmami', position: 'Ailier gauche', photo: abdelatif },
  { firstName: 'Mae', lastName: 'Frajer', position: 'Arrière droit', photo: mae },
]
