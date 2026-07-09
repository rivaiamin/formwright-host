<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('renders the live schema with survey-core in the Preview tab', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')       // add a field (auto-selected)
        ->fill('#prop-title', 'Full name')
        ->click('Preview')
        ->assertSee('Full name')                        // survey-core rendered the question
        ->assertPresent('[data-preview-dir="ltr"]')
        ->assertNoJavaScriptErrors();
});

it('authors a field in en + ar and round-trips both locales', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')
        ->fill('#prop-title', 'Full name')               // default locale
        ->fill('.sv-loc__add', 'ar')                     // add + switch editing locale
        ->keys('.sv-loc__add', ['Enter'])
        ->fill('#prop-title', 'الاسم الكامل')             // writes into ar
        ->click('Save')
        ->assertSee('Saved');

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($el['title'])->toMatchArray([
        'default' => 'Full name',
        'ar' => 'الاسم الكامل',
    ]);
});

it('auto-flips the preview to RTL for an Arabic locale', function () {
    $arabic = [
        'title' => ['default' => 'RTL demo'],
        'pages' => [[
            'name' => 'page1',
            'elements' => [
                ['type' => 'text', 'name' => 'q1', 'title' => ['default' => 'Name', 'ar' => 'الاسم']],
            ],
        ]],
    ];

    FormSchema::factory()->create(['json' => $arabic, 'available_locales' => ['default', 'ar']]);

    $page = visit('/admin/designer-page');

    $page->click('Preview')
        ->assertPresent('[data-preview-dir="ltr"]')      // default is LTR
        ->select('.preview__loc select', 'ar')           // switch preview to Arabic
        ->assertPresent('[data-preview-dir="rtl"]')      // direction derived from locale
        ->assertSee('الاسم')                              // Arabic label rendered
        ->assertNoJavaScriptErrors();
});
