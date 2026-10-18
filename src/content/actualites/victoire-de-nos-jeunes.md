---
title: "Victoire de nos Jeunes"
category: "Match"
date: 2026-10-18T15:42:37.796Z
excerpt: "une recontre maitrisée de bout en bout"
image: ../../assets/actualites/victoire-de-nos-jeunes.jpg
imageAlt: "öquipe U15 Garçon"
---

Créer le jeton

1. Connecté à GitHub, va sur https://github.com/settings/personal-access-tokens/new (ou : photo de profil, puis Settings, puis Developer settings, puis Personal access tokens, puis Fine-grained tokens, puis Generate new token).

2. Remplis le formulaire :

- Token name : par exemple Admin site Morez Handball.

- Expiration : choisis une durée, par exemple 1 an. Quand le jeton expire, les publications ne s'enregistrent plus et il faut en créer un nouveau.

- Repository access : coche Only select repositories, puis choisis KingIrdawen/Morez-Handball-site-web.

- Permissions : dans Repository permissions, trouve Contents et mets-le sur Read and write. Ne touche à rien d'autre (Metadata passe tout seul en lecture seule, c'est normal).

3. Clique sur Generate token, puis copie le jeton.

GitHub n'affiche le jeton qu'une seule fois. Si tu fermes la page sans l'avoir copié, il faudra en créer un autre.

Dans Vercel, ajoute la variable GITHUB_TOKEN, colle le jeton comme valeur, en environnement Production. Ne le colle pas ici dans la conversation.

Ensuite, redéploie (Deployments, menu « … », puis Redeploy), et dis-moi quand c'est fait pour que je vérifie la configuration.
