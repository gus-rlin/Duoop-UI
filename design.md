# Duoop UI — Design and finishing guidelines

Use this reference when creating, changing, or reviewing catalog components. It captures the existing visual direction and feedback on Checkbox, Textarea, Input Group, Card, Badge, and Tabs. Values are existing references or design targets; this document is not an audit claiming every example already meets every rule.

## 1. Intent

Build restrained, precise, tactile interfaces: light surfaces, clear typography, confident outlines, and short shadows. Creativity comes from composition, proportion, and movement.

**Animation is central to the design.** It explains actions, accompanies state changes, and confirms results. Functional behavior with weak feedback is unfinished.

Preserve the existing visual family. Refine resting, hover, pressed, focus, and transitional states equally. Give content room; fix recurring defects in shared primitives. Reuse existing components and animation before inventing alternatives. Do not replace the established buttons, SVG icons, outlines, and shadows with generic circular avatars, dots, boxes, or pictograms.

## 2. Palette and materials

| Role | Reference |
| --- | --- |
| Main background | `#ffffff` |
| Navigation background | `#f7f8fa` |
| Preview background | `#fafbfc` |
| Application text | `#252a34` |
| Catalog navigation/actions | `#303b51` |
| Tactile control text/faces | `#373434` |
| Neutral control border | `#777474` |
| Dark tactile shadow | `#1d1b1b` |
| Selected neutral surface | `#f0eeee` |
| Catalog separators | `#e7e9ed` |
| Catalog secondary text | `#717781` |
| Control secondary text | `#686565` |

Blue-gray structures the catalog; warm gray anchors components. Avoid a different accent color for every variant.

### Semantic states

A state needs a complete palette, not just a colored border.

| State | Ink / strong face | Light background | Press / shadow |
| --- | --- | --- | --- |
| Light error | `#a51d2d` | `#fff2f3` to `#fff5f5` | Consistent red; `#761725` for a solid action |
| Light success | `#356247` | `#edf5ef` | `#234631` |
| Dark-surface error | `#ff9dab` | `#3b282d` | `#ad6070`, adapted to depth |

A checked invalid checkbox uses red for face, border, and shadow, with a contrasting check. An unchecked invalid checkbox keeps a light face with red border/shadow. Labels, help, and messages support the same state. Never combine a black box and added red border, a gray shadow below a red box, or conflicting error colors. Watch the “Accept terms” and “Publish externally” regression cases. Color must be accompanied by shape, icon, or explicit text.

Dark Checkbox references: background `#252323`, text `#f3eeee`, secondary text `#bdb5b5`, border `#b0a6a6`, selected surface `#383333`. Adapt the entire palette, including error and success; do not simply invert colors or reuse pale backgrounds. Use semantic variables inherited by nested controls.

## 3. Outlines, shadows, and focus

Distinguish the normal outline (shape), tactile shadow (depth), and extra outer ring (unwanted in this visual direction). **Never remove the normal outline or shadow to eliminate an extra ring.**

Control borders are typically **2 px**; radii are **10 px** for buttons, fields, and selection cards, and **5 px** for small checkboxes. Catalog cards generally use **1 px** borders and **10–12 px** radii. Shadows are short, sharp, and unblurred: about **2 px** for checkboxes and **3–5 px** for buttons.

Keyboard focus must remain obvious without an extra outer ring:

- Checkbox: change the existing outline, currently to a dashed keyboard-focus border.
- Button: a contrasting inset marker that preserves depth.
- Composite field: one container treatment, avoiding duplicate parent/input focus styles.
- Link or small action: an inset marker or stronger underline.

Use `:focus-visible`; check programmatic focus after errors. Never apply global `outline: none` without a visible replacement. Inspect global rules, `:focus`, `:focus-visible`, `:focus-within`, native styles, and pseudo-elements. Fix shared causes rather than layering overrides and `!important`.

## 4. Typography and sizing

Use **DM Sans** with a sans-serif fallback and monospace for code. Public documentation and new interface copy use English consistently.

