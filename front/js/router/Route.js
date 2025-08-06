// Classe Route : représente une route unique dans l'application
export default class Route {
  constructor(url, title, pathHtml, pathJS = "") {
    this.url = url;           // ex: "/menu"
    this.title = title;       // Titre affiché dans l'onglet
    this.pathHtml = pathHtml; // Fichier HTML à charger dynamiquement
    this.pathJS = pathJS;     // Fichier JS optionnel pour cette page
  }
}
