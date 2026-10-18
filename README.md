# Morez Handball — site du club

Site du club **Handball Morez Haut-Jura**, entièrement en code et hébergeable n'importe où.

Le site est construit avec [Astro](https://astro.build) : à la compilation, il produit un dossier `dist/`
de fichiers **HTML, CSS et images**, sans base de données ni serveur applicatif. N'importe quel
hébergement de fichiers suffit, y compris gratuit.

- Images converties automatiquement en WebP et redimensionnées (le site pèse ~15 Mo au lieu de 30+).
- Polices (Bebas Neue, Barlow) hébergées avec le site : aucun appel à Google ni à un service tiers.
- Fonctionne sur mobile (menu, carrousel au doigt, visionneuse photo).

## Démarrer

Prérequis : [Node.js](https://nodejs.org) 20 ou plus récent.

```bash
npm install        # une seule fois
npm run dev        # site en local sur http://localhost:4321, rechargé à chaque modification
npm run build      # génère le site final dans dist/
npm run preview    # affiche le contenu de dist/ pour vérifier avant de publier
```

## Modifier le contenu

Tout le contenu courant se trouve dans `src/data/` et `src/content/`. Chaque fichier est commenté.

| Je veux…                                   | Fichier à modifier |
|--------------------------------------------|--------------------|
| Saisir un score, ajouter un match          | `src/data/matches.ts` |
| Publier une actualité                      | nouveau fichier dans `src/content/actualites/` |
| Ajouter un joueur seniors                  | `src/data/players.ts` + photo dans `src/assets/joueurs/` |
| Changer un horaire, un encadrant           | `src/data/teams.ts` |
| Ajouter un album photo                     | dossier dans `src/assets/galerie/` + `src/data/albums.ts` |
| Ajouter un partenaire                      | `src/data/partners.ts` + logo dans `src/assets/partenaires/` |
| Téléphone, e-mail, adresse, chiffres clés  | `src/data/site.ts` |

### Saisir un résultat

Dans `src/data/matches.ts`, ajouter le score au match joué (`[domicile, extérieur]`) :

```ts
{ round: 2, home: 'arboisPoligny', away: 'morez', date: '2026-09-20', time: '14h00', score: [25, 31] },
```

Le match passe automatiquement en « Dernier résultat » (avec Victoire / Défaite / Nul), et le suivant
devient le « Prochain match » sur l'accueil.

### Publier une actualité

Copier un fichier de `src/content/actualites/`, le renommer (le nom devient l'adresse de la page)
et changer l'en-tête et le texte :

```md
---
title: Titre de l'article
category: Match
date: 2026-10-18
excerpt: Résumé d'une ou deux phrases, affiché sur les cartes.
image: ../../assets/actualites/ma-photo.jpg
---

Le texte de l'article. Un paragraphe par bloc, **gras**, [liens](https://exemple.fr)…
```

Les articles sont triés par `date`, le plus récent en premier (la date n'est pas affichée).

## Héberger le site

Après `npm run build`, il suffit de copier le contenu du dossier `dist/` chez un hébergeur.

**Gratuit, sans serveur à gérer** (recommandé) : Cloudflare Pages, Netlify ou GitHub Pages.
On relie le dépôt GitHub, on indique la commande `npm run build` et le dossier `dist`, et le site
se republie tout seul à chaque modification poussée sur GitHub.

**Hébergement mutualisé** (OVH, o2switch, Infomaniak…, quelques euros par mois) : envoyer le contenu
de `dist/` par FTP dans le dossier web.

**Serveur personnel** (VPS, Raspberry Pi…) : servir `dist/` avec nginx, Caddy ou Apache.
Exemple nginx :

```nginx
server {
  server_name morezhandball.fr;
  root /var/www/morez-handball/dist;
  error_page 404 /404.html;
  location / { try_files $uri $uri/ =404; }
}
```

Dans tous les cas, le seul coût obligatoire est le **nom de domaine** (~10 € par an). Penser à
mettre la bonne adresse dans `site` de `astro.config.mjs`.

## Structure

```
src/
  assets/       photos et logos (optimisés automatiquement à la compilation)
  components/   éléments réutilisables (cartes de match, carrousel, en-tête…)
  content/      actualités en Markdown
  data/         données du club (équipes, matchs, joueurs, partenaires, albums)
  layouts/      gabarit commun à toutes les pages
  pages/        une page par fichier (l'arborescence donne les adresses)
  styles/       couleurs et polices du club
```
