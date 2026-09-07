# Duoop–UI

**Des composants React tactiles, avec le code qui va avec.** Duoop s’adresse aux développeurs et aux designers qui veulent créer des interfaces cohérentes, expressives et utilisables au clavier, puis garder la maîtrise de leur implémentation.

Le catalogue présente 34 composants regroupés en sept familles, leurs variantes interactives et deux pages complètes. Chaque fiche propose **Preview**, **Code** et **Installation**. Le code est coloré, copiable et accompagné de tous ses fichiers locaux. **Download project** génère un projet Vite exécutable contenant l’exemple affiché, les composants, les styles et les dépendances.

Duoop se distribue actuellement par copie de sources **JavaScript / JSX + CSS**, sous [licence Apache 2.0](LICENSE). Ce dépôt contient le site de documentation ; il ne publie pas de paquet `duoop-ui` sur npm.

## Utiliser un composant dans votre projet

### 1. Prérequis

- Une application **React 19 + React DOM 19**, avec compilation JSX et imports CSS.
- Pour les commandes Vite ci-dessous : **Node.js 22.12+ ou 24+**, et npm.
- Aucun Tailwind, alias d’import, CLI Duoop ou fournisseur global n’est nécessaire pour un bouton. Les besoins particuliers sont indiqués dans chaque fiche.

Pour créer une application vierge :

```sh
npm create vite@latest my-duoop-app -- --template react
cd my-duoop-app
npm install
```

### 2. Récupérer les fichiers

Dans le catalogue, ouvrez **Raised button → Code**. Copiez les fichiers ci-dessous en conservant les chemins, ou téléchargez le projet complet. Pour un projet téléchargé, décompressez-le, exécutez `npm install` puis `npm run dev` ; les étapes suivantes sont déjà effectuées.

| Fichier à copier | Rôle |
| --- | --- |
| [src/base.css](src/base.css) | Fondation partagée : box sizing, police de repli, texte masqué accessible et focus intérieur. |
| [src/components/Button/Button.jsx](src/components/Button/Button.jsx) | Implémentation de Button et ActionFeedback ; importe son CSS et son utilitaire. |
| [src/components/Button/Button.css](src/components/Button/Button.css) | Apparences, relief, états et mouvement réduit. |
| [src/components/Button/buttonColor.js](src/components/Button/buttonColor.js) | Calcul des palettes personnalisées. |

Le bouton n’a **aucune dépendance supplémentaire à installer** dans une application React. Pour les autres composants, l’onglet Installation indique les paquets nécessaires et la liste complète des fichiers. Les fichiers partagés, comme `useAnchoredOverlay.js`, sont inclus automatiquement.

```text
src/
  main.jsx
  App.jsx
  base.css
  components/
    Button/
      Button.jsx
      Button.css
      buttonColor.js
```

### 3. Importer la fondation une fois

Remplacez `src/main.jsx` par :

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './base.css';

