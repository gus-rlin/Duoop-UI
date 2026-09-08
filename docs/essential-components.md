# Essential components

This guide covers eleven component families, each represented by one entry in the 46-component catalog. Each includes a live gallery, API notes, source files, a working starter and downloadable examples. Compound exports such as RangeSlider and DataTable are part of their parent entry. Breadcrumb and Separator are additional catalog entries covered by `npm run test:navigation`.

| Family | Source | Foundation |
| --- | --- | --- |
| Tooltip | `src/components/Tooltip` | Radix Tooltip: hover/focus delay, Escape, collision handling; disabled trigger wrapper |
| Popover | `src/components/Popover` | Radix Popover: non-modal content, outside dismissal, focus restoration, nesting |
| Slider / RangeSlider | `src/components/Slider` | Radix Slider: pointer, touch, keyboard, multiple thumbs, RTL, form values |
| Calendar | `src/components/Calendar` | React DayPicker v9: single/range selection, disabled dates, month/year navigation |
| Date Picker | `src/components/DatePicker` | Duoop Button + Popover + Calendar; local date form serialization |
| Table / DataTable | `src/components/Table` | Semantic HTML; local sorting, page selection, pagination and empty state |
| Pagination | `src/components/Pagination` | Duoop Button; one-based controlled navigation and compact mobile controls |
| Sheet | `src/components/Sheet` | Radix Dialog: four sides, scroll lock, focus containment and restoration |
| File Upload / Dropzone | `src/components/FileUpload` | React Dropzone: file validation; Duoop queue, previews, transport states and cancellation |
| Skeleton | `src/components/Skeleton` | CSS shapes for text, avatar, card and table; reduced-motion fallback |
| Alert / Callout | `src/components/Alert` | Persistent semantic messages with Duoop FeedbackIcon and Button |

## Integration details

Install the collection with `npm i duoop-ui` in a React 19 app and import `duoop-ui/styles.css` once. Runtime dependencies install automatically. For source-copy integration, preserve the listed files, import `base.css` once and install the dependencies shown by each component's Installation tab. See the [installation guide](../README.md#install-the-library).

- Tooltip children must forward refs and DOM props. Share TooltipProvider across a toolbar to share timing. Hints do not consume touch taps; essential instructions belong in visible text. Interactive help belongs in Popover.
- Popover is intentionally non-modal. Sheet is modal. When placing Popover inside an existing native dialog, pass that dialog's content element as the portal `container` so it remains in the top layer.
- Slider values are arrays, including single values. Set `name` to include its native hidden fields in a form. Supply valid bounds and positive steps.
- Calendar selection is controlled with `selected` and `onSelect`. Range mode starts a new range with the first click and completes it with the second; `resetOnSelect` can be overridden on Calendar. Dates remain local calendar dates, rather than UTC instants.
- Date Picker uses a labeled button, not free-text parsing. `name` submits `YYYY-MM-DD`; ranges submit `name.from` and `name.to`. `null` clears a controlled value. `disabledDates` accepts DayPicker matchers and predicates.
- DataTable deliberately stays a local-data layer. Supply stable row ids; selection uses ids and survives pagination. Its semantic Table parts can be combined with TanStack Table for external sorting, filtering, virtualization or server pagination.
- FileUpload never sends files without an `upload(file, {signal, onProgress})` handler. Progress is indeterminate until the handler reports a percentage. Resolve only when the real operation completes; reject to show a retryable error. Respect AbortSignal. The gallery's local reader performs real FileReader work and explicitly says that nothing is uploaded. Validate uploads on the server as well.
- Skeleton elements are hidden from assistive technology. Announce loading once on the containing region and clear `aria-busy` when real content arrives.
- Alert defaults to a persistent named region. Use an assertive alert role only for a newly occurring urgent error.

## Verification

Run `npm run test:essentials` for browser interactions, responsive galleries at 1440/768/390/320 px, axe checks, screenshots, focus restoration, touch activation, range selection, file rejection/progress/retry/cancellation and cleanup. Artifacts are written to `artifacts/essentials/`.

Run `npm run test:essential-downloads` to download and build all eleven essential starters and their current gallery variants. The script discovers variants from the live galleries and writes the measured total to `artifacts/essential-downloads/results.json`. Both essential scripts start their own servers. `npm test` also attempts public navigation, component downloads and gallery source builds; see [current validation limits](../VALIDATION.md) before treating that broader suite as a passing result. Third-party source links and notices are retained in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md), which is included in downloads.
