<?php

use App\Models\FormSchema;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('adds choices from the input and toggles an Other option', function () {
    FormSchema::factory()->create(['json' => [
        'pages' => [['name' => 'page1', 'elements' => [
            ['type' => 'radiogroup', 'name' => 'plan', 'title' => ['default' => 'Plan'], 'choices' => []],
        ]]],
    ]]);

    $page = visit('/admin/designer-page');

    $page->click('[data-element="plan"]')
        ->assertSee('Options')
        ->fill('[data-testid="choice-add"]', 'Blue')
        ->keys('[data-testid="choice-add"]', ['Enter'])
        ->fill('[data-testid="choice-add"]', 'Green')
        ->keys('[data-testid="choice-add"]', ['Enter'])
        ->assertSee('Blue')                       // rendered on the WYSIWYG card
        ->assertSee('Green')
        ->check('[data-testid="other-toggle"]')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];
    $values = collect($el['choices'])->pluck('value')->all();

    expect($values)->toBe(['blue', 'green'])
        ->and($el['choices'][0]['text']['default'])->toBe('Blue')
        ->and($el['showOtherItem'])->toBeTrue();
});

it('edits a label across locales via the { } popover', function () {
    FormSchema::factory()->create(['json' => [
        'pages' => [['name' => 'page1', 'elements' => [
            ['type' => 'text', 'name' => 'q1', 'title' => ['default' => 'Name']],
        ]]],
    ]]);

    $page = visit('/admin/designer-page');

    $page->fill('.sv-loc__add', 'ar')             // add an authoring locale
        ->keys('.sv-loc__add', ['Enter'])
        ->click('[data-element="q1"]')             // select the field
        ->click('[data-testid="loc-toggle-title"]')
        ->fill('[data-testid="loc-title-ar"]', 'الاسم')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($el['title'])->toMatchArray([
        'default' => 'Name',
        'ar' => 'الاسم',
    ]);
});
