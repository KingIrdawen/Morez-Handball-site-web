// Informations générales du club, réutilisées sur tout le site.

export const club = {
  name: 'Morez Handball',
  tagline: 'Morez • Haut-Jura',
  fullName: 'Handball Morez Haut-Jura',
  department: 'Jura (39)',
  description: 'Handball Morez Haut-Jura — un club formateur du Jura (39), du Baby Hand aux seniors.',
  venue: 'Gymnase de Morez',
  // Saison affichée sur les pages d'inscription
  registrationSeason: '2026 / 2027',
  // Coordonnées : à compléter, elles s'afficheront automatiquement sur la page Contact et en pied de page
  email: '',
  phone: '',
  address: '',
  facebook: '',
  instagram: '',
}

// Chiffres clés (accueil et page Le club)
export const stats = [
  { value: '6', label: 'équipes engagées' },
  { value: '120+', label: 'licenciés' },
  { value: '3', label: 'séances hebdo seniors' },
  { value: '39', label: 'au cœur du Haut-Jura' },
]

// Menu principal
export const navigation = [
  { href: '/', label: 'Accueil' },
  { href: '/club/', label: 'Le club' },
  { href: '/equipes/', label: 'Équipes' },
  { href: '/matchs/', label: 'Matchs' },
  { href: '/actualites/', label: 'Actualités' },
  { href: '/galerie/', label: 'Galerie' },
  { href: '/partenaires/', label: 'Partenaires' },
  { href: '/contact/', label: 'Contact' },
]

// Liens du pied de page, en deux colonnes
export const footerLinks = [
  [
    { href: '/club/', label: 'Le club' },
    { href: '/matchs/', label: 'Matchs' },
    { href: '/rejoindre/', label: 'Rejoindre' },
    { href: '/contact/', label: 'Contact' },
  ],
  [
    { href: '/equipes/', label: 'Équipes' },
    { href: '/actualites/', label: 'Actualités' },
    { href: '/partenaires/', label: 'Partenaires' },
  ],
]
