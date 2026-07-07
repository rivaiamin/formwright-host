# Building a SurveyJS-Compatible Visual Form Builder for FilamentPHP (a Schemava-style plugin) with Claude Code

A complete, phased build guide. This is the plan you hand to Claude Code — and to yourself.

---

## 0. Read this first: what you are actually building (and the licensing trap)

You are **not** cloning *SurveyJS Creator*. You are building your **own** drag-and-drop builder that emits **SurveyJS-compatible JSON**, and rendering that JSON with the **MIT-licensed `survey-core`** engine. This distinction is the entire product, and it is a legal requirement, not a stylistic choice.

| Library | Package | License | Can you use it? |
|---|---|---|---|
| Renderer (Form Library) | `survey-core`, `survey-js-ui` (or `survey-react-ui` / `survey-vue3-ui`) | **MIT** | Yes — bundle and ship freely, including commercially |
| Visual builder | `survey-creator-core`, `survey-creator-react` | **Proprietary (Devsoft Baltic EULA)** | **No.** The EULA forbids using any part of it "to create any tool, redistributable, or product that directly or indirectly competes." Do not install it, do not read its source for your builder, do not bundle it. |

**Consequence for your architecture:** the builder UI (palette, canvas, drag-drop, property panel, logic map) is code *you write from scratch*. The only SurveyJS code in your product is the MIT renderer. This is exactly the boundary Schemava draws when it says it "does not bundle SurveyJS Creator." Respect it and you have a clean, sellable product. Ignore it and you have a legal liability.

**Scope honesty:** this is a multi-week project, not a weekend. The genuinely hard part is the JS builder (Phase 3–7), not the Laravel/Filament plumbing. Budget your effort accordingly. Everything below is sequenced so you always have a working, demoable slice.

---

## 1. Target feature set (the Schemava parity checklist)

Build toward this. Ship in the order given in the phases, not this list.

- **13 visually-editable field types:** short answer (`text`), long answer (`comment`), number (`text`+`inputType:number`), date (`text`+`inputType:date`), single choice (`radiogroup`), multiple choice (`checkbox`), dropdown (`dropdown`), yes/no (`boolean`), rating (`rating`), statement (`html`), image (`image`), file upload (`file`), signature (`signaturepad`).
- **Preserve-but-lock advanced types:** `matrix`, `matrixdropdown`, `matrixdynamic`, `paneldynamic`, `panel`, `ranking`, `tagbox`, `imagepicker`, `multipletext`, `expression`. If they exist in imported JSON, keep them byte-for-byte and make them read-only in the visual editor (editable only via the raw JSON panel). Your builder must **never corrupt a schema it doesn't fully understand.**
- **Multi-page forms** with drag-to-reorder fields *and* pages.
- **First-class i18n:** every label stored as SurveyJS `{ "default": "...", "ar": "...", "fr": "..." }`. Direction (RTL/LTR) derived automatically from the active locale.
- **Conditional logic builder:** visual match-*all* / match-*any* rules compiling to `visibleIf` / `enableIf`, plus a raw-expression escape hatch, plus a "logic map" view of dependencies.
- **Quiz scoring:** per-question `correctAnswer` + points, live score tally in preview.
- **Live preview** that renders the exact schema with `survey-core`, LTR and RTL.
- **Raw JSON editor** always one click away.
- **Filament integration:** Composer package that registers with a panel, ships an asset bundle + a standalone designer page.
- **Extensibility contracts** (interfaces the host app can bind): runtime context, access rules, AI assistance, URL resolution, submission storage.
- **Multi-tenant ready:** configurable models, table names, storage disk, renderer version, routes.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ FilamentPHP Panel (Laravel 11/12, PHP 8.3+, Livewire v4)     │
│                                                               │
│  ┌────────────────────┐        ┌──────────────────────────┐  │
│  │ Designer Page       │       │ Eloquent: FormSchema      │  │
│  │ (Filament Page)     │◄─────► │  - json (SurveyJS schema) │  │
│  │  renders <div id>   │ save   │  - locale metadata        │  │
│  └─────────┬──────────┘  load   │  - scoring config         │  │
│            │ mount                └──────────────────────────┘  │
│            ▼                                                    │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  YOUR BUILDER BUNDLE  (React OR Vue, compiled to IIFE) │    │
│  │  ────────────────────────────────────────────────     │    │
│  │  Palette │ Canvas (dnd) │ Property Panel │ Logic │ JSON │    │
│  │                                                        │    │
│  │  emits/imports  ──►  SurveyJS-compatible JSON          │    │
│  └───────────────┬──────────────────────────────────────┘    │
│                  │ same JSON                                   │
│                  ▼                                             │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  PREVIEW / PUBLIC RENDER  (survey-core, MIT)          │    │
│  │  survey.locale = 'ar' → auto RTL                      │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Key decisions, with rationale:**

