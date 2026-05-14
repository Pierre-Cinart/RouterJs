# RouterJs

RouterJs est une mini SPA en JavaScript natif qui montre comment mettre en place
un routage cote client sans framework. Le projet repose sur un unique `index.html`,
sur un hash router (`#/contact`, `#/menu`, etc.) et sur le chargement dynamique
de fragments HTML.

## Objectif

Ce projet sert a comprendre simplement :

- comment une SPA intercepte les clics de navigation ;
- comment une URL comme `#/contact` peut afficher une vue sans recharger toute la page ;
- comment gerer une page 404 cote client ;
- comment faire fonctionner le refresh immediatement avec Live Server.

## Arborescence

```text
RouterJs/
|-- 404.html
|-- index.html
|-- README.md
`-- front/
    |-- js/
    |   `-- router/
    |       |-- allRoutes.js
    |       |-- Route.js
    |       `-- router.js
    `-- pages/
        |-- 404.html
        |-- contact.html
        |-- home.html
        `-- menu.html
```

## Fonctionnement general

Le cycle complet de navigation est le suivant :

1. le navigateur charge `index.html` ;
2. `router.js` lit le hash courant dans l'URL ;
3. il cherche une route correspondante dans `allRoutes.js` ;
4. il charge le fragment HTML associe avec `fetch()` ;
5. il injecte ce fragment dans `<main id="main-page">` ;
6. il met a jour le titre de l'onglet.

Quand l'utilisateur clique sur un lien du menu, on ne recharge pas tout le document :
on change seulement la partie `#` de l'URL, puis le routeur recharge la bonne vue.

### 1. `index.html`

`index.html` est la seule vraie page chargee par l'application.
Elle contient :

- la navigation ;
- la zone `<main id="main-page">` dans laquelle les vues sont injectees ;
- l'import du routeur principal.

### 2. `Route.js`

Ce fichier definit la classe `Route`, utilisee pour representer chaque page de la SPA.
Chaque instance contient :

- `url` : l'URL attendue dans la barre d'adresse ;
- `title` : le titre de l'onglet ;
- `pathHtml` : le fragment HTML a charger ;
- `pathJS` : un script optionnel propre a la vue.

### 3. `allRoutes.js`

Ce fichier centralise toutes les routes connues par l'application.
Pour ajouter une nouvelle page, il faut :

1. creer un nouveau fragment HTML dans `front/pages/` ;
2. ajouter une nouvelle instance de `Route` dans `allRoutes.js` ;
3. ajouter eventuellement un lien dans la navigation de `index.html`.

### 4. `router.js`

Le routeur :

- lit `window.location.hash` ;
- cherche la route correspondante ;
- charge le bon fichier HTML avec `fetch()` ;
- injecte ce HTML dans `<main>` ;
- met a jour `document.title` ;
- intercepte les clics en modifiant la partie `#` de l'URL ;
- recharge la bonne vue lors du bouton precedent/suivant du navigateur.

Si aucune route ne correspond, la vue `front/pages/404.html` est affichee.

## Difference entre "page complete" et "fragment HTML"

Dans ce projet, `index.html` est une page HTML complete avec :

- `<!DOCTYPE html>`
- `<html>`
- `<head>`
- `<body>`

En revanche, les fichiers dans `front/pages/` ne sont pas des pages completes.
Ce sont seulement des morceaux de HTML, prevus pour etre inseres dans `<main>`.

Par exemple, `front/pages/contact.html` contient juste le contenu de la vue Contact,
pas une nouvelle structure HTML complete.

## Pourquoi le refresh fonctionne avec Live Server

Avec un hash router, le serveur ne voit jamais de route comme `/contact`.
Il voit seulement la page principale, par exemple :

- `http://127.0.0.1:5500/RouterJs/#/`
- `http://127.0.0.1:5500/RouterJs/#/contact`

Tout ce qui se trouve apres `#` est gere par JavaScript dans le navigateur.
Le refresh fonctionne donc sans configuration speciale du serveur.

Autrement dit :

- le serveur gere `index.html`
- le routeur JavaScript gere `#/`, `#/menu`, `#/contact`, etc.

Cette separation est la raison principale pour laquelle le projet fonctionne
correctement avec Live Server.

## Routes disponibles

- `#/` : accueil
- `#/menu` : menu
- `#/contact` : contact
- toute autre URL : page 404 cote client

## Lancer le projet

Ouvre le projet avec un serveur statique local, par exemple :

```bash
npx serve .
```

ou avec l'extension Live Server dans VS Code.

## Points pedagogiques importants

- Le routeur ne charge pas des pages HTML completes, mais des fragments injectes dans `<main>`.
- Les liens restent simples a partager grace au hash router.
- Le bouton precedent/suivant continue de fonctionner grace a l'evenement `hashchange`.
- Cette approche est ideale pour Live Server ou tout hebergement statique sans reecriture serveur.

## Auteur

Pierre Cinart
