// Informations générales du club, réutilisées sur tout le site.

export const club = {
  name: 'Morez Handball',
  tagline: 'Morez • Haut-Jura',
  fullName: 'Handball Morez Haut-Jura',
  department: 'Jura (39)',
  description: 'Handball Morez Haut-Jura — un club formateur du Jura (39), du Baby Hand aux seniors.',
  // Salle où se jouent les entraînements et les matchs à domicile
  venue: 'Gymnase de la Citadelle',
  venueAddress: '39400 Morez',
  // Saison affichée sur les pages d'inscription
  registrationSeason: '2026 / 2027',
  // Coordonnées : affichées sur la page Contact et en pied de page (une valeur vide n'est pas affichée)
  email: '5239006@bfc.ffhandball.net',
  phone: '06.73.92.54.50',
  // Adresse postale du club
  address: 'Place de la Mairie',
  postalCode: '39400 Hauts-de-Bienne',
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
// Lien « tel: » à partir du numéro affiché (06.73.92.54.50 → +33673925450)
export function phoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return `tel:${digits.startsWith('0') ? `+33${digits.slice(1)}` : digits}`
}

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