1. **Framework for the builder: React (recommended) or Vue 3.** A drag-drop builder with property panels, a logic map, and multi-page reordering is too much state for Alpine.js to carry comfortably. Compile it to a single self-mounting bundle (Vite → IIFE/UMD) that a Filament page drops onto a `<div id="schemava-designer">`. This mirrors how Schemava ships "an asset bundle and a standalone designer page."
2. **Drag-and-drop library:** `@dnd-kit/core` (React) or `vuedraggable`/`@vueuse/integrations` (Vue). Do **not** reach for SurveyJS Creator's dnd.
3. **State ↔ Laravel bridge:** the bundle exposes `window.SchemavaDesigner.mount(el, { schema, locales, onSave })`. `onSave(json)` calls a Livewire method (`$wire.saveSchema(json)`). Keep the JS stateless about persistence; Laravel owns the database.
4. **Renderer:** `survey-core` + `survey-js-ui` (vanilla) for preview and for the public fill-out page. Vanilla keeps the render bundle framework-agnostic and small; you can swap to `survey-react-ui` if your builder is React and you want to share deps.
5. **Schema is the contract.** Everything — builder, preview, public render, export — round-trips through one canonical SurveyJS JSON object. Never invent a proprietary intermediate format; that's the anti-lock-in selling point.

---

## 3. The SurveyJS JSON you must emit

Internalize this shape — your builder's job is to produce and consume exactly this.

```json
{
  "title": { "default": "Product Experience Survey", "ar": "استبانة تجربة المنتج" },
  "locale": "default",
  "pages": [
    {
      "name": "page1",
      "title": { "default": "About you", "ar": "نبذة عنك" },
      "elements": [
        { "type": "html", "name": "intro", "html": { "default": "👋 Welcome!" } },
        { "type": "text", "name": "full_name",
          "title": { "default": "Full name", "ar": "الاسم الكامل" }, "isRequired": true },
        { "type": "text", "name": "work_email", "inputType": "email",
          "title": { "default": "Work email" }, "isRequired": true },
        { "type": "dropdown", "name": "plan",
          "title": { "default": "Which plan are you on?" },
          "choices": [
            { "value": "free",  "text": { "default": "Free" } },
            { "value": "pro",   "text": { "default": "Pro" } }
          ],
          "visibleIf": "{full_name} notempty" },
        { "type": "rating", "name": "satisfaction",
          "title": { "default": "Overall, how satisfied are you?" },
          "rateMax": 5, "isRequired": true }
      ]
    }
  ]
}
```

**Type mapping table** (drive your palette + property panel from this):

| Palette label | SurveyJS `type` | Extra props you set |
|---|---|---|
| Short answer | `text` | — |
| Long answer | `comment` | — |
| Number | `text` | `inputType: "number"` |
| Date | `text` | `inputType: "date"` |
| Single choice | `radiogroup` | `choices[]` |
| Multiple choice | `checkbox` | `choices[]` |
| Dropdown | `dropdown` | `choices[]` |
| Yes / No | `boolean` | `labelTrue`, `labelFalse` |
| Rating | `rating` | `rateMax`, `rateType` |
| Statement | `html` | `html` (localized) |
| Image | `image` | `imageLink` |
| File upload | `file` | `acceptedTypes`, `maxSize` |
| Signature | `signaturepad` | `penColor` |

**Localized strings:** any user-facing string becomes `{ default, <locale> }`. survey-core reads `survey.locale` and picks the right value, falling back to `default`.

**RTL:** survey-core flips direction automatically for RTL locales (`ar`, `he`, `fa`, `ur`, …) when you set `survey.locale`. You do **not** hand-manage `dir`; you set the locale and let the engine + its locale registry decide.

**Scoring:** `correctAnswer` is a native survey-core property. Points are not native — add a custom property (`Serializer.addProperty("question", { name: "points:number", default: 1 })`) and compute the tally yourself in preview.

**Conditional logic:** compiles to string expressions in `visibleIf` / `enableIf` / `requiredIf`, e.g. `"{age} > 18 and {country} = 'US'"`. Match-*all* joins clauses with `and`, match-*any* with `or`.

