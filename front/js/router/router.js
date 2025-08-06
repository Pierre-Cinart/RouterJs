// Import des routes et de la classe Route
import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Route 404 si aucune correspondance
const route404 = new Route("404", "Page introuvable", "front/pages/404.html");

// Trouve la bonne route selon l’URL
const getRouteByUrl = (url) => {
  let currentRoute = null;
  allRoutes.forEach((route) => {
    if (route.url === url) {
      currentRoute = route;
    }
  });
  return currentRoute ?? route404;
};

// Charge dynamiquement le HTML de la page
const LoadContentPage = async () => {
  const path = window.location.pathname;
  const actualRoute = getRouteByUrl(path);

  try {
    const html = await fetch(actualRoute.pathHtml).then(res => res.text());
    document.getElementById("main-page").innerHTML = html;

    // Si un script JS est défini, l’injecter
    if (actualRoute.pathJS !== "") {
      const scriptTag = document.createElement("script");
      scriptTag.src = actualRoute.pathJS;
      document.body.appendChild(scriptTag);
    }

    // Mettre à jour le titre de la page
    document.title = `${actualRoute.title} - ${websiteName}`;
  } catch (err) {
    console.error("Erreur de chargement :", err);
    document.getElementById("main-page").innerHTML = "<p style='color:red;'>Erreur de chargement.</p>";
  }
};

// Intercepte les clics sur les liens SPA
const routeEvent = (event) => {
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  LoadContentPage();
};

window.onpopstate = LoadContentPage;
window.route = routeEvent;
LoadContentPage();
