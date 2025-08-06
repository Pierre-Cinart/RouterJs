# 📦 RouterJs – Mini Routeur SPA en JavaScript

Ce projet propose un **routeur client léger** permettant de construire une **Single Page Application (SPA)** sans utiliser de framework (React, Vue, etc.).  
Il repose uniquement sur **JavaScript natif**, une structure modulaire claire, et le chargement dynamique de contenu HTML.

---

## 📁 Arborescence du projet

```
.
├── index.html                  # Fichier principal (point d'entrée)
└── front/
    ├── js/
    │   └── router/
    │       ├── Route.js        # Classe Route
    │       ├── allRoutes.js    # Déclaration des routes
    │       └── router.js       # Logique de routage
    └── pages/
        ├── home.html           # Page d’accueil
        ├── contact.html        # Page contact
        └── 404.html            # Page 404 personnalisée
```

---

## 🚦 Fonctionnement du routeur

### ✅ 1. Définition des routes (`allRoutes.js`)

Chaque route est un objet `Route` contenant :
- `url` : le chemin dans la barre d'adresse
- `title` : le titre de la page
- `pathHtml` : le chemin vers le contenu HTML à injecter
- `pathJS` *(optionnel)* : JS spécifique à la page

```js
export const allRoutes = [
  new Route("/", "Accueil", "front/pages/home.html"),
  new Route("/contact", "Contact", "front/pages/contact.html")
];
```

---

### ✅ 2. Classe Route (`Route.js`)

```js
export default class Route {
  constructor(url, title, pathHtml, pathJS = "") {
    this.url = url;
    this.title = title;
    this.pathHtml = pathHtml;
    this.pathJS = pathJS;
  }
}
```

---

### ✅ 3. Routeur (`router.js`)

- Utilise `window.location.pathname` pour détecter l’URL
- Charge dynamiquement le contenu HTML via `fetch()`
- Injecte le contenu dans la balise `<main id="main-page">`
- Met à jour le titre (`document.title`)
- Gère les clics (`onclick="route(event)"`) sans rechargement

Il intercepte également les erreurs (route inconnue) et redirige vers une **page 404**.

---

## 🧪 Exemple de lien dans `index.html`

```html
<a href="/contact" onclick="route(event)">Contact</a>
```

---

## ❌ Attention

- Ne pas actualiser une page directement (F5) sans serveur adapté.
- L’accès direct à `/contact` ne fonctionne pas sans configuration serveur (ex : Node, Apache rewrite…).

---

## ✅ Objectifs du projet

- Apprentissage du routing SPA sans framework
- Utilisation native de `fetch`, `history.pushState`, `window.onpopstate`
- Modularité et simplicité maximale

---

## 🚀 Auteur

**Pierre Cinart**  
Projet réalisé dans le cadre d’une formation 