createRoot(document.getElementById('root')).render(<App />);
```

Gardez le `<div id="root"></div>` du modèle Vite dans `index.html`. Supprimez les imports du `index.css` et du `App.css` fournis par le modèle Vite : leurs règles de largeur et de centrage ne font pas partie de Duoop. Ne copiez pas le `src/styles.css` du catalogue dans votre application.

### 4. Premier exemple complet

Remplacez `src/App.jsx` par :

```jsx
import React, { useState } from 'react';
import { Button } from './components/Button/Button.jsx';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <main style={{ padding: 32 }}>
      <Button onClick={() => setCount(value => value + 1)}>
        Pressed {count} times
      </Button>
    </main>
  );
}
```

```sh
npm run dev
npm run build
```

Le bouton doit être visible avec son relief ; chaque appui incrémente le compteur. La touche Tab montre son focus intérieur et Entrée/Espace déclenchent l’action. Le résultat de compilation se trouve dans `dist/`.

Si npm affiche `UNABLE_TO_VERIFY_LEAF_SIGNATURE` sur un poste Windows dont le certificat réseau est installé dans le magasin système, utilisez Node.js 24 et activez ce magasin pour la session PowerShell :

```powershell
$env:NODE_USE_SYSTEM_CA = '1'
npm install
```

C’est le réglage utilisé pour le test d’intégration sur ce poste. Il conserve la vérification TLS ; aucun réglage npm global n’est modifié.

### Police, styles et personnalisation

Les composants importent leurs propres styles. `base.css` s’importe une seule fois ; il ne contient pas la mise en page du catalogue. Les composants utilisent des classes préfixées et exposent des props de taille, apparence et état, documentées dans leurs fiches.

Le site auto-héberge **DM Sans**. Pour la même police dans votre projet, vous pouvez installer `@fontsource-variable/dm-sans`, l’importer dans votre point d’entrée, puis déclarer `:root { --duoop-font: 'DM Sans Variable', system-ui, sans-serif; }` dans votre CSS. Sans cette étape, la fondation emploie une police système. La police n’est pas nécessaire au fonctionnement.

### Dépendances et cas particuliers

| Besoin | Intégration |
| --- | --- |
| Mouvement GSAP | Lorsque la fiche l’indique, `npm install gsap`. Les contrôles utilisant GSAP respectent `prefers-reduced-motion`. Text Loop dispose d’une pause explicite dans son exemple minimal. |
| Map | `npm install leaflet`. Conserver les CSS Leaflet et l’attribution. Les tuiles OSM/CARTO requièrent le réseau ; vérifier leurs conditions et leur capacité ou configurer votre propre fournisseur. |
| Toast | Placer les utilisateurs de `useToast()` sous `ToastProvider` et rendre `ToastViewport` une fois. Les fichiers partagés nécessaires sont fournis. |
| Dialog, Select, Menu | Conserver les fichiers de positionnement et CSS complémentaires listés dans la fiche. Les overlays peuvent être rendus dans un portail. |
| Exemples photographiques | Les démonstrations utilisent des images distantes. Fournir vos propres images adaptées à la production et vérifier leurs droits. |
| État asynchrone, OTP, récompenses | Les démos illustrent des comportements locaux. L’authentification, la validation serveur, les quotas, les envois et la persistance réelle restent à connecter dans votre application. |
| Next.js | Placer une frontière `'use client';` au-dessus des composants utilisant des hooks ; importer la fondation dans le layout. Map exige un chargement côté client, sans SSR. Cette intégration n’est pas une distribution Next.js dédiée. |
| TypeScript | Les sources sont en JSX. Autoriser les fichiers JavaScript (`allowJs: true`) ou les typer dans votre projet. Aucune déclaration TypeScript complète n’est annoncée. |

## Reproduire les pages complètes

La section **Page examples** propose deux compositions, chacune avec aperçu, code, installation et téléchargement :

- **The studio landing page** : [LandingPage.jsx](src/examples/LandingPage.jsx). Navigation par ancres, checklist, onglets de projet, choix mensuel/annuel, FAQ et formulaire de création locale d’un studio. Les prix et la marque Forma appartiennent à la démonstration.
- **A place for preferences** : [SettingsPage.jsx](src/examples/SettingsPage.jsx). Profil, notifications, préférences, validation native, sauvegarde locale, annulation et protection des changements non enregistrés. Les données sont stockées sous la clé isolée `duoop-example-settings-v1`. Utiliser des données de test puis remplacer `readSettings()` et `save()` par votre API authentifiée.

Le téléchargement remappe la page vers `src/App.jsx`, les styles [pages.css](src/examples/pages.css) vers `src/example.css`, puis inclut la fondation et toutes les dépendances locales. Décompressez, lancez `npm install`, puis `npm run dev`. Pour une application existante, copiez les mêmes fichiers et importez `base.css` une fois. Aucun style de navigation du catalogue n’est nécessaire.

## Développer le catalogue

Cette section concerne le **site de documentation**, pas l’installation d’un composant dans un autre projet. Pour développer et tester le catalogue, utilisez **Node.js 22.18+ dans la branche 22, ou 24.11+** : ses outils de validation demandent une version plus récente que les projets de composants téléchargés.

```sh
git clone https://github.com/gus-rlin/Duoop-UI.git
cd Duoop-UI
npm ci
npm run dev
```

Le serveur affiche son URL locale. Pour imposer un port : `npm run dev -- --port 5176 --strictPort`.

```sh
npm run build
npm run preview
```

Le catalogue se déploie comme un site statique à partir de `dist/`. Les URL utilisent des paramètres (`?component=builtin-menu&tab=code`, `?page=examples&example=settings`) : pas de réécriture serveur nécessaire pour les liens profonds. Servir en **HTTPS** pour activer la copie via le presse-papiers, à l’exception de localhost. Prévoir les sources distantes des démonstrations dans une éventuelle politique CSP. Le domaine public et le déploiement restent au choix du propriétaire du dépôt.

Les anciennes fiches personnelles dans `duoop-ui.components.v1` ne sont plus affichées dans le catalogue public. La refonte ne supprime ni ne réécrit ces données.

## Vérifications reproductibles

```sh
npm ci
npx playwright install chromium
npm test
```

Les tests publics compilent le catalogue, démarrent un aperçu de production sur le port 4176 et couvrent la découverte, la recherche, l’historique, la copie réelle, les sources téléchargeables des 34 composants et des 504 variantes, les deux pages, le responsive et des contrôles automatisés d’accessibilité avec axe. Chaque archive est ensuite extraite dans un dossier neuf : les imports sont vérifiés contre les fichiers réellement présents et chaque projet est compilé. Les captures, téléchargements et rapports se trouvent dans `artifacts/` (ignoré par Git).

Les suites historiques `tests/*.browser.mjs` restent disponibles pour les comportements détaillés des primitives. Elles utilisent un serveur Vite sur le port 5176 ; définir `TEST_URL` pour remplacer cette URL. `npm run test:primitives` lance les 25 suites. Exemple en PowerShell :

```powershell
$env:TEST_URL = 'http://127.0.0.1:5176'
node tests/overlays.browser.mjs
node tests/selection.browser.mjs
```

Après avoir démarré le catalogue sur 5176, `npm run test:a11y` vérifie les 34 galeries sur ordinateur et mobile. Après `npm test`, `npm run test:pages` compile et teste les deux pages téléchargées hors de l’interface du catalogue. `npm run test:integration` crée une application Vite indépendante dans un dossier voisin et suit le premier exemple du README avec ses propres dépendances (accès npm requis).

Un résultat axe sans violation ne constitue pas une certification d’accessibilité. Les vérifications clavier, visuelles et de mouvement réduit complètent les tests automatisés. Le bilan de livraison consigne le périmètre réellement vérifié.

Consultez [VALIDATION.md](VALIDATION.md) pour les résultats de la livraison et les limites du périmètre testé.

## Repères pour contribuer

- [design.md](design.md) : palette, typographie, contours, focus et mouvement.
- [src/catalog/catalog.js](src/catalog/catalog.js) : métadonnées publiques, catégories et correspondance des composants.
- [src/catalog/recipes.js](src/catalog/recipes.js) : premiers exemples exécutables et particularités d’intégration.
- [src/catalog/source-bundle.js](src/catalog/source-bundle.js) : collecte des imports locaux et fichiers complets.
- [src/components/Button/Documentation.jsx](src/components/Button/Documentation.jsx) : coloration syntaxique, copie et navigation entre fichiers.
- [src/components](src/components) : implémentations et démonstrations existantes, chargées à la demande.

Pour ajouter un composant, fournir une primitive, ses styles, une galerie, une entrée publique, un exemple minimal et une preview cohérente. Vérifier ses imports depuis les fichiers téléchargés avant de l’ajouter à la collection.
