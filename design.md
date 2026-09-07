# Duoop-UI — Direction artistique et règles de finition

Ce document sert de référence pour créer, modifier et vérifier les composants du catalogue. Il rassemble la direction visuelle existante et les exigences exprimées dans les retours sur Checkbox, Textarea, Input Group, Card, Badge et Tabs.

Les valeurs indiquées sont des repères issus du système actuel ou des cibles de conception explicitement présentées comme telles. Ce document décrit le résultat attendu ; il ne constitue pas un audit attestant que chaque exemple existant respecte déjà toutes les règles.

## 1. L’intention

Une interface sobre, précise et tactile. Des surfaces claires, une typographie nette, des contours assumés et des ombres courtes donnent aux contrôles une présence physique. La créativité vient de la composition, des proportions et du mouvement.

**L’animation est reine.** Elle fait partie du design dès le départ : elle explique l’action, accompagne le changement d’état et confirme le résultat. Un composant qui fonctionne mais réagit pauvrement n’est pas terminé.

- Préserver la famille visuelle des composants déjà présents.
- Soigner autant le repos que le survol, l’appui, le focus et les états transitoires.
- Donner de l’espace au contenu plutôt que le compresser pour conserver une grille.
- Traiter les défauts récurrents dans les primitives et les styles partagés.
- Réutiliser les composants et animations existants avant d’en inventer d’autres.
- Ne jamais remplacer le langage visuel du projet par des avatars ronds, pastilles, cases ou pictogrammes génériques. Partir des boutons, icônes, contours et ombres déjà établis.

## 2. Palette et matériaux

### Base actuelle

| Rôle | Repère |
| --- | --- |
| Fond principal | `#ffffff` |
| Fond de navigation | `#f7f8fa` |
| Fond d’aperçu | `#fafbfc` |
| Texte de l’application | `#252a34` |
| Navigation et actions du catalogue | `#303b51` |
| Texte et faces des contrôles tactiles | `#373434` |
| Bordure neutre des contrôles | `#777474` |
| Ombre tactile sombre | `#1d1b1b` |
| Surface neutre sélectionnée | `#f0eeee` |
| Séparateurs du catalogue | `#e7e9ed` |
| Texte secondaire du catalogue | `#717781` |
| Texte secondaire des contrôles | `#686565` |

Le bleu grisé structure le catalogue ; le gris chaud porte les composants. Éviter d’introduire une couleur d’accent différente pour chaque variante.

### États sémantiques

Un état possède une **palette complète**, pas seulement une bordure colorée.

| État | Encre / face forte | Fond léger | Appui / ombre |
| --- | --- | --- | --- |
| Erreur, thème clair | `#a51d2d` | `#fff2f3` à `#fff5f5` | Rouge cohérent ; `#761725` pour une action pleine |
| Succès, thème clair | `#356247` | `#edf5ef` | `#234631` |
| Erreur, surface sombre | `#ff9dab` | `#3b282d` | `#ad6070` selon le relief |

Pour une checkbox invalide cochée, la face, le bord et l’ombre appartiennent à la famille rouge ; la coche reste contrastée. Pour une checkbox invalide vide, conserver un fond clair et une bordure/ombre rouges. Le libellé, les indications et le message doivent soutenir ce même état.

**À proscrire :** une case noire avec un bord rouge rapporté, une ombre grise sous une case rouge, ou des couleurs d’erreur contradictoires entre le contrôle et son message. Les exemples « Accept terms » et « Publish externally » sont les cas de régression à surveiller.

La couleur accompagne une forme, une icône ou un texte explicite : elle ne porte jamais seule le sens.

### Thème sombre

Repères des surfaces Checkbox : fond `#252323`, texte `#f3eeee`, secondaire `#bdb5b5`, bord `#b0a6a6`, surface sélectionnée `#383333`.

Adapter toute la palette : fond, texte, bord, ombre, erreur et succès. Ne pas simplement inverser les couleurs ou réutiliser un fond pastel clair dans un panneau sombre. Utiliser des variables sémantiques héritées par les composants imbriqués.