---

## 4. Prerequisites

- PHP 8.3+, Composer 2
- Node 20+, and a bundler (Vite)
- A Laravel 11/12 app with a Filament v5 panel already installed and logging in
- **Claude Code** installed and authenticated
- Recommended: **Laravel Boost / Filament Blueprint**. Filament ships an AI-agent aid ("Blueprint") specifically so coding agents produce accurate Filament plans instead of vague ones. Install it in your host app before you point Claude Code at Filament work — it materially improves the output for panel/page/resource scaffolding.

---

## 5. Repository layout

Develop the plugin as its own Composer package, symlinked into a host app for testing.

```
schemava-clone/                     # the package (your product)
├── composer.json                   # name: yourvendor/formbuilder
├── src/
│   ├── FormBuilderPlugin.php        # Filament plugin entry
│   ├── FormBuilderServiceProvider.php
│   ├── Filament/Pages/DesignerPage.php
│   ├── Livewire/DesignerComponent.php
│   ├── Models/FormSchema.php
│   ├── Models/FormSubmission.php
│   ├── Contracts/                   # host-overridable interfaces
│   │   ├── RuntimeContext.php
│   │   ├── AccessPolicy.php
│   │   ├── AiAssistant.php
│   │   ├── UrlResolver.php
│   │   └── SubmissionStore.php
│   ├── Support/SchemaValidator.php   # server-side SurveyJS JSON validation
│   └── Config/formbuilder.php
├── database/migrations/
├── resources/
│   ├── views/pages/designer.blade.php
│   └── js/                          # THE BUILDER (React/Vue source)
│       ├── main.tsx                 # exposes window.SchemavaDesigner.mount
│       ├── builder/                 # palette, canvas, property panel, logic map
│       ├── render/                  # survey-core preview wrapper
│       └── schema/                  # type registry, import/export, validation
├── dist/                            # compiled bundle (shipped)
├── vite.config.ts
├── package.json
└── CLAUDE.md                        # project brief for Claude Code (see §7)
```

---

## 6. Phased build plan

Each phase ends with something you can see working. Do them in order. For each phase I give the goal, the deliverable, and a **Claude Code prompt** you can paste (edit the vendor name). Run Claude Code in **plan mode first** for anything non-trivial — let it propose, you approve, then it executes.

### Phase 0 — Package scaffold + host wiring

**Goal:** empty plugin registers on a Filament panel and shows a blank "Designer" page.

**Deliverable:** `composer require` (path repo) works; a nav item appears; page loads.

> **Claude Code prompt:**
> "Create a Laravel package `yourvendor/formbuilder` targeting Filament v5, Laravel 11/12, PHP 8.3+. Include: a `composer.json` with PSR-4 autoloading and a package discovery service provider; a `FormBuilderServiceProvider` that publishes config and migrations and registers a Livewire component; a `FormBuilderPlugin` implementing Filament's `Plugin` contract that registers a `DesignerPage` (a custom Filament Page, not a Resource); and a Blade view for the page that renders an empty `<div id=\"schemava-designer\">`. Also set up a sibling Laravel host app that installs this package via a path repository and registers the plugin on its admin panel. Verify the nav item and blank page render. Follow current Filament v5 plugin conventions."

### Phase 1 — Data model + persistence

**Goal:** store and load a SurveyJS JSON schema.

**Deliverable:** `form_schemas` table (`id`, `name`, `slug`, `json` (JSON column), `default_locale`, `available_locales` (JSON), `scoring_enabled`, timestamps, tenant FK if applicable). Livewire `saveSchema(array $json)` / `loadSchema()` methods with server-side validation.

> **Claude Code prompt:**
> "Add a `FormSchema` Eloquent model + migration storing a SurveyJS-style schema in a `json` column, plus `default_locale`, `available_locales`, and `scoring_enabled`. Add a `SchemaValidator` service that validates incoming JSON is a well-formed SurveyJS survey (has `pages`, each element has `type`+`name`, names are unique) and rejects anything malformed with clear errors. Wire the `DesignerComponent` Livewire class with `saveSchema` and `loadSchema` methods that use the validator. Make model class, table names, and storage disk all configurable via `config/formbuilder.php`. Add feature tests for save/load and validation rejection."

### Phase 2 — Builder shell + Laravel bridge

**Goal:** the JS bundle mounts, receives the schema from Livewire, and can hand a schema back to be saved. No editing features yet — just the round-trip.

