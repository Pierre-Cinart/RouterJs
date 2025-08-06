# 🧭 Analyse du Système de Routage SPA en JavaScript

Ce document analyse un système de **routage client léger** basé sur trois fichiers : `Route.js`, `allRoutes.js` et `Router.js`. Il permet de construire un site de type SPA (Single Page Application) sans framework.

---

## 🔧 FICHIER 1 : `Route.js`

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

### ✅ Analyse
- Définit une classe `Route` représentant une page du site.
- Chaque route possède :
  - `url` : chemin de la route (ex : `/`),
  - `title` : titre de la page,
  - `pathHtml` : chemin du fichier HTML,
  - `pathJS` : chemin d’un éventuel script JS.

---

## 📁 FICHIER 2 : `allRoutes.js`

```js
import Route from "./Route.js";

export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html")
];

export const websiteName = "Quai Antique";
```

### ✅ Analyse
- Tableau d’objets `Route` représentant les routes disponibles.
- Le nom du site est exporté pour construire le titre (`document.title`).

---

## 🚦 FICHIER 3 : `Router.js`

Fichier central qui gère le **routage dynamique**, le chargement du contenu et la mise à jour de l’historique.

### 🔹 Route 404

```js
const route404 = new Route("404", "Page introuvable", "/pages/404.html");
```

### 🔹 Fonction `getRouteByUrl()`

```js
const getRouteByUrl = (url) => {
  let currentRoute = null;
  allRoutes.forEach((element) => {
    if (element.url == url) {
      currentRoute = element;
    }
  });
  return currentRoute != null ? currentRoute : route404;
};
```

- Cherche une route correspondante à l’URL actuelle.
- Retourne une page 404 si rien ne correspond.

### 🔹 Fonction `LoadContentPage()`

```js
const LoadContentPage = async () => {
  const path = window.location.pathname;
  const actualRoute = getRouteByUrl(path);
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  document.getElementById("main-page").innerHTML = html;

  if (actualRoute.pathJS != "") {
    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", actualRoute.pathJS);
    document.querySelector("body").appendChild(scriptTag);
  }

  document.title = actualRoute.title + " - " + websiteName;
};
```

### 🔹 Fonction `routeEvent()`

```js
const routeEvent = (event) => {
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  LoadContentPage();
};
```

### 🔹 Initialisation

```js
window.onpopstate = LoadContentPage;
window.route = routeEvent;
LoadContentPage();
```

---

## ✅ POINTS FORTS

- Architecture modulaire claire
- SPA légère, sans dépendances
- Chargement dynamique des contenus HTML et JS
- Compatibilité navigateur correcte
- Utilisation de `History API`

---

## ⚠️ LIMITES ET AMÉLIORATIONS

| Problème | Suggestion |
|----------|------------|
| `fetch()` sans gestion d’erreur | Ajouter `try/catch` |
| Sensibilité exacte à l’URL | Normaliser l’URL |
| `event.target.href` peu fiable | Utiliser `event.currentTarget.href` |
| Pas de préchargement | Ajouter `<link rel="prefetch">` |
| Pas de gestion des `#` ou `?` | Étendre le système de routage |

---

## 🧪 Exemple HTML

```html
<a href="/contact" onclick="route(event)">Contact</a>
```

---

## 🧩 Résumé

Ce système met en place un mini-framework de routage SPA adapté aux sites vitrines, prototypes ou projets pédagogiques.

🔹 Léger et performant  
🔹 Facile à comprendre et à étendre  
🔹 Idéal pour débuter avec les concepts de SPA