| Use | Reference size | Weight / rhythm |
| --- | --- | --- |
| Component heading | 34 px desktop / 29 px mobile | 600, slightly tight tracking |
| Page heading | 29 / 25 px | 600 |
| Section heading | 19–21 px | 550–600 |
| Subheading | 15 px | 550–600 |
| Label / example title | 13–14 px | 500–600 |
| Help / description | 12–13 px | 400–450; 1.6–1.8 line height |
| Metadata / counter / badge | 10–11 px | Secondary; never the sole critical information |
| Code | 12 px | Monospace; about 1.85 line height |

Reserve 9–10 px micro-labels for nonessential editorial details. Never shrink instructions or errors to fit. Field sizes use **12/14/16 px** type and approximately **36/44/52 px** heights. Checkboxes use **16/20/24 px** boxes and **12/13/15 px** labels. The drawn box is not the whole click target.

Aim for **44 px** important touch targets. Prefer **16 px** mobile input text where needed to avoid disruptive automatic zoom; adapt the control instead of disabling browser zoom.

## 5. Spacing and composition

Working scale: **4, 8, 12, 16, 20, 24, 28, 32, 40, 48 px**. Optical adjustments are allowed for real alignment problems.

| Relationship | Target |
| --- | --- |
| Icon/text or checkbox/label | 8–12 px |
| Label/help | 5–10 px |
| Actions in one row | 10–12 px |
| Simple grouped options | 8–14 px, accounting for padding |
| Form blocks | 20–24 px |
| Selection-card padding | 16–22 px |
| Preferences-panel padding | 28 px desktop / 20 px mobile |
| Internal panel sections | 24–28 px |
| Gallery gutters | 18–22 px |
| Major documentation sections | 40–52 px |

Proximity communicates relationships. Keep headings and descriptions together and separate subsequent groups. Do not crowd controls against selected cards.

### Theme & Direction

Compose a complete panel: subtle marker, heading, short introduction, primary option, secondary preferences, and a closing note when useful. Establish hierarchy with space and type rather than extra frames. Use two theme columns when space allows and one on mobile. For RTL, use logical properties and inspect icon, checkbox, badge, and text ordering.

### With Illustration

Illustrations must depict the selected content: a document, preview, or recognizable object, with intentional space, scale, and relation to its label. The stacked-document illustration has a corner control and title/metadata below. Its SVG stays **strictly static**: no sheet motion on hover, internal transitions, or animated check drawing. Card/state animations must not animate the SVG internals. Avoid large gray bands supporting tiny icons or generic filler illustrations; preserve readability and a fully clickable surface.

## 6. Motion

Aim for **strong interaction feedback and little resting movement**. Every motion expresses cause and result. Avoid endless bouncing or competing decorative animations.

| Interaction | Target duration | Behavior |
| --- | --- | --- |
| Hover / color / border | 120–180 ms | Immediate, smooth response |
| Press | 80–120 ms | Short descent, reduced shadow |
| Tactile return | 180–240 ms | Slightly elastic return without jumps |
| Check / indeterminate | 140–180 ms | Clear drawing/transition with stable geometry |
| Validation / error | 220–360 ms | Appear, draw, settle |
| Reactive illustration, where permitted | 240–320 ms | Small movement/rotation; excludes static Card SVGs |
| Dialog opening | 180–260 ms | Opacity and slight displacement |

Keep timings related. Use `ease-out` for reveals, a curve near `cubic-bezier(.2,.8,.2,1)` for surfaces, and a softer return for tactile buttons.

### Important action feedback

For saving, validating, sending, copying, or completing a search:

1. Respond immediately to the press.
2. Show local, understandable loading only while an operation is actually pending.
3. On success, animate confirmation with a drawn check, button/icon transition, and contextual message.
4. On failure, identify the affected field/action, explain the issue, and allow correction.
5. Clear stale success after editing/resetting and restore the action.

