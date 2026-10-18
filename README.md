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

## Espace admin (publier sans toucher au code)

Adresse : **`/admin/`** (ex. https://morez-handball-site-web.vercel.app/admin/). Accès réservé aux adresses e-mail
de la liste blanche, avec leur code.

- **Actualités** : titre, catégorie, résumé, photo glissée, texte. La mise en page est automatique (chaque ligne
  devient un paragraphe) et le nouvel article apparaît en tête de la page Actualités et de l'accueil.
  Les articles existants peuvent être supprimés.
- **Matchs** : saisir un score (le match passe en « Dernier résultat » avec Victoire / Défaite / Nul), ajouter un
  match, ajouter un club en glissant son logo, glisser un logo sur un match pour choisir l'équipe.

Chaque enregistrement crée un commit dans le dépôt GitHub ; Vercel republie alors le site (1 à 2 minutes).
Le site reste 100 % statique : pas de base de données.

### Mise en service (une seule fois)

1. **Jeton GitHub** : github.com → Settings → Developer settings → Personal access tokens → *Fine-grained tokens* →
   *Generate new token*. Repository access : *Only select repositories* → ce dépôt.
   Permissions : *Contents* → **Read and write**. Copier le jeton.
2. **Variables Vercel** : projet → Settings → Environment Variables (environnement *Production*) :
   - `ADMIN_USERS` : `email1:code1;email2:code2` (codes longs, 12 caractères ou plus)
   - `ADMIN_SECRET` : une chaîne aléatoire de 32 caractères ou plus
   - `GITHUB_TOKEN` : le jeton de l'étape 1
3. **Redéployer** (Deployments → … → Redeploy) pour que les variables soient prises en compte.

Pour ajouter ou retirer une personne : modifier `ADMIN_USERS` dans Vercel puis redéployer. Une personne retirée
perd l'accès immédiatement après le redéploiement.

En local, copier `.env.example` en `.env` : sans `GITHUB_TOKEN`, les enregistrements de l'admin s'écrivent
directement dans les fichiers du projet (pratique pour tester).

## Modifier le contenu à la main

Tout le contenu courant se trouve dans `src/data/` et `src/content/`. Chaque fichier est commenté.

| Je veux…                                   | Fichier à modifier |
|--------------------------------------------|--------------------|
| Saisir un score, ajouter un match          | `src/data/matches.json` (ou l'espace admin) |
| Publier une actualité                      | nouveau fichier dans `src/content/actualites/` |
| Ajouter un joueur seniors                  | `src/data/players.ts` + photo dans `src/assets/joueurs/` |
| Changer un horaire, un encadrant           | `src/data/teams.ts` |
| Ajouter un album photo                     | dossier dans `src/assets/galerie/` + `src/data/albums.ts` |
| Ajouter un partenaire                      | `src/data/partners.ts` + logo dans `src/assets/partenaires/` |
| Téléphone, e-mail, adresse, chiffres clés  | `src/data/site.ts` |

### Saisir un résultat

Dans `src/data/matches.json`, ajouter le score au match joué (`[domicile, extérieur]`) :

```json
{ "round": 2, "home": "arbois-poligny", "away": "morez", "date": "2026-09-20", "time": "14h00", "score": [25, 31] },
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

Le site est actuellement hébergé sur **Vercel**, qui le republie à chaque modification du dépôt.

Hors espace admin, le site est entièrement statique. Sur un autre hébergeur, retirer l'adaptateur Vercel de
`astro.config.mjs` : `npm run build` produit alors un dossier `dist/` à copier tel quel (l'espace admin demande
en revanche un hébergeur capable d'exécuter les routes `/api/admin/*`, comme Vercel, Netlify ou un serveur Node).

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