## 3. Contours, ombres et focus

Trois notions à distinguer :

1. **Contour normal** : définit la forme du contrôle et reste présent.
2. **Ombre tactile** : donne de la profondeur et accompagne l’appui.
3. **Pourtour supplémentaire** : anneau extérieur ajouté au clic ou au focus ; il est indésirable dans cette DA.

**Ne jamais supprimer le contour normal ou l’ombre pour faire disparaître l’anneau supplémentaire.**

Repères : bordures de contrôle de **2 px**, rayons de **10 px** pour boutons/champs/cartes de sélection, **5 px** pour la petite case. Les cartes du catalogue utilisent plutôt un bord de **1 px** et des rayons de **10–12 px**. Les ombres tactiles sont courtes, nettes et sans flou : environ **2 px** pour une case, **3–5 px** pour un bouton.

Le focus clavier reste clairement perceptible, sans anneau extérieur :

- Checkbox : variation du contour existant, actuellement en pointillés au focus clavier.
- Bouton : repère intérieur contrasté, sans modifier son relief.
- Champ composé : un traitement commun au conteneur ; éviter de cumuler celui du parent et celui de l’input.
- Lien ou petite action : repère intérieur ou soulignement renforcé.

Employer `:focus-visible` pour le clavier. Vérifier aussi le focus programmatique après une erreur. Ne pas appliquer un `outline: none` global sans alternative visible.

Lors d’un défaut, inspecter les règles globales, `:focus`, `:focus-visible`, `:focus-within`, les styles natifs et les pseudo-éléments. Corriger la cause commune ; éviter les couches de correctifs et les `!important` successifs.

## 4. Typographie et tailles

**Police : DM Sans**, avec repli sans-serif. Le code utilise une police monospace. Conserver la langue et les conventions du catalogue existant ; ne pas mélanger les langues au hasard entre variantes.

| Usage | Taille de référence | Graisse / rythme |
| --- | --- | --- |
| Titre de composant | 34 px desktop, 29 px mobile | 600, approche légèrement resserrée |
| Titre de page | 29 px desktop, 25 px mobile | 600 |
| Titre de section | 19–21 px | 550–600 |
| Sous-section | 15 px | 550–600 |
| Libellé / titre de carte d’exemple | 13–14 px | 500–600 |
| Texte d’aide / description | 12–13 px | 400–450, interligne 1,6–1,8 |
| Métadonnée / compteur / badge | 10–11 px | Secondaire, sans information critique isolée |
| Code | 12 px | Monospace, interligne proche de 1,85 |

Les micro-libellés de 9–10 px restent réservés aux repères éditoriaux non essentiels. Ne jamais réduire une instruction ou une erreur pour la faire rentrer.

Tailles actuelles des champs : **12 / 14 / 16 px** pour petit / standard / grand, avec des hauteurs proches de **36 / 44 / 52 px**. Pour les checkboxes : case **16 / 20 / 24 px**, texte **12 / 13 / 15 px**. Le dessin de la case n’est pas la taille de la zone cliquable.

Cible ergonomique : **44 px** pour les zones tactiles importantes. Pour les saisies mobiles, privilégier **16 px** lorsque nécessaire pour éviter un zoom automatique gênant ; adapter le contrôle plutôt que désactiver le zoom du navigateur.

## 5. Espacement et composition

Échelle de travail : **4, 8, 12, 16, 20, 24, 28, 32, 40, 48 px**. Une valeur optique intermédiaire reste possible si elle résout un alignement réel.

| Relation | Espacement cible |
| --- | --- |
| Icône et texte / case et libellé | 8–12 px |
| Libellé et aide associée | 5–10 px |
| Actions d’une même ligne | 10–12 px |
| Options simples d’un groupe | 8–14 px, en tenant compte de leur padding |
| Blocs d’un formulaire | 20–24 px |
| Padding d’une carte de sélection | 16–22 px |
| Padding d’un panneau de préférences | 28 px desktop, 20 px mobile |
| Sections internes d’un panneau | 24–28 px |
| Gouttières de galerie | 18–22 px |
| Grandes sections de documentation | 40–52 px |

