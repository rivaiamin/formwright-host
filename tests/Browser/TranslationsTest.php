<?php

use App\Models\FormSchema;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('translates a field label through the translations grid', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')
        ->fill('#prop-title', 'Name')                     // default locale
        ->fill('.sv-loc__add', 'fr')
        ->keys('.sv-loc__add', ['Enter'])                 // add the fr locale
        ->click('[data-testid="tab-translations"]')
        ->assertPresent('[data-testid="translations-table"]')
        ->fill('[data-testid="tr-pages.0.elements.0.title-fr"]', 'Nom')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $title = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0]['title'];

    expect($title['default'])->toBe('Name')
        ->and($title['fr'])->toBe('Nom');
});

it('discovers nested translatable strings such as choice labels', function () {
    $schema = FormSchema::factory()->create([
        'json' => [
            'title' => ['default' => 'My form'],
            'pages' => [['name' => 'page1', 'elements' => [
                ['type' => 'radiogroup', 'name' => 'colour', 'title' => ['default' => 'Colour'], 'choices' => [
                    ['value' => 'red', 'text' => ['default' => 'Red']],
                ]],
            ]]],
        ],
    ]);

    expect($schema)->not->toBeNull();

    $page = visit('/admin/designer-page');

    // Form title, page-less page has no title, field title, and the choice label.
    $page->click('[data-testid="tab-translations"]')
        ->assertSee('Colour')                              // field title row value
        ->assertSee('Red')                                 // nested choice label discovered
        ->assertPresent('[data-testid="tr-title-default"]')                        // survey root
        ->assertPresent('[data-testid="tr-pages.0.elements.0.choices.0.text-default"]')
        ->assertNoJavaScriptErrors();
});

it('reports translation coverage per locale', function () {
    // Seed a schema with exactly ONE translatable string so the count is exact.
    FormSchema::factory()->create([
        'json' => ['pages' => [['name' => 'page1', 'elements' => [
            ['type' => 'text', 'name' => 'q', 'title' => ['default' => 'Name']],
        ]]]],
    ]);

    $page = visit('/admin/designer-page');

    $page->fill('.sv-loc__add', 'de')
        ->keys('.sv-loc__add', ['Enter'])
        ->click('[data-testid="tab-translations"]')
        ->assertSee('de: 0/1')                             // one string, none translated
        ->fill('[data-testid="tr-pages.0.elements.0.title-de"]', 'Name')
        ->assertSee('de: 1/1')
        ->assertNoJavaScriptErrors();
});
