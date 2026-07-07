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
  - [ ] `completedBeforeHtml` (already-submitted message) · `loadingHtml` — _deferred_
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
  - [ ] `descriptionLocation` · `minWidth` / `maxWidth` — _deferred_
- [x] **1.6 Navigation buttons control** — ★★ · S — a "Navigation" refinement.
  - [x] `showNavigationButtons` / `showPrevButton`
  - [x] `goNextPageAutomatic`
  - [x] page-level `navigationButtonsVisibility` (inherit/show/hide)
  - [ ] `showCompleteButton` · `allowCompleteSurveyAutomatic` — _deferred_

---

## Tier 2 — Power features (high value, larger builds)

- [x] **2.1 Triggers & calculated values** — ★★★ · L — the single biggest capability jump (static forms → interactive flows). An "Automation" section in Form settings; verified firing at runtime on the public form.
  - [x] `triggers[]`: `complete`, `setvalue`, `copyvalue`, `runexpression`, `skip`
  - [x] `calculatedValues[]` (named expressions for text piping + logic)
- [~] **2.2 More field types** — ★★★ · L (incremental) — one registry entry + one card preview each; ship by demand. _First batch shipped; rest by demand._
  - [x] matrix (single-select grid) — rows/columns editor
  - [x] ranking
  - [x] multiple text — items editor
  - [x] tagbox (multi-select dropdown)
  - [x] expression (read-only computed display)
  - [ ] matrix dropdown / dynamic (currently preserved-and-locked; give them editors)
  - [ ] panel & panel dynamic (repeating groups — needs nested canvas)
  - [ ] image picker (needs per-choice image URL editor)
  - [ ] color / button group
- [x] **2.3 Theme / appearance editor** — ★★★ · L — visual theme picker (presets + accent + light/dark) writing `schema.theme`, applied by every renderer via `applyStoredTheme`.
  - [x] accent colour (+ presets) / light-dark palette
  - [x] corner radius / density / panel-less mode
  - [x] font
  - [ ] background colour — _deferred (needs the derived-colour set to look right)_
- [x] **2.4 Welcome / start page** — ★★ · M — `firstPageIsStarted` + `startSurveyText`; toggle in Form settings, "Start page" badge on page 1 in the canvas.
- [x] **2.5 Table of contents & page navigation** — ★★ · M — survey `showTOC` + `tocLocation`; page `navigationTitle` / `navigationDescription`.
- [x] **2.6 Dynamic choices** — ★★ · M — a "Choices from" source picker (fixed list / another question / web service) writing `choicesByUrl` and `choicesFromQuestion`.

---

## Tier 3 — Workflow & scale (product maturity)

- [ ] **3.1 Translations management view** — ★★ · M–L — one grid of every localized string × every locale; reads/writes the same `{default,<locale>}` objects.
- [ ] **3.2 General undo / redo** — ★★ · M — full history stack for every edit (today only AI proposals undo); snapshot-based on `export()`/`replaceSchema()`.
- [ ] **3.3 Templates & question library** — ★★ · M — starter templates, "save selection as reusable block", duplicate an entire form.
- [ ] **3.4 Page-level advanced** — ★ · S–M — `readOnly` / `enableIf` / `requiredIf`, `maxWidth`, `questionTitleLocation`, `timeLimit`, `questionStartIndex`.
- [ ] **3.5 Survey-wide advanced** — ★ · S — `questionTitlePattern`, `requiredText`, `maxTextLength`, `textUpdateMode`, `widthMode` / `width`, `cookieName` (fill once), `questionsOrder` (survey-wide randomize).
- [ ] **3.6 Version history & audit** — ★ · L — persist schema revisions with a diff/restore view; needs a DB revisions table.

---

## Suggested execution order

1. **Tier 1 as one pass** (1.1 → 1.6) — completes the "settings" story that this
   session started; each is a small panel section and together they close the
   most common real-form gaps.
2. **2.2 field types, incrementally** — add the two or three most-requested types
   (matrix, panel dynamic, ranking) alongside Tier 1.
3. **2.1 triggers/calculated values** and **2.3 theme editor** — the two features
   that most change what the product can do and how it looks.
4. **Tier 3** — pick up as usage scales (translations grid, undo/redo, templates).

---

## Non-goals / guardrails

- **Never** add `survey-creator*` (proprietary). All of the above is buildable on
  the MIT `survey-core` + our own Svelte editor.
- Keep the **preserve-and-lock** contract: any property or type without a visual
  editor must survive a JSON round-trip untouched.
- Store defaults as **absent** (delete the key when a control is at its default) to
  keep exported JSON clean and portable.
- Every feature ships with a browser/feature test, per project convention.