La proximité exprime la relation. Le titre et sa description restent ensemble ; le groupe suivant dispose d’une vraie séparation. Ne pas empiler des contrôles contre une carte sélectionnée.

### Theme & Direction

Composer un véritable panneau : repère discret, titre, courte introduction, option principale, préférences secondaires, note finale si utile. Différencier les niveaux par l’espace et la typographie, pas par une accumulation de cadres.

Présenter les thèmes sur deux colonnes lorsque la largeur le permet, puis sur une colonne mobile. En RTL, utiliser les propriétés logiques et vérifier l’ordre des icônes, de la case, des badges et des textes. L’alignement doit rester intentionnel dans les deux directions.

### With Illustration

L’illustration doit représenter le contenu sélectionné : document, aperçu ou objet identifiable. Lui réserver une place, une échelle et une relation claire avec le libellé.

La composition actuelle du document utilise des feuilles superposées, un contrôle dans l’angle et un bloc titre/métadonnées en dessous. Cette illustration SVG reste **strictement statique** : aucun déplacement des feuilles au survol, aucune transition interne et aucun tracé animé de la coche. Les animations éventuelles appartiennent à la carte ou à son changement d’état, jamais aux éléments internes de ce SVG.

Éviter la grosse bande grise servant de support à une icône minuscule. Ne pas ajouter une illustration générique pour remplir un vide. Préserver la lisibilité et une surface entièrement cliquable.

## 6. Mouvement — une exigence de premier ordre

Niveau attendu : **présence forte dans les interactions, faible agitation au repos**. Chaque mouvement exprime une cause et un résultat. Pas de rebonds continus ni d’animations décoratives concurrentes.

| Interaction | Durée cible | Comportement |
| --- | --- | --- |
| Survol / couleur / bord | 120–180 ms | Réponse immédiate, fluide |
| Appui | 80–120 ms | Descente courte ; l’ombre se réduit |
| Retour tactile | 180–240 ms | Retour légèrement souple, sans saut |
| Coche / indéterminé | 140–180 ms | Tracé ou transition nette dans une géométrie stable |
| Validation / erreur | 220–360 ms | Apparition, tracé, stabilisation |
| Illustration réactive, lorsqu’elle est autorisée | 240–320 ms | Déplacement de quelques pixels ou rotation discrète ; exclure le SVG statique des Card |
| Ouverture de dialogue | 180–260 ms | Opacité et déplacement léger |

Les timings doivent former une famille. Utiliser `ease-out` pour les révélations, une courbe proche de `cubic-bezier(.2,.8,.2,1)` pour les surfaces et un retour plus souple pour les boutons tactiles.

### Feedback d’une action importante

Pour enregistrer, valider, envoyer, copier ou terminer une recherche :

1. Donner une réponse d’appui immédiate.
2. Si une opération est réellement en cours, afficher un chargement local et compréhensible.
3. À la réussite, animer la confirmation : coche tracée, évolution du bouton ou de l’icône et message contextualisé.
4. À l’échec, identifier le champ ou l’action concernée, afficher un message utile et permettre la correction.
5. Après modification ou réinitialisation, retirer le succès devenu obsolète et rétablir l’action.

**Un simple remplacement par « Terms accepted » ne suffit pas.** Réutiliser `Button` avec son `status` et `ActionFeedback` pour garder un langage commun. Ne pas doubler les messages inutilement : le bouton confirme, le texte peut expliquer la conséquence.

Ne jamais afficher un succès avant que l’action ait réussi. Ne pas introduire de délai artificiel pour montrer un spinner. Une démo asynchrone simulée doit être identifiée comme telle. Une nouvelle exécution autorisée doit produire à nouveau un feedback perceptible.

### Robustesse

- Animer surtout `transform` et `opacity` ; transitions courtes et ciblées pour les couleurs, bords et ombres. Éviter `transition: all`.
- Réserver l’espace des libellés et statuts : pas de bouton qui change brusquement de largeur.
- Supporter les clics rapides, l’interruption, la fermeture et le démontage du composant.
- Nettoyer les timers et animations ; ne pas laisser un état de chargement bloqué.
- Respecter `prefers-reduced-motion` : conserver l’état, l’icône et le message, supprimer les déplacements et tracés animés gênants.

