# Validation de la bibliothèque publique

Vérifications réalisées le 7 septembre 2026 avec Node.js 24.18.0, React 19, Vite 8.2.2 et Chromium via Playwright 1.63.

## Résultat

Le catalogue, ses 34 composants, les sources de ses 504 variantes et les deux compositions complètes sont utilisables. Aucun blocage technique de compilation ou d’exécution n’a été identifié dans le périmètre vérifié. Le dossier `dist/` est prêt pour un hébergement statique.

| Vérification | Résultat |
| --- | --- |
| Compilation du catalogue et vérification des imports | Réussite ; 198 fichiers contrôlés, y compris la casse des chemins pour Linux. |
| Parcours publics | 7 scénarios réussis : découverte, recherche, historique, code, copie réelle, installation, téléchargements, pages et clavier. |
| Projets téléchargés | **540 / 540 compilés** : 34 premiers exemples, 504 variantes et 2 pages. Chaque archive est extraite dans un dossier neuf ; ses imports locaux et dépendances déclarées sont contrôlés avant compilation. |
| Régressions des primitives | **25 / 25 suites réussies**, couvrant formulaires, sélection, overlays, animations, carrousels, cartes, avatars, notifications et états asynchrones. |
| Accessibilité des galeries | Aucun problème détecté par axe WCAG A/AA sur les 34 galeries à 1440 et 390 px ; aucun débordement de document à 390 et 320 px. |
| Responsive du site | Six parcours vérifiés à 1440, 1024, 768, 390 et 320 px. Contrôles axe à 1440 et 390 px. |
| Deux pages hors du catalogue | Compilation, interactions et contrôles axe réussis à 1440, 768, 390 et 320 px, avec les fichiers des téléchargements. |
| Intégration vierge | Application React/Vite créée hors du dépôt avec ses propres `node_modules`, en suivant le README : compilation, clic, Espace, relief et affichage mobile validés. |
| Dépendances de production | `npm audit --omit=dev` : aucune vulnérabilité signalée lors du contrôle. |

La revue visuelle couvre l’accueil, le code, l’installation, les compositions et leurs formats mobiles. La navigation mobile retient le focus et se ferme avec Échap ; les onglets fonctionnent aux flèches. Les tests vérifient aussi le maintien des modifications entre aperçu et code, la validation des champs masqués par un onglet, l’annulation et la persistance des paramètres.

## Corrections issues des vérifications

- Suppression des débordements à 320 px et amélioration des contrastes des textes secondaires.
- Isolation des styles de Tabs pour permettre leur imbrication sans altérer les onglets enfants.
- Noms accessibles et suivi de l’option active dans Select ; sémantique des badges nommés ; cible de redimensionnement du Textarea agrandie.
- Résolution des imports multiligne et des fichiers partagés dans les téléchargements. Correction d’un import Avatar dont la casse empêchait une reproduction sur Linux.
- Retrait du double aperçu dans les fenêtres de code ; implémentations formatées, fichiers explicites, dépendances et licence incluses.
- Exclusion des artefacts de test de la surveillance et de l’analyse des dépendances de Vite, pour éviter des rechargements du catalogue pendant les vérifications.

## Reproduire les contrôles

```sh
npm ci
npx playwright install chromium
npm test
npm run test:pages
npm run test:integration
```

Pour les tests des primitives et des galeries, démarrer le catalogue dans un autre terminal avec `npm run dev -- --port 5176 --strictPort`, puis lancer :

```sh
npm run test:primitives
npm run test:a11y
```

Les preuves générées sont dans `artifacts/` : `public-test-results.json`, `gallery-coverage.json`, `download-builds.json`, `primitive-regressions.json`, `accessibility.json`, `gallery-accessibility.json`, `standalone-pages.json`, `fresh-integration.json` et captures d’écran. Elles sont exclues de Git.

## Publication et limites

Le site n’a pas été publié : l’hébergement et le domaine restent à configurer. Servir `dist/` en HTTPS pour la copie dans le presse-papiers. Les liens profonds utilisent des paramètres et ne nécessitent pas de réécriture de routes.

La distribution vérifiée est la copie de sources JSX/CSS dans React 19 avec Vite. Aucun paquet npm Duoop, typage TypeScript complet ou validation de rendu serveur n’est annoncé. Les indications Next.js décrivent les adaptations nécessaires ; elles ne remplacent pas un test dans ce framework.

Les créations de studio, préférences, récompenses et requêtes des exemples sont des démonstrations locales. Les applications qui les réutilisent doivent brancher leurs services. Les images et tuiles distantes gardent leurs propres conditions d’utilisation et contraintes de disponibilité. Les tests de récupération d’images utilisent une réponse contrôlée pour vérifier le comportement du composant indépendamment du CDN.

Les contrôles axe et clavier ne constituent pas une certification exhaustive avec tous les lecteurs d’écran et navigateurs.
