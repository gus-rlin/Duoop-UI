# Essential components

Eleven catalog entries cover ten component families. Each includes a live gallery, API notes, source files, a working starter and downloadable examples.

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

Run `npm run test:essential-downloads` to download and build all 11 new starters and 42 gallery variants. `npm test` also validates public navigation, every component download, gallery source bundles and their builds. Third-party source links and MIT notices are retained in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md), which is included in downloads.
