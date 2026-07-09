<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('applies a starter template', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-testid="templates-toggle"]')
        ->assertPresent('[data-testid="templates-panel"]')
        ->click('[data-testid="template-contact"]')
        ->assertSee('Your name')                        // template fields on the canvas
        ->assertSee('Message')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $json = FormSchema::query()->latest('id')->first()->json;
    $names = collect($json['pages'][0]['elements'])->pluck('name')->all();

    expect($json['title']['default'])->toBe('Contact us')
        ->and($names)->toBe(['full_name', 'email', 'subject', 'message'])
        ->and($json['pages'][0]['elements'][1]['validators'][0]['type'])->toBe('email');
});

it('undoes a template application in one step', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')        // an existing field
        ->click('[data-testid="templates-toggle"]')
        ->click('[data-testid="template-quiz"]')
        ->assertSee('What is the capital of France?')
        ->click('[data-testid="undo"]')                  // one Undo restores the prior form
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $elements = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'];

    expect($elements)->toHaveCount(1)
        ->and($elements[0]['name'])->toBe('short_text_1');
});

it('saves a configured field to the library and re-inserts it', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="single_choice"]')
        ->fill('#prop-title', 'Favourite colour')
        ->fill('[data-testid="choice-add"]', 'Red')
        ->keys('[data-testid="choice-add"]', ['Enter'])
        ->click('[data-element="single_choice_1"] [data-action="save-block"]')
        ->assertSee('Added “Favourite colour” to the library')
        ->assertPresent('[data-testid="saved-blocks"]')
        ->assertSee('Favourite colour')                            // the library chip
        ->click('[data-testid="saved-blocks"] .palette__chip')     // insert a second copy
        // The copy lands on the canvas under a uniquified name, carrying its
        // configured title and choices.
        ->assertPresent('[data-element="single_choice_1"]')
        ->assertPresent('[data-element="single_choice_1_2"]')
        ->assertSeeIn('[data-element="single_choice_1_2"]', 'Favourite colour')
        ->assertSeeIn('[data-element="single_choice_1_2"]', 'Red')
        ->assertNoJavaScriptErrors();
});

it('removes a saved block from the library', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')
        ->fill('#prop-title', 'Reusable field')
        ->click('[data-element="short_text_1"] [data-action="save-block"]')
        ->assertPresent('[data-testid="saved-blocks"]')
        ->click('[data-testid="saved-blocks"] .palette__del')
        ->assertMissing('[data-testid="saved-blocks"]')
        ->assertNoJavaScriptErrors();
});
