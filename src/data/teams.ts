import type { ImageMetadata } from 'astro'
import seniors from '@/assets/equipes/seniors.jpg'
import moins18 from '@/assets/equipes/moins-de-18.jpg'
import moins15 from '@/assets/equipes/moins-de-15.jpg'
import moins11 from '@/assets/equipes/moins-de-11.jpg'
import babyHand from '@/assets/equipes/baby-hand.jpg'

export interface Team {
  slug: string // adresse de la page : /equipes/<slug>/
  group: string // petit libellé doré au-dessus du nom
  name: string
  level: string // affiché sous le titre de la page équipe
  birthYears: string
  coach: string
  competition: string
  description: string
  image: ImageMetadata
  slots: { day: string; time: string; place: string }[]
  hasRoster?: boolean // affiche le carrousel de l'effectif (src/data/players.ts)
}

export const teams: Team[] = [
  {
    slug: 'seniors-masculins',
    group: 'Seniors',
    name: 'Seniors Masculins',
    level: 'Seniors · Départemental Jura',
    birthYears: '2008 et avant',
    coach: 'Mohamed Faidi',
    competition: 'Départemental Jura',
    description: 'Le fer de lance du club : une équipe soudée, physique, qui joue vite en contre-attaque et défend haut en 0-6 agressif.',
    image: seniors,
    slots: [
      { day: 'Mardi', time: '20h00 – 22h00', place: 'Gymnase de la Citadelle' },
      { day: 'Jeudi', time: '20h00 – 22h00', place: 'Gymnase de la Citadelle' },
    ],
    hasRoster: true,
  },
  {
    slug: 'moins-de-18',
    group: 'Jeunes',
    name: '-18 Ans',
    level: 'Jeunes · Championnat régional Bourgogne-Franche-Comté',
    birthYears: '2009 – 2011',
    coach: 'Staff jeunes',
    competition: 'Championnat régional Bourgogne-Franche-Comté',
    description: 'La génération qui pousse : intensité, duels et prise de responsabilité. Passerelle directe vers le groupe seniors.',
    image: moins18,
    slots: [{ day: 'Vendredi', time: '19h00 – 21h00', place: 'Gymnase de la Citadelle' }],
  },
  {
    slug: 'moins-de-15',
    group: 'Jeunes',
    name: '-15 Ans',
    level: 'Jeunes · Championnat départemental',
    birthYears: '2012 – 2013',
    coach: 'Staff jeunes',
    competition: 'Championnat départemental',
    description: 'Âge clé de la formation : technique individuelle, lecture du jeu et premières bases tactiques collectives.',
    image: moins15,
    slots: [{ day: 'Mercredi', time: '17h30 – 19h30', place: 'Gymnase de la Citadelle' }],
  },
  {
    slug: 'moins-de-11',
    group: 'École de hand',
    name: '-11 Ans',
    level: 'École de hand · Plateaux départementaux',
    birthYears: '2016 – 2017',
    coach: 'École de hand',
    competition: 'Plateaux départementaux',
    description: 'On apprend en jouant : motricité, passes, tirs et premiers plateaux le samedi matin avec les clubs voisins.',
    image: moins11,
    slots: [{ day: 'Samedi', time: '10h00 – 11h30', place: 'Gymnase de la Citadelle' }],
  },
  {
    slug: 'baby-hand',
    group: 'Baby Hand',
    name: 'Baby Hand',
    level: 'Baby Hand · Sans compétition',
    birthYears: '2020 – 2022 (3 à 5 ans)',
    coach: 'Animateurs Baby Hand',
    competition: 'Sans compétition',
    description: 'Éveil moteur sous forme de jeux : courir, lancer, attraper, coopérer. Les parents sont bienvenus sur le tapis.',
    image: babyHand,
    slots: [{ day: 'Samedi', time: '9h00 – 10h00', place: 'Gymnase de la Citadelle' }],
  },
]
