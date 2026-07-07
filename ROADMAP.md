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

| Scope | Covered |
|---|---|
| **Fields** (13 types) | number, date, short/long text, single/multiple choice, dropdown, yes-no, rating, statement (html), image, file, signature — each with a per-type visual editor |
| **Field props** | title, description, default value, required, hidden (`visible`), read-only, choices (+ value chips, paste, "Other"), per-field localization |
| **Logic** | Show / Hide / Disable via `visibleIf` / `enableIf` (De Morgan), required-if, raw-expression escape hatch, dependency map |
| **Quiz** | per-field `points` + `correctAnswer`, live preview tally, server-side scoring |
| **Pages** | title, description, hidden (`visible`), `visibleIf`, `questionsOrder`, rename |
| **Form (survey)** | title, description, progress bar (+ type), question numbers, questions-per-page mode, preview-before-submit, nav button text, thank-you HTML |
| **Platform** | i18n + RTL, live preview, JSON round-trip, public fill-out + submissions, multi-tenancy, AI draft/rewrite |

---

## Tier 1 — Form completeness (do first)

High-impact gaps that users hit on almost any real form. Mostly small, additive
panel controls.

### 1.1 Branding & header — **Impact ★★★ · Effort S**
Survey props: `logo`, `logoPosition` (left/right/top/bottom), `logoWidth`,
`logoHeight`, `logoFit`, `showTitle`, `showPageTitles`, `showQuestionNumbers`
(done). Add a "Header & branding" section to Form settings. Logo can reuse the
existing image/upload plumbing.

### 1.2 Completion & redirect — **Impact ★★★ · Effort S–M**
Survey props: `navigateToUrl` (redirect after submit), `completedHtmlOnCondition`
(different thank-you per outcome — pairs perfectly with quiz scoring),
`completedBeforeHtml` (already-submitted message), `loadingHtml`,
`showCompletedPage`. Extends the "After submitting" section we just added.

### 1.3 Validation behavior — **Impact ★★★ · Effort S**
Survey props: `checkErrorsMode` (onNextPage / onValueChanged / onComplete),
`questionErrorLocation` (top/bottom), `clearInvisibleValues` (none/onHidden/
onComplete), `focusOnFirstError`, `focusFirstQuestion`. A "Validation & behavior"
section in Form settings.

### 1.4 Field validators — **Impact ★★★ · Effort M**
Per-field `validators[]`: `numeric` (min/max), `text` (min/max length), `email`,
`regex` (pattern + message), `expression`, `answercount`. A small repeater in the
field panel (a "Validation" section next to Logic/Quiz). Highest-value field-level
gap after logic.

### 1.5 Field appearance & layout — **Impact ★★ · Effort M**
Per-field: `placeholder`, `titleLocation` (top/bottom/left/hidden),
`descriptionLocation`, `startWithNewLine` + `width`/`minWidth`/`maxWidth` (side-by-
side fields), `defaultValueExpression`, `requiredErrorText` (done). Turns the
single-column canvas into real multi-column layouts.

### 1.6 Navigation buttons control — **Impact ★★ · Effort S**
Survey `showNavigationButtons`, `showPrevButton`, `showCompleteButton`,
`goNextPageAutomatic`, `allowCompleteSurveyAutomatic`; page-level
`navigationButtonsVisibility` (inherit/show/hide). A "Navigation" refinement.

---

## Tier 2 — Power features (high value, larger builds)

### 2.1 Triggers & calculated values — **Impact ★★★ · Effort L**
Survey `triggers[]` (`complete`, `setvalue`, `copyvalue`, `runexpression`,
`skip`) and `calculatedValues[]` (named expressions usable in text piping and
logic). This is the single biggest capability jump — it turns static forms into
interactive flows. Needs a dedicated "Automation" editor, reusing the existing
`logic-expression` compiler for conditions.

### 2.2 More field types — **Impact ★★★ · Effort L (incremental)**
Add registry entries + card previews for: **matrix** (single-select grid),
**matrix dropdown/dynamic** (already preserved-and-locked; give them editors),
**panel** & **panel dynamic** (repeating groups), **ranking**, **image picker**,
**multiple text**, **tagbox** (multi-select dropdown), **expression** (read-only
computed display), **color**, **button group**. Each is one registry entry + one
preview — ship them one at a time by demand.

### 2.3 Theme / appearance editor — **Impact ★★★ · Effort L**
survey-core `theme` JSON: primary color, background, corner radius, font, density,
panel-less mode. A visual theme picker (swatches + a few presets) writing the
theme object the public renderer already accepts. Biggest visual-polish lever.

### 2.4 Welcome / start page — **Impact ★★ · Effort M**
`firstPageIsStarted` + `startSurveyText` — turn the first page into a landing
screen with a Start button. A toggle on page 1 plus the start-button label.

### 2.5 Table of contents & page navigation — **Impact ★★ · Effort M**
Survey `showTOC` + `tocLocation`; page `navigationTitle` / `navigationDescription`.
Useful for long multi-page forms.

### 2.6 Dynamic choices — **Impact ★★ · Effort M**
`choicesByUrl` (load options from a REST endpoint) and `choicesFromQuestion`
(carry-forward answers from an earlier question). Small UI, big data-driven payoff.

---

## Tier 3 — Workflow & scale (product maturity)

### 3.1 Translations management view — **Impact ★★ · Effort M–L**
A single grid of every localized string across the whole form × every locale, so
translators work in one place instead of field-by-field popovers. Reads/writes the
same `{default,<locale>}` objects we already store.

### 3.2 General undo / redo — **Impact ★★ · Effort M**
A full history stack for every edit (today only AI proposals are undoable).
Snapshot-based, reusing the existing `export()`/`replaceSchema()` plumbing.

### 3.3 Templates & question library — **Impact ★★ · Effort M**
Starter templates and a "save selection as reusable block" library. Duplicate an
entire form. Speeds up authoring for teams.

### 3.4 Page-level advanced — **Impact ★ · Effort S–M**
Page `readOnly` / `enableIf` / `requiredIf`, `maxWidth`, `questionTitleLocation`,
`timeLimit` / per-page timers, `questionStartIndex`. Round out the Page panel.

### 3.5 Survey-wide advanced — **Impact ★ · Effort S**
`questionTitlePattern` (where `*` / "(required)" render), `requiredText` (the
required marker), `maxTextLength`, `textUpdateMode`, `widthMode` / `width`,
`cookieName` (fill once), `questionsOrder` (survey-wide randomize). Low-frequency
but trivial to expose.

### 3.6 Version history & audit — **Impact ★ · Effort L**
Persist schema revisions with a diff/restore view. Depends on a DB revisions table;
larger backend piece.

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
