# Formwright — Feature Roadmap

A prioritized map of what the builder can still add, measured against the two
SurveyJS references we target:

- [Survey (data) model](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model)
- [Page model](https://surveyjs.io/form-library/documentation/api-reference/page-model)

**Guiding fact:** the runtime is `survey-core` + `survey-js-ui` (MIT), which
already *renders* every property below. So each item here is **editor-UI work
only** — surfacing a native property in the panel. Nothing here needs a new
runtime dependency, and none of it requires the proprietary `survey-creator`.
Unknown/unsupported keys are already preserved byte-for-byte, so any of these can
also be hand-authored in the JSON tab today; the roadmap is about giving them a
visual editor.

Legend — **Effort:** S (hours) · M (a day) · L (multi-day). **Impact:** ★★★ high
· ★★ medium · ★ nice-to-have.

---

## ✅ Already shipped

- [x] **Fields** (13 types) — number, date, short/long text, single/multiple choice, dropdown, yes-no, rating, statement (html), image, file, signature — each with a per-type visual editor
- [x] **Field props** — title, description, default value, required, hidden (`visible`), read-only, choices (+ value chips, paste, "Other"), per-field localization
- [x] **Logic** — Show / Hide / Disable via `visibleIf` / `enableIf` (De Morgan), required-if, raw-expression escape hatch, dependency map
- [x] **Quiz** — per-field `points` + `correctAnswer`, live preview tally, server-side scoring
- [x] **Pages** — title, description, hidden (`visible`), `visibleIf`, `questionsOrder`, rename
- [x] **Form (survey)** — title, description, progress bar (+ type), question numbers, questions-per-page mode, preview-before-submit, nav button text, thank-you HTML
- [x] **Platform** — i18n + RTL, live preview, JSON round-trip, public fill-out + submissions, multi-tenancy, AI draft/rewrite

---

## Tier 1 — Form completeness (do first)

High-impact gaps that users hit on almost any real form. Mostly small, additive
panel controls.

- [x] **1.1 Branding & header** — ★★★ · S — "Header & branding" section in Form settings. _(logo is a URL for now; upload wiring is separate.)_
  - [x] `logo` + `logoPosition` (left/right/top/bottom)
  - [x] `logoWidth` / `logoHeight` / `logoFit`
  - [x] `showTitle` / `showPageTitles`
- [x] **1.2 Completion & redirect** — ★★★ · S–M — extends the "After submitting" section.
  - [x] `navigateToUrl` (redirect after submit)
  - [x] `completedHtmlOnCondition` (per-outcome thank-you — pairs with quiz scoring)
  - [x] `showCompletedPage`
  - [x] `completedBeforeHtml` (already-submitted message) · `loadingHtml`
- [x] **1.3 Validation behavior** — ★★★ · S — "Validation & behavior" section in Form settings.
  - [x] `checkErrorsMode` (onNextPage / onValueChanged / onComplete)
  - [x] `questionErrorLocation` (top/bottom)
  - [x] `clearInvisibleValues` (none/onHidden/onComplete)
  - [x] `focusOnFirstError` / `focusFirstQuestionAutomatic`
- [x] **1.4 Field validators** — ★★★ · M — a "Validation" repeater in the field panel; highest-value field-level gap after logic.
  - [x] `numeric` (min/max)
  - [x] `text` (min/max length)
  - [x] `email`
  - [x] `regex` (pattern + message)
  - [x] `expression` / `answercount`
- [x] **1.5 Field appearance & layout** — ★★ · M — turns the single-column canvas into real multi-column layouts.
  - [x] `placeholder` (types that support it)
  - [x] `titleLocation` (top/bottom/left/hidden)
  - [x] `startWithNewLine` + `width` (side-by-side fields)
  - [x] `defaultValueExpression`
  - [x] `descriptionLocation` · `minWidth` / `maxWidth`
- [x] **1.6 Navigation buttons control** — ★★ · S — a "Navigation" refinement.
  - [x] `showNavigationButtons` / `showPrevButton`
  - [x] `goNextPageAutomatic`
  - [x] page-level `navigationButtonsVisibility` (inherit/show/hide)
  - [x] `allowCompleteSurveyAutomatic` — _`showCompleteButton` is not a `survey` property in survey-core 1.12.63; auto-submit covers the same need. Revisit on upgrade._

---

## Tier 2 — Power features (high value, larger builds)

- [x] **2.1 Triggers & calculated values** — ★★★ · L — the single biggest capability jump (static forms → interactive flows). An "Automation" section in Form settings; verified firing at runtime on the public form.
  - [x] `triggers[]`: `complete`, `setvalue`, `copyvalue`, `runexpression`, `skip`
  - [x] `calculatedValues[]` (named expressions for text piping + logic)
- [x] **2.2 More field types** — ★★★ · L — 21 block types, each with a registry entry, a card preview and an editor.
  - [x] matrix (single-select grid) — rows/columns editor
  - [x] ranking
  - [x] multiple text — items editor
  - [x] tagbox (multi-select dropdown)
  - [x] expression (read-only computed display)
  - [x] matrix dropdown / dynamic — typed-cell columns editor (`cellType` per column)
  - [x] panel & panel dynamic — nested canvas with per-container drag zones
  - [x] image picker — per-choice image URL editor
  - [x] button group
  - [x] color — shipped as `text` + `inputType: 'color'` (native swatch). `color` is not a question type in survey-core 1.12.63, so a dedicated type would not render; the text/inputType form round-trips and renders correctly.
- [x] **2.3 Theme / appearance editor** — ★★★ · L — visual theme picker (presets + accent + light/dark) writing `schema.theme`, applied by every renderer via `applyStoredTheme`.
  - [x] accent colour (+ presets) / light-dark palette
  - [x] corner radius / density / panel-less mode
  - [x] font
  - [x] background colour — page + question surface, each writing its derived companions (`-dim-light`/`-dim-dark`, `-dark`), with a "use palette defaults" reset
- [x] **2.4 Welcome / start page** — ★★ · M — `firstPageIsStarted` + `startSurveyText`; toggle in Form settings, "Start page" badge on page 1 in the canvas.
- [x] **2.5 Table of contents & page navigation** — ★★ · M — survey `showTOC` + `tocLocation`; page `navigationTitle` / `navigationDescription`.
- [x] **2.6 Dynamic choices** — ★★ · M — a "Choices from" source picker (fixed list / another question / web service) writing `choicesByUrl` and `choicesFromQuestion`.

---

## Tier 3 — Workflow & scale (product maturity)

- [x] **3.1 Translations management view** — ★★ · M–L — a **Translations** tab: every localized string × every locale in one grid, with per-locale coverage counts and missing-cell highlighting. Rows come from a generic walk of `LOCALIZED_KEYS`, so choices, matrix rows and validator messages are picked up automatically.
- [x] **3.2 General undo / redo** — ★★ · M — snapshot history over `export()`/`replaceSchema()`, with keyed coalescing (a typing burst in one field = one step). Toolbar ↶/↷ + Ctrl/Cmd+Z / Ctrl+Shift+Z. Absorbs the old AI-only undo.
- [x] **3.3 Templates & question library** — ★★ · M — a **Templates** panel (blank / contact / satisfaction / quiz / registration) applied as one undoable step, and a **saved-blocks library** (☆ on a field card → reusable block in the palette, kept in `localStorage`).
  - [x] starter templates
  - [x] save selection as a reusable block
  - [x] duplicate an entire form — a `FormSchemaResource` (Forms list) with a **Duplicate** row action (deep-copies the JSON, fresh slug + " (copy)" name, no revision history), a **Design** action that opens the record in the designer (`?record=`), and create/rename/delete
- [x] **3.4 Page-level advanced** — ★ · S–M — `readOnly`, `enableIf`, `questionTitleLocation`, `maxWidth`, `maxTimeToFinish` (time limit).
- [x] **3.5 Survey-wide advanced** — ★ · S — `questionTitlePattern`, `requiredText`, `maxTextLength`, `textUpdateMode`, `widthMode` / `width`, `cookieName` (fill once), `questionsOrder` (survey-wide randomize).
- [x] **3.6 Version history & audit** — ★ · L — a `form_schema_revisions` table + `FormSchemaRevision` model; a snapshot is written on every *distinct* Save (attributed to the user). A **History** panel lists versions with field counts and a Current badge; Restore loads a version back into the builder as a normal undoable replacement (nothing is written until you Save).

---

## Status

**Tiers 1, 2 and 3 are complete.** The previously-deferred items have now
shipped: heavier field types (panel / panel-dynamic, matrix dropdown / dynamic,
image picker, button group, colour), the small deferred props
(`completedBeforeHtml`, `loadingHtml`, `descriptionLocation`,
`minWidth`/`maxWidth`, `allowCompleteSurveyAutomatic`), and **duplicate an entire
form** via the new `FormSchemaResource`.

Two items are intentionally held for a survey-core upgrade, because the
properties do not exist in 1.12.63 and would export non-rendering JSON:

- `color` **question type** — shipped instead as `text` + `inputType: 'color'`.
- `showCompleteButton` — auto-submit (`allowCompleteSurveyAutomatic`) covers the
  same need for now.

What remains, beyond the roadmap:

1. Wire file/image/signature uploads to a storage disk.
2. Extract the code into the `formwright/formbuilder` package.

---

## Non-goals / guardrails

- **Never** add `survey-creator*` (proprietary). All of the above is buildable on
  the MIT `survey-core` + our own Svelte editor.
- Keep the **preserve-and-lock** contract: any property or type without a visual
  editor must survive a JSON round-trip untouched.
- Store defaults as **absent** (delete the key when a control is at its default) to
  keep exported JSON clean and portable.
- Every feature ships with a browser/feature test, per project convention.
