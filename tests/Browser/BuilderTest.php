<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('adds a field from the palette and persists it to the schema', function () {
    $page = visit('/admin/designer-page');

    $page->assertSee('Formwright Designer')
        ->assertNoJavaScriptErrors()
        ->click('[data-block-id="short_text"]')      // palette click-to-add
        ->click('Save')
        ->assertSee('Saved');

    $stored = FormSchema::query()->latest('id')->first();
    $elements = $stored->json['pages'][0]['elements'];

    expect($elements)->toHaveCount(1)
        ->and($elements[0]['type'])->toBe('text');
});

it('edits a field label through the property panel', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="single_choice"]')   // add + auto-select
        ->assertSee('Label')                           // property panel rendered
        ->fill('#prop-title', 'Favourite colour')
        ->click('Save')
        ->assertSee('Saved');

    $stored = FormSchema::query()->latest('id')->first();
    $el = $stored->json['pages'][0]['elements'][0];

    expect($el['type'])->toBe('radiogroup')
        ->and($el['title']['default'])->toBe('Favourite colour');
});

it('preserves and locks an unknown advanced type instead of corrupting it', function () {
    $advanced = [
        'title' => ['default' => 'Has a matrix'],
        'pages' => [[
            'name' => 'page1',
            'elements' => [
                [
                    // A type the registry does not know (and never will) — the
                    // builder must preserve it byte-for-byte and lock the card.
                    'type' => 'bootstrapslider',
                    'name' => 'grid',
                    'columns' => [['name' => 'c1', 'title' => 'Col 1']],
                    'rowCount' => 2,
                ],
            ],
        ]],
    ];

    FormSchema::factory()->create(['json' => $advanced]);

    $page = visit('/admin/designer-page');

    // The advanced element shows as a locked card, editable only in JSON.
    $page->assertSee('Advanced')
        ->assertSee('bootstrapslider')
        ->assertNoJavaScriptErrors()
        ->click('Save')
        ->assertSee('Saved');

    // Byte-for-byte preservation: the matrixdynamic survived untouched.
    $stored = FormSchema::query()->latest('id')->first();
    $el = $stored->json['pages'][0]['elements'][0];

    expect($el['type'])->toBe('bootstrapslider')
        ->and($el['columns'][0]['name'])->toBe('c1')
        ->and($el['rowCount'])->toBe(2);
});

it('drives the visual builder from the raw JSON editor', function () {
    $page = visit('/admin/designer-page');

    $edited = json_encode([
        'title' => ['default' => 'From JSON'],
        'pages' => [[
            'name' => 'page1',
            'elements' => [
                ['type' => 'rating', 'name' => 'nps', 'title' => ['default' => 'Recommend us?'], 'rateMax' => 10],
            ],
        ]],
    ], JSON_PRETTY_PRINT);

    $page->click('JSON')
        ->fill('.json__area', $edited)
        ->click('Apply to builder')
        ->click('Build')
        ->assertSee('Recommend us?')      // canvas now reflects the JSON edit
        ->click('Save')
        ->assertSee('Saved');

    $stored = FormSchema::query()->latest('id')->first();
    expect($stored->json['pages'][0]['elements'][0]['name'])->toBe('nps');
});

it('reorders fields on the canvas via keyboard drag', function () {
    $page = visit('/admin/designer-page');

    // Add two fields: short_text_1 then rating_1 (below it).
    $page->click('[data-block-id="short_text"]')
        ->click('[data-block-id="rating"]')
        ->assertNoJavaScriptErrors();

    // svelte-dnd-action keyboard a11y: focus item, Space to lift, ArrowUp to
    // move, Space to drop.
    $page->keys('[data-element="rating_1"]', ['Space', 'ArrowUp', 'Space'])
        ->click('Save')
        ->assertSee('Saved');

    $names = collect(FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'])
        ->pluck('name')
        ->all();

    expect($names)->toBe(['rating_1', 'short_text_1']);
});
