// router.js est le fichier central du projet.
//
// C'est lui qui transforme une simple page HTML en mini application mono-page.
// Son role est de faire le lien entre :
// - l'URL visible dans le navigateur ;
// - les routes declarees dans allRoutes.js ;
// - les fragments HTML a injecter dans la page ;
// - le titre de l'onglet.
//
// Ici, on utilise un hash router.
// Exemple d'URL :
// - http://127.0.0.1:5500/RouterJs/#/
// - http://127.0.0.1:5500/RouterJs/#/contact
//
// L'avantage est important : le serveur ne recoit jamais "/contact".
// Il sert seulement index.html, puis le JavaScript gere la suite.
import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Si aucune route declaree ne correspond a l'URL lue dans le hash,
// cette route de secours sera utilisee pour afficher une page 404 cote client.
const route404 = new Route("/404", "Page introuvable", "front/pages/404.html");

// Cette fonction "normalise" les chemins pour eviter les ambigu ites.
//
// Sans cela, "/contact" et "/contact/" seraient consideres comme deux routes
// differentes alors qu'on veut les traiter comme la meme page.
//
// Regle choisie :
// - "/" reste "/"
// - toute autre route perd son slash final si elle en a un
const normalizeUrl = (url) => {
  if (!url || url === "/") {
    return "/";
  }

  return url.endsWith("/") ? url.slice(0, -1) : url;
};

// Le routeur charge des fragments HTML et parfois des scripts de page.
// Cette fonction convertit un chemin relatif interne au projet
// comme "front/pages/home.html" en URL exploitable par fetch().
//
// On se base sur l'URL de la page actuelle sans la partie hash.
// Exemple :
// - URL courante : http://127.0.0.1:5500/RouterJs/#/contact
// - base retenue : http://127.0.0.1:5500/RouterJs/
// - resultat pour home.html :
//   http://127.0.0.1:5500/RouterJs/front/pages/home.html
const buildAssetUrl = (assetPath) => {
  return new URL(assetPath, window.location.href.split("#")[0]).toString();
};

// Cette fonction lit la route demandee dans le hash de l'URL.
//
// Exemples :
// - "#/contact" devient "/contact"
// - "#/menu" devient "/menu"
// - absence de hash devient "/"
//
// Ensuite, on normalise le resultat pour garder une forme unique.
const getCurrentHashRoute = () => {
  const hashValue = window.location.hash.replace(/^#/, "");
  return normalizeUrl(hashValue || "/");
};

// On cherche ici l'objet Route qui correspond a l'URL courante.
//
// Si on trouve une correspondance dans allRoutes, on renvoie cette route.
// Sinon, on renvoie route404 afin que l'application affiche une page lisible
// au lieu de planter ou de rester vide.
const getRouteByUrl = (url) => {
  const normalizedUrl = normalizeUrl(url);
  return allRoutes.find((route) => route.url === normalizedUrl) ?? route404;
};

// Certaines vues pourraient, plus tard, embarquer leur propre fichier JavaScript.
// Si on navigue d'une page a une autre, il faut eviter d'empiler ces scripts
// sinon un meme comportement pourrait etre execute plusieurs fois.
//
// On supprime donc tous les scripts que le routeur avait lui-meme injectes
// lors d'une navigation precedente.
const removePreviousPageScripts = () => {
  document.querySelectorAll("[data-router-page-script]").forEach((scriptTag) => {
    scriptTag.remove();
  });
};

// C'est la fonction principale du routeur.
//
// Elle suit toujours la meme sequence :
// 1. lire la route courante dans le hash ;
// 2. trouver la route associee ;
// 3. recuperer le fragment HTML correspondant ;
// 4. injecter ce HTML dans <main> ;
// 5. charger eventuellement un script de page ;
// 6. mettre a jour le titre de l'onglet.
const loadContentPage = async () => {
  const path = getCurrentHashRoute();
  const currentRoute = getRouteByUrl(path);
  const mainPage = document.getElementById("main-page");

  try {
    // On recupere le contenu HTML de la vue demandee.
    const response = await fetch(buildAssetUrl(currentRoute.pathHtml));

    // Si le fichier n'existe pas ou n'est pas accessible, on leve une erreur.
    if (!response.ok) {
      throw new Error(`Impossible de charger ${currentRoute.pathHtml}`);
    }

    // Le texte HTML est ensuite injecte directement dans la zone principale.
    const html = await response.text();
    mainPage.innerHTML = html;

    // Avant d'eventuellement injecter un nouveau script de page,
    // on supprime ceux de la page precedente.
    removePreviousPageScripts();

    // Certaines vues peuvent avoir besoin de logique JavaScript specifique.
    // Si pathJS est renseigne, on ajoute un <script> apres avoir insere le HTML,
    // de sorte que le DOM de la vue existe deja au moment de l'execution.
    if (currentRoute.pathJS !== "") {
      const scriptTag = document.createElement("script");
      scriptTag.src = buildAssetUrl(currentRoute.pathJS);
      scriptTag.dataset.routerPageScript = "true";
      document.body.appendChild(scriptTag);
    }

    // On synchronise enfin le titre de l'onglet avec la page affichée.
    // Cela rend la navigation plus propre pour l'utilisateur.
    document.title = `${currentRoute.title} - ${websiteName}`;
  } catch (err) {
    console.error("Erreur de chargement :", err);
    mainPage.innerHTML = "<p style='color:red;'>Erreur de chargement de la page.</p>";
  }
};

// Cette fonction intercepte les clics sur les liens du menu.
//
// event.preventDefault() bloque le comportement HTML par defaut.
// Ensuite, on modifie uniquement window.location.hash.
//
// Changer le hash :
// - modifie l'URL visible ;
// - ne recharge pas toute la page ;
// - declenche l'evenement "hashchange", que l'on ecoute plus bas.
const routeEvent = (event) => {
  event.preventDefault();
  window.location.hash = event.currentTarget.getAttribute("href").replace(/^#/, "");
};

// A chaque changement de hash, on recharge la bonne vue.
// C'est ce mecanisme qui permet :
// - la navigation interne ;
// - le bouton precedent/suivant du navigateur ;
// - le fonctionnement apres modification manuelle du hash dans la barre d'adresse.
window.addEventListener("hashchange", loadContentPage);

// On attache la fonction routeEvent a window pour qu'elle soit accessible
// directement depuis les attributs onclick definis dans index.html.
window.route = routeEvent;

// Si l'application est ouverte sans hash, on force la route d'accueil.
// Cela donne une URL explicite et evite d'avoir un etat special "sans route".
if (!window.location.hash) {
  window.location.hash = "/";
}

// Au premier chargement, on affiche tout de suite la vue correspondant au hash courant.
// Exemple :
// - ouverture de #/contact -> affichage de la page contact ;
// - ouverture de #/menu    -> affichage de la page menu ;
// - ouverture de #/oups    -> affichage de la page 404.
loadContentPage();