Changing text to “Terms accepted” alone is insufficient. Reuse `Button`, its `status`, and `ActionFeedback`. Avoid redundant messages: the button confirms; text may explain the consequence. Never show success prematurely or add artificial spinner delays. Identify simulated async demos. Every permitted retry must produce perceptible feedback.

Prefer `transform` and `opacity`, with short targeted color/border/shadow transitions. Avoid `transition: all`. Reserve label/status space to prevent width jumps. Handle rapid clicks, interruption, closing, and unmounting. Clean up timers/animations and prevent stuck loading. Under `prefers-reduced-motion`, preserve state, icons, and messages while removing disruptive movement and drawing animations.

## 7. Component-specific checks

### Checkbox and groups

No extra click ring in cards, error, dark, or RTL states. Preserve unchecked, checked, indeterminate, and disabled states. Parents reflect child selection; partial selection does not require cycling three states on click. Bulk changes preserve disabled options. Provide clickable labels, accessible names for standalone boxes, visible focus, and associated messages. Selected cards remain readable without stacked borders, halos, double shadows, or excessive fill.

### Textarea, scrolling, and Vertical Resize

Use one visual shell without duplicate borders or stray inner backgrounds. Preserve text padding near the bottom and resize handle. Scrolling and resizing are distinct functions. Scrollbars are thin, neutral, and rounded: **7 px**, thumb `#aaa5a5`, hover `#777171`, subtle track. Avoid oversized native scroll elements or diagonal grips that clash with the design. Custom handles must be identifiable, keyboard-operable, and easy to target. Keep a usable native fallback. Test fixed height, auto-growth, overflow, resize, and mobile widths.

### Input Group and embedded actions

Input, prefix, suffix, and button form one surface. Avoid purposeless separators or unstructured text. Send icons should be **20–24 px** within comfortable action targets, without added rings. “Text Button” must be an intentionally proportioned and animated action, not text wedged beside a tiny arrow. “Search with Clear” has one clear action; inspect native controls before adding another. “Loading Indicator” corresponds to a triggered operation with a result or error, never an unexplained permanent spinner.

### Multiline

Build actual composers: prioritize writing space, make the action bar readable, keep the counter secondary, and place send clearly. Prefer a finished composition over weakly differentiated variants. Avoid rigid bars, background breaks, floating labels, undersized actions, and cramped writing areas. Test long text, line breaks, submission, correction, and mobile behavior.

### Card

Center simple text horizontally and vertically. Maintain a continuous dark **2 px** outline on all sides; top and side edges must not turn gray while the bottom shadow stays black. Raised cards retain their outline in addition to a short tactile shadow. Titles, selections, and interactive cards need readable motion consistent with buttons.

Illustrations must be structured SVG, not HTML/CSS shapes posing as an image. The stacked-note SVG is intentionally static in **every** occurrence. Do not use generic initial avatars, menu dots, pictograms, or markers when a tactile icon exists. Reuse the SVG family and `Button`/`IconButton` mechanics: consistent stroke, light face, dark outline, short shadow. Member lists, statuses, actions, and frames must extend this style.

### Badge

**Every badge has a visible outline**, including solid, soft, outline, counters, and embedded statuses. Shape, shadow, icon/marker, and typography belong to the tactile system. Check every appearance × tone separately: no gray-on-gray, gray-on-dark-red, washed-out text, or combinations readable only when zoomed. Solid badges generally use white ink on a strong face; soft/outline use dark semantic ink. Do not convey status solely through color or default generic dots. Demo matrices should compare compact, individual badges rather than gray boxes.

### Tabs

Rail, selected tab, and panel need confident dark outlines and tactile depth. The indicator moves smoothly, briefly overshoots/bounces, and settles sharply; a background change or sluggish slide is insufficient. Hover lifts, press compresses, and selection responds, with reduced-motion adaptation. Measure `start`, `center`, and `end`; centered free space must be equal. Panels use a short reveal/fade rather than misleading lateral slides. Use actual SVG icons. Keyboard focus and selection follow the activation mode without breaking the indicator.

### Achievement, Reaction Button, and Stepper