**Deliverable:** `resources/js/main.tsx` exposing `window.SchemavaDesigner.mount(el, { schema, locales, onSave, onDirty })`; Vite config compiling to a single IIFE in `dist/`; the Filament page loads the bundle and passes initial schema + a `$wire`-backed `onSave`. Register assets with Filament's asset system so `php artisan filament:assets` publishes them.

> **Claude Code prompt:**
> "Set up a Vite build in `resources/js` (React + TypeScript) that compiles to a single self-executing bundle in `dist/`. Expose `window.SchemavaDesigner = { mount(el, opts) }` where opts = `{ schema, locales, defaultLocale, onSave, onDirty }`. In the Filament page's Blade view, register the compiled JS/CSS through Filament's asset registration (so `filament:assets` publishes them), read the schema from the Livewire component, mount the designer, and wire `onSave(json)` to call a Livewire `saveSchema` action via `$wire`. For now the React app just shows the schema JSON in a `<pre>` and has a Save button that echoes it back. Confirm the full JS→Livewire→DB→JS round-trip works."

### Phase 3 — The builder core (the hard part)

Build this as sub-phases; don't try to one-shot it.

**3a. Type registry + palette.** A single source of truth mapping the 13 types to: icon, label, default element JSON, and which properties appear in the panel. Palette renders from the registry.

**3b. Canvas + drag-drop.** Render pages and their elements. Drag from palette → insert element. Reorder elements within/across pages. Drag pages to reorder. Use `@dnd-kit`. Every mutation edits the canonical JSON object in state.

**3c. Property panel.** Select an element → edit its props (name, required, choices, type-specific props) bound to the registry. Editing writes back to the JSON.

**3d. Preserve-and-lock.** On import, any element whose `type` is not one of the 13 known types is rendered in the canvas as a locked card ("Advanced type — edit in JSON") and passed through export untouched. This is a headline feature; test it with a schema containing a `matrixdynamic`.

**3e. Raw JSON editor.** A Monaco/CodeMirror panel showing live JSON; edits validate and sync back to the visual state (and vice versa).

> **Claude Code prompt (run once per sub-phase):**
> "Implement [3a: the type registry and palette]. The registry is the single source of truth: for each of the 13 supported types (text, comment, text+number, text+date, radiogroup, checkbox, dropdown, boolean, rating, html, image, file, signaturepad) define an icon, a label, a factory that returns default SurveyJS element JSON, and a list of editable property descriptors. The palette renders from this registry. Keep everything typed. Do not use any `survey-creator` package — build the UI from scratch with @dnd-kit for later drag support. Show me the registry design before building the panel."

Repeat, advancing the bracketed goal to 3b, 3c, 3d, 3e. **Insist Claude Code never installs `survey-creator-*`.** Put that rule in `CLAUDE.md` (see §7).

### Phase 4 — Preview / render with survey-core (MIT)

**Goal:** a Preview tab renders the current schema exactly as end users will see it.

**Deliverable:** `resources/js/render/` wraps `survey-core` + `survey-js-ui`. Preview reads the live JSON, builds a `Model`, and renders. A locale switcher sets `survey.locale`.

> **Claude Code prompt:**
> "Add a Preview mode using the MIT-licensed `survey-core` and `survey-js-ui` packages only. Given the builder's current JSON, construct a survey Model and render it live. Add a locale dropdown that sets `survey.locale`. Handle re-render on schema change without leaking survey instances. Do not add `survey-creator`."

### Phase 5 — i18n + automatic RTL

**Goal:** author any string in any locale; direction flips automatically.

**Deliverable:** every property-panel string input becomes locale-aware, writing `{ default, <locale> }`. An active-locale switch in the builder toolbar controls which locale you're editing. Preview in an RTL locale (e.g. `ar`) auto-flips because survey-core derives direction from its locale registry. Add per-locale renderer-string overrides via `survey.locale` + `surveyLocalization`.

> **Claude Code prompt:**
> "Make all user-facing strings in the property panel locale-aware, stored as SurveyJS `{default, <locale>}` objects. Add an 'editing locale' switch that determines which locale a string input writes to, always keeping `default`. Ensure export produces valid multilingual SurveyJS JSON. In Preview, switching to an RTL locale (ar/he/fa) must automatically render RTL via survey-core's locale handling — do not manually set `dir`. Add tests that a form authored in en+ar round-trips and renders both directions."

### Phase 6 — Conditional logic builder

