// Déclaration des routes valides de l'application
import Route from "./Route.js";

// Liste des routes accessibles
export const allRoutes = [
  new Route("/", "Accueil", "front/pages/home.html"),
  new Route("/contact", "Contact", "front/pages/contact.html")
];

// Nom du site à afficher dans le titre
export const websiteName = "SPA Démo";
