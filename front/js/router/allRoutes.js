// allRoutes.js joue le role de "table de correspondance" du routeur.
//
// C'est ici que l'on declare officiellement quelles routes existent dans l'application.
// Le routeur ne devine rien tout seul : il compare la route lue dans l'URL
// avec les objets definis dans ce tableau.
//
// Exemple :
// - si le hash vaut "#/contact", le routeur cherchera une route dont url === "/contact"
// - s'il la trouve, il charge le fichier HTML associe ;
// - sinon, il bascule sur la vue 404.
//
// Ajouter une page revient generalement a faire 3 choses :
// 1. creer un nouveau fragment HTML dans front/pages/ ;
// 2. creer une nouvelle instance de Route ci-dessous ;
// 3. ajouter un lien dans index.html si on veut rendre la page accessible dans le menu.
import Route from "./Route.js";

// Ce tableau est la source de verite des routes reconnues par la SPA.
export const allRoutes = [
  new Route("/", "Accueil", "front/pages/home.html"),
  new Route("/menu", "Menu", "front/pages/menu.html"),
  new Route("/contact", "Contact", "front/pages/contact.html")
];

// Ce nom est concatene au titre de chaque page pour obtenir un onglet plus lisible.
// Exemple final : "Contact - SPA Demo".
export const websiteName = "SPA Demo";