**Goal:** visual rules → `visibleIf` / `enableIf`; plus a logic map.

**Deliverable:** per-element logic tab: choose action (show/hide/enable/disable), match *all* or *any*, add clauses (`question` `operator` `value`). Compile to a SurveyJS expression string. A raw-expression field for power users. A "logic map" view listing which questions depend on which.

> **Claude Code prompt:**
> "Add a conditional-logic builder per element. UI: action (show/hide/enable/disable), match ALL or ANY, and a list of clauses (referenced question, operator [=, !=, >, <, contains, empty, notempty], value). Compile ALL→`and`, ANY→`or` into a SurveyJS expression written to `visibleIf` or `enableIf`. Provide a raw-expression escape hatch that, when used, disables the visual editor for that field to avoid clobbering. Add a read-only 'logic map' panel that parses all expressions and lists dependencies (question X depends on Y, Z). Unit-test the expression compiler thoroughly, including nested values and string escaping."

### Phase 7 — Quiz scoring

**Goal:** mark questions scored, set correct answer + points, live tally in preview.

**Deliverable:** register a custom `points` property via `Serializer.addProperty`; property panel exposes "scored?", correct answer, and points for supported types; preview computes and displays a running score using `correctAnswer` + points.

> **Claude Code prompt:**
> "Add quiz scoring. Register a custom numeric `points` property on questions via survey-core `Serializer.addProperty`. In the property panel, for choice/boolean/text types, expose a 'scored' toggle, a correct-answer picker (native `correctAnswer`), and a points input. In Preview, compute a live score as the user answers, comparing responses to `correctAnswer` and summing points. Persist `scoring_enabled` on the schema. Keep the JSON valid SurveyJS (custom property serializes cleanly)."

### Phase 8 — Public fill-out + submission storage

**Goal:** end users can open a form by slug/locale, fill it, and submit.

**Deliverable:** a public route (configurable) rendering the schema with survey-core; a `FormSubmission` model; a `SubmissionStore` contract with a default DB implementation the host can rebind.

> **Claude Code prompt:**
> "Add a public form-render route (path configurable in `config/formbuilder.php`) that loads a `FormSchema` by slug + `?locale=`, renders with survey-core, and posts responses to a controller. Add a `FormSubmission` model and a `SubmissionStore` contract with a default Eloquent implementation bound in the service provider, so a host app can swap storage. Validate submissions server-side against the schema's required fields. Tests for submit + retrieve."

### Phase 9 — Extensibility contracts

**Goal:** the "extensible by design" selling point.

**Deliverable:** interfaces `RuntimeContext`, `AccessPolicy`, `AiAssistant`, `UrlResolver`, `SubmissionStore`, each bound to a sensible default in the service provider and documented as host-overridable.

> **Claude Code prompt:**
> "Define these contracts and bind default implementations that a host app can override via the container: `RuntimeContext` (current user/tenant/locale), `AccessPolicy` (can view/edit/submit a schema), `AiAssistant` (draft/rewrite a form or field from a prompt — default is a no-op that throws 'not configured'), `UrlResolver` (build public/asset URLs), `SubmissionStore`. Document each with a short doc-block and a README section showing how a host rebinds it."

### Phase 10 — Multi-tenancy + config hardening

**Goal:** nothing hard-wired to one app.

**Deliverable:** confirm model classes, table names, storage disk, renderer/survey-core version, and all routes are config-driven; add a tenant scope to schemas/submissions when Filament tenancy is enabled.

> **Claude Code prompt:**
> "Audit the package for hard-coded assumptions. Make model classes, table names, storage disk, public/route prefixes, and the pinned survey-core version all configurable in `config/formbuilder.php`. When the host Filament panel uses tenancy, scope `FormSchema` and `FormSubmission` to the current tenant automatically. Add tests covering tenant isolation."

### Phase 11 (optional) — AI form assistant

The Schemava feature: describe a form in plain language → draft it; or rewrite the selected field. Because you defined the `AiAssistant` contract in Phase 9, this is additive: a default implementation calls an LLM (the host supplies the provider/key), returns a proposed schema diff, and the builder shows a preview with apply/discard/undo. Keep the proposal step explicit — never mutate the user's schema without a confirm.

---

## 7. Working with Claude Code effectively

A `CLAUDE.md` at the repo root is the highest-leverage thing you can do. Claude Code reads it automatically. Put the non-negotiables there so every session inherits them:

