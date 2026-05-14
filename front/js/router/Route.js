// Cette classe represente "la fiche d'identite" d'une route.
//
// Au lieu de disperser les informations un peu partout dans le code,
// on cree un objet unique qui contient tout ce dont le routeur a besoin
// pour afficher une page.
//
// Chaque route possede donc :
// - une URL logique, par exemple "/" ou "/contact" ;
// - un titre pour l'onglet du navigateur ;
// - un fichier HTML a charger dans <main> ;
// - eventuellement un fichier JavaScript propre a cette page.
//
// Cette approche rend le projet plus simple a faire evoluer :
// pour ajouter une route, on cree un nouvel objet Route, puis on l'ajoute
// dans la liste allRoutes.
export default class Route {
  constructor(url, title, pathHtml, pathJS = "") {
    this.url = url;           // Chemin logique manipule par le routeur.
    this.title = title;       // Texte affiche dans l'onglet du navigateur.
    this.pathHtml = pathHtml; // Fragment HTML recupere avec fetch().
    this.pathJS = pathJS;     // Script optionnel lance apres l'injection du HTML.
  }
}