## 7. Points de vigilance par famille

### Checkbox et groupes

- Aucun anneau supplémentaire au clic, y compris en carte, en erreur, en sombre et en RTL.
- Conserver les états vide, coché et indéterminé, ainsi que leurs versions désactivées.
- Le parent reflète ses enfants ; une sélection partielle ne signifie pas qu’il faut faire défiler trois états au clic.
- Préserver les options désactivées lors d’une sélection collective.
- Libellé cliquable, nom accessible pour une case seule, focus visible et messages liés au contrôle.
- Une carte sélectionnée reste lisible sans empiler bordure, halo, double ombre et fond trop marqué.

### Textarea, scroll et Vertical Resize

- Une seule enveloppe visuelle : pas de double bordure ou de fond intérieur parasite.
- Le texte conserve ses marges, y compris près du bas du champ et de la poignée.
- Distinguer le défilement du redimensionnement : ce sont deux fonctions différentes.
- Scrollbars fines, neutres et arrondies ; repère actuel : **7 px**, pouce `#aaa5a5`, survol `#777171`, piste discrète.
- Aucun gros élément natif de défilement ou grip diagonal qui casse la DA. Une poignée personnalisée doit rester identifiable, utilisable au clavier et suffisamment facile à viser.
- Conserver une solution native utilisable lorsque la personnalisation n’est pas supportée.
- Tester hauteur fixe, croissance automatique, débordement, redimensionnement et largeur mobile.

### Input Group et actions intégrées

- Le groupe est une seule surface : input, préfixe, suffixe et bouton doivent sembler conçus ensemble.
- Éviter les barres de séparation sans rôle et le texte brut ajouté sans hiérarchie.
- Une icône d’envoi doit être lisible : viser **20–24 px** dans une zone d’action confortable, sans anneau rapporté autour de la flèche.
- « Text Button » doit être une action intégrée, avec proportions, alignement et animation assumés ; pas un mot coincé à côté d’une petite flèche.
- « Search with Clear » possède une seule action d’effacement. Vérifier les contrôles natifs du navigateur avant d’ajouter une seconde croix ou flèche.
- « Loading Indicator » doit correspondre à une opération déclenchée et avoir une sortie claire : résultat ou erreur. Aucun spinner permanent ou inexpliqué.

### Multiline

Traiter ces exemples comme de vrais composeurs : zone de rédaction prioritaire, barre d’actions lisible, compteur secondaire et envoi clairement placé. Préférer une composition aboutie à plusieurs variantes faiblement différenciées.

Éviter les barres rigides, les ruptures de fond, les textes flottants, les actions sous-dimensionnées et les zones d’écriture écrasées. Vérifier le contenu long, les retours à la ligne, l’envoi, la correction et le comportement mobile.

### Card

- Une carte de texte simple centre réellement son contenu horizontalement et verticalement. Ne pas laisser une phrase flotter contre un bord ou dans une zone trop haute.
- Les cartes possèdent un contour sombre continu de **2 px**. Les côtés et le bord supérieur ne doivent jamais devenir gris tandis que l’ombre inférieure reste noire.
- Les variantes élevées conservent un véritable contour noir en plus de leur ombre tactile courte ; l’ombre ne remplace pas la bordure.
- Les titres, sélections et cartes interactives reçoivent un mouvement lisible et cohérent avec les boutons du projet. Une carte entièrement statique alors qu’elle représente une interaction est inachevée.
- Une illustration annoncée comme telle doit être un véritable SVG structuré, pas un empilement de `div`, de texte ou de formes CSS qui imitent une image.
- Le SVG des feuilles de notes est une exception volontaire au principe d’animation : il reste fixe dans **toutes** ses occurrences pour éviter les sauts et défauts de rendu.
- Les avatars à initiales dans un cercle, points de menu, pictogrammes et marqueurs génériques sont interdits lorsqu’une icône tactile existe. Employer la famille SVG et la mécanique de `Button`/`IconButton` : trait cohérent, face claire, contour sombre et ombre courte.
- Les listes de membres, statuts, actions et cadres doivent prolonger le style tactile initial du projet. Ne pas livrer une liste de ronds génériques ou un badge pastel sans contour dans une carte pourtant travaillée.