Trophies and their illustrations remain **neutral in every state**, including celebration. Color surrounding badges/gauges, never the trophy. Each Achievement illustration is a standalone SVG: frame, shadow, medallion, and pictogram share SVG coordinates, without HTML overlays. Preserve aspect ratio and check large sizes.

Reaction Button uses SVG icons only, including custom reactions and the picker; no emoji. Leave 12 px between reaction-series micro-headings and buttons and clearly separate successive groups.

Stepper leaves at least 16 px between step text and content cards, including the last step. Connectors run behind indicators without crossing outlines, especially light indicators on dark backgrounds. With adjacent labels, segments occupy free space between controls without crossing text. Compact flows retain minimum cell widths, consistent triggers, and continuous connectors. Prefer explicit scrolling to overlapping labels. Wide examples must actually fill the gallery width.

### Catalog previews

“All components” thumbnails represent current components. Material Card, Badge, or Tabs changes require updating corresponding previews in `src/catalog/Previews.jsx` and their `.mini-*` styles in `src/styles.css`. Match current outlines, shadows, icons, shapes, contrast, and selected states. Review all three together in the main grid. A current detail page with a stale thumbnail is a regression. Compact static previews are acceptable when animation cannot be represented reliably, but they must show the current tactile style.

## 8. Delivery checklist

- [ ] Inspect resting, hover, pressed, and keyboard states in a browser.
- [ ] Preserve normal outlines/shadows without stray outer rings; verify all four border sides use the intended dark color.
- [ ] Keep error, success, and disabled palettes consistent.
- [ ] Give important actions explicit, honest animated feedback; observe motion during playback and after settling.
- [ ] Keep designated static SVGs free of internal animation, transitions, and hover displacement.
- [ ] Verify repeated clicks, correction, reset, and async cleanup.
- [ ] Give panels space; handle long labels and avoid duplicate icons/borders in composite fields.
- [ ] Keep scrollbars, handles, and composers consistent with the design.
- [ ] Check desktop, intermediate, and mobile widths, plus dark/RTL variants where offered.
- [ ] Preserve perceptible focus, accessible messages, and usable reduced motion.
- [ ] Check badge readability and outlines for every appearance × tone.
- [ ] Measure tab alignments and test indicator movement, bounce, press, and keyboard behavior.
- [ ] Reuse established visual primitives instead of generic avatars, badges, icons, menu dots, or containers.
- [ ] Compare updated catalog previews against Card, Badge, and Tabs detail pages.
- [ ] Run the build and relevant tests; verify copied sources match the rendered example.

## 9. Source map

- `src/styles.css`: catalog shell, typography, navigation, global focus, scrollbars.
- `src/components/Button/Button.jsx` and `Button.css`: tactile mechanics, states, `ActionFeedback`.
- `src/components/Button/showcase.css`: galleries, documentation, dialogs, code presentation.
- `src/components/Forms/Forms.css`, `EnrichedForms.css`, `NumericForms.css`: fields, composers, resizing, validation.
- `src/components/Checkbox/Checkbox.css` and `CheckboxShowcase.css`: controls, cards, palettes, focus, illustrations, motion, panels.
- `src/components/Card/Card.css`, `CardDemos.jsx`, `CardShowcase.css`: cards, frames, tactile icons, static SVG.
- `src/components/Badge/Badge.css` and `BadgeShowcase.css`: contrast, outlines, appearance/tone matrices.
- `src/components/Tabs/Tabs.css` and `TabsDemos.jsx`: bouncing indicator, alignment, panels, keyboard navigation.
- `src/catalog/Previews.jsx`, `PrimitivePreviews.jsx`, and `EssentialPreviews.jsx`: catalog previews; keep them synchronized with components and their styles.
- `src/main.jsx`: application shell, home page and routing.
- `tests/checkbox.browser.mjs` and `tests/feedback.browser.mjs`: focused interaction and visual regressions.

For each new component, read the shared rules, inspect neighboring primitives, define states and motion, then verify the rendered result. Finishing is part of the work.
