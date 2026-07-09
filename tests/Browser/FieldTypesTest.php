<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('adds the new field types from the palette and persists their survey types', function () {
    $page = visit('/admin/designer-page');

    $page->assertSee('Formwright Designer')
        ->assertNoJavaScriptErrors()
        ->click('[data-block-id="ranking"]')
        ->click('[data-block-id="tagbox"]')
        ->click('[data-block-id="expression"]')
        ->click('[data-block-id="multiple_text"]')
        ->click('[data-block-id="matrix"]')
        ->click('Save')
        ->assertSee('Saved');

    $types = collect(FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'])
        ->pluck('type')
        ->all();

    expect($types)->toBe(['ranking', 'tagbox', 'expression', 'multipletext', 'matrix']);
});

it('edits matrix rows and columns through the panel', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="matrix"]')          // add + auto-select
        ->assertSee('Rows')
        ->assertSee('Columns')
        ->click('[data-testid="list-add-rows"]')      // a third row
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($el['type'])->toBe('matrix')
        ->and($el['rows'])->toHaveCount(3)
        ->and($el['columns'])->toHaveCount(2);
});

it('renders every new field type on the public form without JS errors', function () {
    $schema = FormSchema::factory()->create([
        'json' => ['pages' => [['name' => 'page1', 'elements' => [
            ['type' => 'ranking', 'name' => 'r', 'title' => ['default' => 'Rank these'], 'choices' => [['value' => 'a', 'text' => ['default' => 'A']], ['value' => 'b', 'text' => ['default' => 'B']]]],
            ['type' => 'tagbox', 'name' => 't', 'title' => ['default' => 'Pick many'], 'choices' => [['value' => 'x'], ['value' => 'y']]],
            ['type' => 'expression', 'name' => 'e', 'title' => ['default' => 'Computed'], 'expression' => '1 + 1'],
            ['type' => 'multipletext', 'name' => 'm', 'title' => ['default' => 'Address'], 'items' => [['name' => 'street', 'title' => ['default' => 'Street']], ['name' => 'city', 'title' => ['default' => 'City']]]],
            ['type' => 'matrix', 'name' => 'grid', 'title' => ['default' => 'Rate'], 'columns' => [['value' => '1', 'text' => ['default' => 'Low']], ['value' => '2', 'text' => ['default' => 'High']]], 'rows' => [['value' => 'q1', 'text' => ['default' => 'Speed']]]],
        ]]]],
    ]);

    visit("/forms/{$schema->slug}")
        ->assertNoJavaScriptErrors()
        ->assertSee('Rank these')
        ->assertSee('Address')
        ->assertSee('Speed');
});
