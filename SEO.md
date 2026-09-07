# Configuration SEO de Duoop-UI

## Domaine et déploiement

Le domaine de production retenu est https://duoop-ui.pages.dev/.
Le contrôle HTTP du 8 septembre 2026 a trouvé le site public sur ce domaine sans
en-tête `X-Robots-Tag: noindex`. L'adresse de déploiement
`8a3f3afc.duoop-ui.pages.dev` porte cet en-tête et reste un aperçu à ne pas indexer.

Les fichiers `public/robots.txt`, `public/llms.txt` et `public/sitemap.xml` sont
copiés à la racine de `dist/` par `npm run build`. Déployer le contenu de `dist/`
sur la production Cloudflare Pages. Les fichiers statiques prennent alors la
place du repli HTML actuellement servi à ces URL. Ne pas ajouter de règle qui
réécrit ces fichiers vers `index.html`.

## Politique retenue

- Crawl autorisé pour tous les bots, y compris Googlebot et Bingbot. Aucune zone
  privée serveur, panier ou administration n'a été identifiée dans ce catalogue.
  Les CSS, JavaScript, images, catégories et paramètres de navigation restent accessibles.
- Les véritables résultats de recherche interne (`q` dans le catalogue) et les
  composants inexistants reçoivent `noindex, follow` dans l'application. Ils restent
  crawlables pour que les moteurs puissent lire la directive.
- Les composants, catégories, installation et exemples gardent des canoniques
  distinctes. Les paramètres d'onglet et de suivi sont retirés de la canonique.
  Une recherche ou une erreur n'annonce pas de canonique contradictoire.
- Le sitemap contient 46 URL : accueil, catalogue, installation, index des
  exemples, exemple de landing page, 7 catégories et 34 composants. Pas de recherche,
  d'onglet alternatif, de date de modification inventée ou de domaine d'aperçu.
- `llms.txt` est un index Markdown facultatif pour les agents IA. Aucun facteur de
  classement Google ni garantie d'indexation n'est associé à ce fichier.
- Pas de `llms-full.txt` : l'index concis et les liens vers les documents suffisent
  au périmètre actuel. Pas de `sitemap.txt`, qui ferait doublon avec le XML.
- Pas de `ads.txt`/`app-ads.txt` sans activité publicitaire correspondante. Pas de
  `security.txt` sans procédure de signalement et contact définis : ce fichier
  relève de la sécurité, pas du référencement. Pas de fichier IndexNow tant
  qu'une intégration avec une vraie clé n'est pas mise en place.

## Vérifications avant publication

1. Compiler avec `npm run build` puis lancer
   `npx playwright test tests/seo.spec.mjs`.
2. Après déploiement, vérifier les trois URL publiques : HTTP 200, contenu réel,
   `text/plain` pour les TXT et un type XML pour le sitemap. Un HTTP 200 avec le
   HTML de l'application ne constitue pas un sitemap valide.
3. Vérifier l'absence de `noindex` HTTP sur les pages stratégiques de production,
   ainsi que l'absence de challenge CDN pour les robots souhaités. Conserver le
   `noindex` des aperçus Cloudflare.
4. Inspecter une fiche, une catégorie et une recherche dans Google Search Console
   et Bing Webmaster Tools. Contrôler le contenu rendu, les ressources accessibles,
   la canonique et la directive `noindex`, puis soumettre le sitemap XML.
5. Actualiser le sitemap et `llms.txt` lorsque le catalogue change. Pour un nouveau
   domaine, modifier aussi `siteOrigin` dans `src/catalog/seo.js` et prévoir les
   redirections de migration avant publication.

Le site reste une application rendue côté client. Ses canoniques et directives
de page nécessitent JavaScript ; les fichiers TXT/XML sont disponibles sans
JavaScript. Un rendu serveur ou un prérendu des pages stratégiques est un chantier
distinct si l'on veut servir leur contenu HTML aux robots sans moteur JavaScript.
Les contrôles locaux ne prouvent pas l'indexation dans un moteur.

## Résultats locaux du 8 septembre 2026

- `npm run build -- --logLevel warn` : réussi.
- Les quatre tests de `tests/seo.spec.mjs` : réussis. XML analysé sans erreur,
  couverture des 46 URL, types MIME, liens de `llms.txt`, canoniques et navigation
  depuis/vers une recherche vérifiés.
- Un test général supplémentaire, `discover, search, deep-link, use history and
  copy real source`, échoue à sa ligne 44 : il attend l'interrupteur
  `A little more focus`, absent de l'accueil actuel. Ce résultat ne valide donc
  pas l'intégralité de la suite fonctionnelle du catalogue.
- Archive livrable : `artifacts/duoop-ui-seo-production.zip`, contenant le build
  complet avec les fichiers publics et les changements de métadonnées.
- Le propriétaire indique avoir déployé l'archive. Le contrôle HTTP public
  effectué ensuite sur `https://duoop-ui.pages.dev/` renvoie toutefois encore
  le HTML du site pour `/robots.txt`, `/llms.txt` et `/sitemap.xml` (HTTP 200,
  `text/html`). La présence effective des trois fichiers sur le domaine de
  production reste donc à confirmer, ainsi que les inspections dans les moteurs.

Références :
- https://www.rfc-editor.org/rfc/rfc9309.html
- https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/appearance/ai-features
- https://www.bing.com/webmasters/help/how-to-create-a-robots-txt-file-cb7c31ec
- https://llmstxt.org/
- https://developers.cloudflare.com/pages/configuration/preview-deployments/