### Badge

- **Chaque badge possède un contour visible**, y compris les variantes `solid`, `soft`, `outline`, les compteurs et les statuts intégrés aux cartes.
- Un badge n’est pas une simple pilule pastel générique. Sa forme, son contour, son ombre, son icône ou marqueur et sa typographie doivent appartenir au langage tactile du projet.
- Chaque combinaison apparence × ton doit être vérifiée séparément. Interdire le gris sur gris, le gris sur rouge foncé, le texte trop pâle sur une face colorée et toute combinaison dont la lecture dépend du zoom.
- Les variantes pleines utilisent une encre très contrastée, généralement blanche sur une face forte. Les variantes douces et contour utilisent une encre sombre issue de la même famille sémantique.
- Un statut ne dépend pas uniquement de la couleur : employer texte, icône ou marqueur géométrique cohérent. Éviter le point rond générique par défaut.
- Les matrices de démonstration ne doivent pas ressembler à une grille de cases grises. Elles servent à comparer des badges compacts, individualisés et clairement délimités.

### Tabs

- Le rail, l’onglet sélectionné et le panneau possèdent des contours sombres assumés et une profondeur tactile. Aucun exemple de la page ne doit revenir à une barre grise plate sans contour.
- L’indicateur sélectionné doit être dynamique : déplacement fluide, dépassement/rebond court et stabilisation nette. Une simple variation de fond ou une translation molle est insuffisante.
- Le survol soulève légèrement, l’appui comprime le relief et la sélection produit un retour perceptible. Appliquer cette logique à toutes les variantes, avec une réduction adaptée sous `prefers-reduced-motion`.
- Les alignements `start`, `center` et `end` sont des comportements mesurables. Pour `center`, les espaces libres gauche et droite doivent être égaux ; ne pas valider au jugé.
- Les panneaux accompagnent le changement d’onglet sans glissement latéral trompeur. Préférer une apparition courte et souple ou un fondu.
- Les icônes sont de vrais SVG issus de la même famille que les boutons, jamais des caractères Unicode décoratifs.
- Le clavier doit déplacer le focus et la sélection conformément au mode d’activation, sans casser l’indicateur.

### Achievement, Reaction Button et Stepper

- Les trophées et leurs illustrations restent **toujours neutres**, dans tous les états et pendant les célébrations. Le succès peut colorer les badges, les jauges ou les éléments autour, jamais le trophée lui-même.
- Chaque visuel Achievement est un SVG autonome : cadre, ombre, médaillon et pictogramme partagent les coordonnées du SVG. Aucun pictogramme HTML positionné au-dessus. La taille conserve le ratio du dessin ; vérifier particulièrement l’icône en grande taille.
- Reaction Button emploie uniquement des icônes SVG, y compris les réactions personnalisées et le sélecteur. Les emojis sont interdits.
- Les micro-titres des séries de réactions disposent de 12 px avant le bouton ; les groupes successifs restent clairement séparés.
- Dans le Stepper intégré, conserver au moins 16 px entre le texte d’étape et la carte de contenu, y compris pour la dernière étape.
- Les connecteurs passent derrière tous les indicateurs, sans couper leurs contours, notamment l’indicateur clair sur fond sombre. Avec des libellés à côté, les segments occupent l’espace libre entre les contrôles et ne traversent pas les textes.
- Un parcours condensé conserve des cases de largeur minimale, un déclencheur de taille cohérente et des connecteurs continus. Préférer un défilement explicite au chevauchement des libellés. Les exemples déclarés larges doivent réellement occuper la largeur de la galerie.

### Aperçus de la bibliothèque

Les vignettes de la page « All components » sont des représentations du composant, pas des images indépendantes oubliées après la première livraison.

