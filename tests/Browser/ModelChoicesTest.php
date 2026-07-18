<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;

beforeEach(function () {
    config()->set('formbuilder.data_sources', [
        'people' => [
            'label' => 'People',
            'model' => User::class,
            'value' => 'id',
            'text' => 'name',
        ],
    ]);

    $this->actingAs(User::factory()->create());
});

it('configures a dropdown backed by a Laravel model', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="dropdown"]')       // add + auto-select
        ->assertSee('Choices from')
        ->select('[data-testid="choice-source"]', 'model')
        ->assertSee('Source')
        ->select('[data-testid="data-source-key"]', 'people')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($el['dataSource'])->toBe('people')
        ->and($el['choicesLazyLoadEnabled'])->toBeTrue()   // dropdown/tagbox lazy-load
        ->and($el)->not->toHaveKey('choices');
});

it('filters a model-backed dropdown by another question (cascade)', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="single_choice"]')       // single_choice_1 (the parent)
        ->click('[data-block-id="dropdown"]')             // dropdown_1 (auto-selected)
        ->select('[data-testid="choice-source"]', 'model')
        ->select('[data-testid="data-source-key"]', 'people')
        ->select('[data-testid="data-filter-question"]', 'single_choice_1')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][1];

    expect($el['dataSource'])->toBe('people')
        ->and($el['dataFilterQuestion'])->toBe('single_choice_1');
});