```markdown
# Project: SurveyJS-compatible form builder for FilamentPHP

## Hard rules (never violate)
- NEVER install, import, bundle, or copy from `survey-creator`,
  `survey-creator-core`, or `survey-creator-react`. It is proprietary
  and forbidden for building a competing tool. The ONLY SurveyJS
  packages allowed are `survey-core` and `survey-js-ui` (both MIT).
- The canonical data format is SurveyJS survey JSON. Never introduce a
  proprietary intermediate format.
- Unknown element types must be preserved byte-for-byte on import/export
  and locked (not silently dropped or rewritten).

## Stack
- Filament v5, Laravel 11/12, PHP 8.3+, Livewire v4.
- Builder: React + TypeScript, compiled by Vite to a single IIFE in dist/.
- Renderer: survey-core + survey-js-ui only.

## Conventions
- All user-facing strings are localized `{default, <locale>}` objects.
- Run `php artisan test` and the JS test suite before declaring a phase done.
- Prefer small PRs per sub-phase; show a plan before large changes.
```

Practical workflow tips:

- **Plan mode first.** For every phase above, have Claude Code produce a plan and review it before it writes code. The phases are already small; keep them that way.
- **One phase per session** keeps context focused and reviews tractable. Commit at each phase boundary.
- **Feed it the real docs.** Point it at the current Filament v5 docs and the survey-core docs rather than relying on training memory — Filament and SurveyJS both move fast. Installing **Filament Blueprint / Laravel Boost** in the host app specifically improves agent output for Filament scaffolding.
- **Make it test the hard parts.** The expression compiler (Phase 6), the preserve-and-lock behavior (Phase 3d), and the multilingual round-trip (Phase 5) are where silent bugs hide. Demand unit tests there.
- **Guard the licensing rule in CI.** Add a check that fails the build if `survey-creator` appears in `package.json` or the lockfile. Ask Claude Code to write it.

---

## 8. The genuinely hard parts (where to slow down)

1. **Bidirectional visual ↔ JSON sync.** Editing in the panel and editing raw JSON must not fight. Make the JSON object the single source of truth; both views are projections of it. Debounce and validate on the JSON→visual direction.
2. **Preserve-and-lock.** The moment your builder rewrites a schema it doesn't fully understand, you've broken the "no lock-in / never corrupts" promise that justifies the product. Treat unknown types as opaque payloads.
3. **RTL correctness.** Don't hand-roll direction. Set `survey.locale` and let survey-core's locale registry drive it; test with a real Arabic form, not lorem ipsum.
4. **Expression compiler + parser.** Compiling visual rules to expressions is easy to get 80% right and hard to get correct (escaping, operator coverage, empty/notempty, round-tripping an existing expression back into the visual builder). Consider making the visual→expression direction one-way and locking the visual editor once someone hand-edits the raw expression (as noted in Phase 6).
5. **Bundle mounting lifecycle.** Livewire re-renders can wipe your mount node. Guard against double-mounts and clean up survey-core instances on unmount to avoid leaks.

---

## 9. Suggested milestone cadence

| Milestone | Phases | You can demo… |
|---|---|---|
| M1 — Skeleton | 0–2 | Plugin loads, schema round-trips JS↔DB |
| M2 — Editable builder | 3 | Drag-drop building of the 13 types + JSON panel |
| M3 — Renders | 4–5 | Live multilingual preview, auto-RTL |
| M4 — Logic & scoring | 6–7 | Conditional forms + quizzes |
| M5 — Product | 8–10 | Public forms, submissions, contracts, multi-tenant |
| M6 — Polish | 11 | AI assistant, theming, docs |

Ship M1–M3 before worrying about anything in M5. A builder that visually produces valid, multilingual, correctly-rendering SurveyJS JSON is already the core of the product.

---

## 10. Licensing & positioning reminders (put these in your own site/README)

- State plainly that your product is independent and **not** affiliated with or endorsed by FilamentPHP, SurveyJS, or Devsoft Baltic OÜ (Schemava does exactly this — follow suit).
- State that you **do not** include or bundle SurveyJS Creator, PDF Generator, or Dashboard.
- Your schemas are plain SurveyJS JSON, portable to any `survey-core` renderer — that portability is the anti-lock-in pitch; lean on it.
- Verify the survey-core license text ships with your distribution (MIT attribution).

---

*Build order is the whole game: keep a working slice at every step, keep the JSON canonical, keep Survey Creator out of the repo, and let Claude Code work one small phase at a time.*