- Toute modification matérielle de Card, Badge ou Tabs impose la mise à jour de sa preview `.mini-*` dans `src/main.jsx` et `src/styles.css`.
- La preview doit reprendre les traits distinctifs actuels : contours, ombres, icônes, formes, contraste et état sélectionné.
- Vérifier les trois previews ensemble dans la grille principale après chaque modification. Une page de détail à jour avec une vignette ancienne est une régression.
- Garder la preview compacte et statique quand son animation ne peut pas être représentée de façon fiable ; elle doit néanmoins montrer clairement le style tactile actuel.

## 8. Contrôle avant livraison

- [ ] Le repos, le survol, l’appui et le clavier ont été vus dans le navigateur.
- [ ] Aucun anneau extérieur parasite ; les contours normaux et les ombres sont conservés.
- [ ] Erreurs, succès et désactivation possèdent des couleurs cohérentes.
- [ ] Les actions importantes ont un feedback animé explicite et honnête.
- [ ] Les animations ont été observées pendant leur déroulement et après stabilisation.
- [ ] Les SVG explicitement statiques ne possèdent ni animation interne, ni transition, ni déplacement au survol.
- [ ] Les clics répétés, la correction et la réinitialisation fonctionnent.
- [ ] Les panneaux respirent ; les libellés longs ne cassent pas la composition.
- [ ] Les champs composés n’ont ni doublons d’icônes ni doubles bordures.
- [ ] Les scrollbars, poignées et composeurs respectent la même direction artistique.
- [ ] Le rendu est vérifié sur desktop, largeur intermédiaire et mobile, ainsi qu’en sombre/RTL lorsque proposés.
- [ ] Le focus reste perceptible, les messages accessibles et le mode mouvement réduit utilisable.
- [ ] Toutes les bordures attendues sont présentes sur les quatre côtés et utilisent la couleur sombre du système, pas un gris hérité accidentellement.
- [ ] Chaque badge reste lisible dans chaque combinaison apparence × ton et possède un contour visible.
- [ ] Les Tabs `start`, `center` et `end` ont été mesurés ; l’indicateur, le rebond, l’appui et le clavier ont été testés.
- [ ] Aucun avatar, badge, pictogramme, point de menu ou conteneur générique ne remplace une primitive visuelle déjà définie dans le projet.
- [ ] Les previews de la bibliothèque ont été mises à jour et comparées aux pages Card, Badge et Tabs.
- [ ] La compilation et les tests pertinents passent ; les sources copiables correspondent au rendu.

## 9. Repères dans le projet

- `src/styles.css` : cadre du catalogue, typographie, navigation, focus global et scrollbars.
- `src/components/Button/Button.jsx` et `Button.css` : mécanique tactile, statuts et `ActionFeedback`.
- `src/components/Button/showcase.css` : galeries, documentation, dialogues et présentation du code.
- `src/components/Forms/Forms.css`, `EnrichedForms.css`, `NumericForms.css` : champs, composeurs, resize et états de validation.
- `src/components/Checkbox/Checkbox.css` : cases, cartes, palettes, focus, illustrations et mouvement.
- `src/components/Checkbox/CheckboxShowcase.css` : composition des panneaux et exemples.
- `src/components/Card/Card.css`, `CardDemos.jsx` et `CardShowcase.css` : cartes, cadres, icônes tactiles et SVG statique.
- `src/components/Badge/Badge.css` et `BadgeShowcase.css` : contrastes, contours et matrices apparence × ton.
- `src/components/Tabs/Tabs.css` et `TabsDemos.jsx` : indicateur rebondissant, alignements, panneaux et navigation clavier.
- `src/main.jsx` et `src/styles.css` : previews compactes de la bibliothèque, à synchroniser avec les composants.
- `tests/checkbox.browser.mjs` et `tests/feedback.browser.mjs` : interactions et régressions visuelles ciblées.

Pour tout nouveau composant : relire les règles communes, examiner les primitives voisines, définir les états et leur mouvement, puis vérifier le résultat rendu. La finition fait partie du travail demandé.
