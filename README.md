# Formwright — a SurveyJS-compatible visual form builder for FilamentPHP

A drag-and-drop form builder that emits **plain SurveyJS JSON** and renders it with the
MIT-licensed `survey-core` engine — packaged as a Filament panel page, a public
fill-out flow, and a set of host-overridable contracts.

> **Independent & unaffiliated.** This project is not affiliated with, endorsed by, or
> sponsored by FilamentPHP, SurveyJS, or Devsoft Baltic OÜ. It does **not** bundle SurveyJS
> Creator, PDF Generator, or Dashboard. The only SurveyJS packages it ships are
> [`survey-core`](https://www.npmjs.com/package/survey-core) and
> [`survey-js-ui`](https://www.npmjs.com/package/survey-js-ui), both MIT-licensed. Your
> schemas are portable SurveyJS JSON — usable with any `survey-core` renderer.

---

## Table of contents

- [The licensing boundary](#the-licensing-boundary)
- [Features](#features)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Installation & setup](#installation--setup)
- [Building the front-end bundles](#building-the-front-end-bundles)
- [Usage](#usage)
- [The SurveyJS JSON contract](#the-surveyjs-json-contract)
- [Configuration](#configuration)
- [Extensibility contracts](#extensibility-contracts)
- [Data model](#data-model)
- [Testing](#testing)
- [Project structure](#project-structure)
- [Roadmap](#roadmap)

---

## The licensing boundary

This is the entire premise of the product, and it is a legal requirement, not a stylistic
one:

| Piece | Package(s) | License | Used here? |
|---|---|---|---|
| **Renderer** | `survey-core`, `survey-js-ui` | **MIT** | Yes — bundled and shipped |
| **Visual builder** | `survey-creator-*` | Proprietary (Devsoft EULA) | **Never.** Not installed, imported, bundled, or referenced. |

The builder UI (palette, canvas, property panel, logic editor, scoring, JSON editor) is
written **from scratch**. The only SurveyJS code in the product is the MIT renderer. A
build-time check should keep `survey-creator` out of `package.json` and the lockfile.

---

## Features

**Building**

- **13 visually-editable field types** — short answer (`text`), long answer (`comment`),
  number (`text`+`inputType:number`), date (`text`+`inputType:date`), single choice
  (`radiogroup`), multiple choice (`checkbox`), dropdown (`dropdown`), yes/no (`boolean`),
  rating (`rating`), statement (`html`), image (`image`), file upload (`file`), signature
  (`signaturepad`).
- **Preserve-and-lock** — any element type the builder doesn't fully understand
  (`matrixdynamic`, `paneldynamic`, `ranking`, …) is rendered as a read-only "advanced"
  card and passed through export **byte-for-byte**. The builder never corrupts a schema it
  doesn't understand.
- **Multi-page forms** with drag-to-reorder fields (within and across pages) and pages.
- **Drag-and-drop or click-to-add** from the palette (via `svelte-dnd-action`).
- **Raw JSON editor** — the schema is canonical; edits there drive the visual builder.

**Localization**

- Every user-facing string stored as SurveyJS `{ "default": "…", "ar": "…" }`.
- An "editing locale" switch controls which language your edits write to.
- **Automatic RTL** in preview for `ar`/`he`/`fa`/… — direction is derived from
  `survey.locale`, never hand-managed.

**Logic & scoring**

- **Visual conditional logic** — action (Show / Enable / Require) + match ALL/ANY + clauses
  (`question` `operator` `value`) compiling to `visibleIf` / `enableIf` / `requiredIf`.
- **Raw-expression escape hatch** — a hand-authored expression the visual model can't
  represent locks the visual editor and is preserved exactly.
- **Logic map** — a read-only dependency view ("question X depends on Y, Z").
- **Quiz scoring** — per-question `correctAnswer` + custom `points`, with a **live score
  tally** in preview.

**Preview & delivery**

- **Live preview** rendering the exact schema with `survey-core`, LTR and RTL.
- **Public fill-out** — open a form by slug (`/forms/{slug}?locale=`), submit responses,
  server-side required-field validation and scoring.
- **Extensibility contracts** the host app can rebind: runtime context, access policy, AI
  assistance, URL resolution, submission storage.

---

## Architecture

```
┌─ FilamentPHP panel (Laravel 13, PHP 8.4, Livewire v4) ──────────────────┐
│                                                                          │
│  DesignerPage (Filament page)  ◄── save/load ──►  FormSchema (Eloquent)  │
│      mounts a <div id="formwright-designer">                               │
│            │                                                             │
│            ▼                                                             │
│  BUILDER BUNDLE (Svelte 5 → IIFE)                                        │
│  Palette │ Canvas (dnd) │ Property panel │ Logic │ Scoring │ JSON │ Prev │
│            │ emits / imports                                             │
│            ▼        canonical SurveyJS JSON                              │
│  survey-core (MIT) ── preview & public render, auto-RTL from locale      │
└──────────────────────────────────────────────────────────────────────────┘

Public: GET/POST /forms/{slug} → PublicFormController → PUBLIC BUNDLE
        (window.FormwrightForm.mount) renders survey-core, POSTs on complete
```

**Key decisions**

- The builder is a self-mounting **Svelte 5** bundle compiled to a single IIFE that a
  Filament Blade page drops onto a `<div>`. The bundle is stateless about persistence — it
  calls `onSave(json)` back into Livewire via `$wire`.
- **The schema is the contract.** Palette, canvas, property panel, logic, scoring, JSON
  editor, and preview are all projections of one canonical SurveyJS JSON object. There is
  no proprietary intermediate format.
- The public renderer is a **separate, smaller bundle** so public pages don't ship the
  whole designer.

---

## Requirements

- PHP **8.4**, Composer 2
- Node **20+**, Vite
- A Laravel 13 app with a **Filament v5** panel already installed
- Key packages: `filament/filament ^5`, `laravel/framework ^13`, Livewire v4, Pest v4,
  `survey-core`/`survey-js-ui` `^1.12` (MIT), `svelte-dnd-action`, Svelte 5

---

## Installation & setup

This repository is a host Laravel app with the builder developed in-app. To get it running:

```bash
# 1. PHP + JS dependencies
composer install
npm install

# 2. App key, database
cp .env.example .env
php artisan key:generate
php artisan migrate

# 3. Seed an admin user (admin@example.com / password)
php artisan db:seed

# 4. Build the front-end bundles and publish the designer assets
npm run build:designer
npm run build:public
php artisan filament:assets
```

Log in at `/admin`, then open **Form Designer** in the navigation.

---

## Building the front-end bundles

There are two standalone builds, each a self-mounting IIFE, kept separate from the host
app's Inertia/Vite build:

| Command | Config | Output | Global |
|---|---|---|---|
| `npm run build:designer` | `vite.designer.config.ts` | `resources/js/builder/dist/` | `window.FormwrightDesigner` |
| `npm run build:public` | `vite.public.config.ts` | `public/vendor/formwright/` | `window.FormwrightForm` |

After building the **designer** bundle, run `php artisan filament:assets` to publish it into
`/public` (Filament serves it, lazily loaded only on the Designer page).

> If a front-end change isn't reflected, rebuild the relevant bundle (and re-run
> `filament:assets` for the designer) — the compiled bundle is what ships, not the source.

---

## Usage

### Designing a form

Open **Form Designer** (`/admin/designer-page`). Drag a field from the palette (or click it)
onto the canvas, select it to edit properties, add conditional **Logic** or **Scoring**,
switch the **editing locale** to author translations, and use the **Preview** tab to see the
rendered form (switch locale to preview RTL). The **JSON** tab always shows the canonical
schema and can drive the builder.

### Publishing a form

Every `FormSchema` has a unique `slug`. The public fill-out URL is:

```
/forms/{slug}?locale=ar
```

The page renders the schema with `survey-core`; on completion it POSTs the answers to
`/forms/{slug}`, which validates required fields, scores quizzes server-side, and stores a
`FormSubmission`.

Build a URL in PHP via the `UrlResolver` contract:

```php
app(\App\Contracts\UrlResolver::class)->publicFormUrl($schema, 'ar');
```

---

## The SurveyJS JSON contract

The builder produces and consumes exactly this shape:

```json
{
  "title": { "default": "Product Survey", "ar": "استبانة المنتج" },
  "locale": "default",
  "pages": [
    {
      "name": "page1",
      "elements": [
        { "type": "text", "name": "full_name",
          "title": { "default": "Full name" }, "isRequired": true },
        { "type": "dropdown", "name": "plan",
          "title": { "default": "Which plan?" },
          "choices": [
            { "value": "free", "text": { "default": "Free" } },
            { "value": "pro",  "text": { "default": "Pro" } }
          ],
          "visibleIf": "{full_name} notempty" },
        { "type": "rating", "name": "satisfaction",
          "title": { "default": "How satisfied are you?" },
          "rateMax": 5, "correctAnswer": 5, "points": 2 }
      ]
    }
  ]
}
```

| Palette label | `type` | Extra props |
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

- **Localized strings** are `{ default, <locale> }`; `survey-core` reads `survey.locale` and
  falls back to `default`.
- **Conditional logic** compiles to string expressions — ALL joins with `and`, ANY with `or`
  (e.g. `"{age} > 18 and {country} = 'US'"`).
- **Scoring** uses native `correctAnswer` plus a custom `points` property registered via
  `Serializer.addProperty`.

---

## Configuration

`config/formbuilder.php`:

```php
return [
    'models' => [
        'form_schema'     => App\Models\FormSchema::class,
        'form_submission' => App\Models\FormSubmission::class,
    ],
    'tables' => [
        'form_schemas'     => 'form_schemas',
        'form_submissions' => 'form_submissions',
    ],
    'disk' => env('FORMBUILDER_DISK', 'public'),

    'default_locale' => 'default',
    'rtl_locales'    => ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'dv'],

    'survey_core_version' => '1.12.63',

    'routes' => [
        'enabled'    => true,
        'prefix'     => 'forms',
        'middleware' => ['web'],
    ],
];
```

Model classes, table names, storage disk, the public route prefix/middleware, and the pinned
renderer version are all config-driven. Set `routes.enabled` to `false` to register no public
routes (e.g. if the host renders forms itself).

### Multi-tenancy

When `tenancy.enabled` is true, `FormSchema` and `FormSubmission` are automatically scoped to
the current tenant — SELECTs are filtered by the `tenancy.column` and new records are stamped
with the current tenant id. The current tenant is resolved from the `RuntimeContext` (the
Filament panel tenant by default), or you can override resolution:

```php
use App\Support\Tenancy;

Tenancy::resolveUsing(fn () => auth()->user()?->current_team_id);
```

Cross-tenant/admin queries use the standard escape hatch:

```php
FormSchema::withoutGlobalScope('tenant')->get();
```

The tenant column is added by a migration and stays nullable, so nothing changes while
tenancy is disabled.

---

## Extensibility contracts

Five seams, each bound to a sensible default in `AppServiceProvider::register()`. A host app
rebinds any of them in its own service provider:

```php
$this->app->bind(\App\Contracts\AccessPolicy::class, MyAccessPolicy::class);
```

| Contract | Default | Purpose |
|---|---|---|
| `RuntimeContext` | `DefaultRuntimeContext` | current user, Filament tenant, locale |
| `AccessPolicy` | `DefaultAccessPolicy` | can view / edit / submit a schema |
| `SubmissionStore` | `EloquentSubmissionStore` | persist & retrieve submissions |
| `UrlResolver` | `DefaultUrlResolver` | build public/asset URLs |
| `AiAssistant` | `NullAiAssistant` | draft/rewrite a form or field (opt-in) |

**Access policy** — the public controller calls `canView` (on render) and `canSubmit` (on
submit); denying either returns `403`:

```php
class MyAccessPolicy extends App\Support\DefaultAccessPolicy
{
    public function canSubmit(App\Models\FormSchema $schema, $user): bool
    {
        return (bool) ($schema->json['published'] ?? false);
    }
}
```

**Submission store** — swap where responses go without touching the package:

```php
class WarehouseSubmissionStore implements App\Contracts\SubmissionStore { /* … */ }
$this->app->bind(App\Contracts\SubmissionStore::class, WarehouseSubmissionStore::class);
```

**AI assistant** — bound to `NullAiAssistant` by default (throws
`AiAssistantNotConfiguredException`). Set `ai.enabled` + an `ANTHROPIC_API_KEY` and the
contract resolves to the bundled **`ClaudeAiAssistant`** (Claude via Laravel's HTTP client —
no extra SDK dependency). `draftForm(string $prompt)` and
`rewriteField(array $element, string $prompt)` return SurveyJS JSON that callers treat as a
*proposal* and confirm before applying. In the builder, the **AI** bar drafts a form from a
description, previews it, and applies it with a one-click **Undo**. A host can rebind the
contract to any other provider:

```php
$this->app->bind(App\Contracts\AiAssistant::class, MyOpenAiAssistant::class);
```

```php
// config/formbuilder.php → 'ai'
'ai' => [
    'enabled'  => env('FORMBUILDER_AI', false),
    'api_key'  => env('ANTHROPIC_API_KEY'),
    'model'    => env('FORMBUILDER_AI_MODEL', 'claude-opus-4-8'),
],
```

---

## Data model

**`FormSchema`** — `id`, `name`, `slug` (unique, auto-generated), `json` (SurveyJS survey),
`default_locale`, `available_locales` (json), `scoring_enabled` (derived on save from the
presence of any `correctAnswer`), timestamps.

**`FormSubmission`** — `id`, `form_schema_id` (FK), `locale`, `data` (json), `score`
(nullable), timestamps. `belongsTo` a `FormSchema`.

Both resolve their table names from config and ship factories.

---

## Testing

The suite is [Pest](https://pestphp.com), including **Pest 4 real-browser tests**
(Playwright/Chromium) that drive the actual Svelte UI.

```bash
php artisan test                    # everything (feature + unit + browser)
php artisan test tests/Feature      # PHP only (fast)
php artisan test tests/Browser/BuilderTest.php
```

Coverage includes: schema validation (accepts unknown types, rejects malformed), the
JS↔Livewire↔DB round-trip, drag-add / property editing / preserve-and-lock / JSON-drives-
visual / keyboard drag-reorder, live multilingual preview with auto-RTL, the logic-expression
compiler and escape hatch, quiz scoring with a live preview tally, the public fill-out flow
end-to-end (render → complete → stored submission), the submission evaluator, and the
extensibility contracts (defaults resolve, rebinding denies submit → 403).

> **Browser-test notes.** Target `[data-block-id]` / `data-testid` rather than button text
> (palette buttons carry an icon prefix). Drag-reorder is driven through `svelte-dnd-action`'s
> keyboard a11y (`Space`/arrows), because Playwright's native drag events don't map to
> pointer-based DnD.

---

## Project structure

```
app/
├── Contracts/                 # RuntimeContext, AccessPolicy, AiAssistant, UrlResolver, SubmissionStore
├── Filament/Pages/DesignerPage.php
├── Http/Controllers/PublicFormController.php
├── Models/{FormSchema,FormSubmission}.php
└── Support/                   # SchemaValidator, SubmissionEvaluator, default contract impls
config/formbuilder.php
resources/
├── js/
│   ├── schema/                # type-registry.ts, logic-expression.ts (framework-agnostic)
│   ├── builder/               # Svelte builder bundle
│   │   ├── main.ts            # window.FormwrightDesigner.mount
│   │   ├── App.svelte, store.svelte.ts, dnd.ts, survey-setup.ts
│   │   └── lib/               # Palette, Canvas, ElementCard, PropertyPanel,
│   │                          #   LogicEditor, LogicMap, ScoringEditor, Preview, JsonEditor
│   └── public/main.ts         # window.FormwrightForm.mount
└── views/
    ├── filament/pages/designer-page.blade.php
    └── public/form.blade.php
vite.designer.config.ts        # builder IIFE
vite.public.config.ts          # public IIFE
tests/{Feature,Unit,Browser}/
```

---

## Roadmap

Built and tested (guide milestones M1–M5):

- **M1** — package skeleton, `FormSchema` + persistence + validator, Designer page, JS↔DB round-trip
- **M2** — the visual builder: palette, canvas drag-drop, property panel, preserve-and-lock, JSON editor
- **M3** — `survey-core` live preview, i18n editing locale, automatic RTL
- **M4** — conditional-logic builder (+ logic map, escape hatch) and quiz scoring (+ live tally)
- **M5** — public fill-out + submissions, the five extensibility contracts, and multi-tenancy
  (auto-scoping of `FormSchema`/`FormSubmission` with isolation tests)
- **M6** — the Claude-backed `AiAssistant`: describe a form in plain language to draft it
  (or rewrite a field), previewed with an explicit apply / discard / undo step

All planned phases (0–11) are built and tested.
```
