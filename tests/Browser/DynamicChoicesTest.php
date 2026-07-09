<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('configures choices from a web service (choicesByUrl)', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="single_choice"]')       // add + auto-select
        ->assertSee('Choices from')
        ->select('[data-testid="choice-source"]', 'url')
        ->fill('[data-testid="choices-url"]', 'https://api.example.com/opts')
        ->fill('#cbu-value', 'id')
        ->fill('#cbu-title', 'name')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($el['choicesByUrl']['url'])->toBe('https://api.example.com/opts')
        ->and($el['choicesByUrl']['valueName'])->toBe('id')
        ->and($el['choicesByUrl']['titleName'])->toBe('name')
        ->and($el)->not->toHaveKey('choices');
});

it('carries answers forward from another question (choicesFromQuestion)', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="single_choice"]')       // single_choice_1
        ->click('[data-block-id="multiple_choice"]')       // multiple_choice_1 (auto-selected)
        ->select('[data-testid="choice-source"]', 'question')
        ->assertSee('Copy answers from')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][1];

    expect($el['choicesFromQuestion'])->toBe('single_choice_1')
        ->and($el)->not->toHaveKey('choicesByUrl');
});

it('renders a carry-forward question on the public form without JS errors', function () {
    $schema = FormSchema::factory()->create([
        'json' => ['pages' => [['name' => 'page1', 'elements' => [
            ['type' => 'checkbox', 'name' => 'fruits', 'title' => ['default' => 'Pick fruits'], 'choices' => [
                ['value' => 'apple', 'text' => ['default' => 'Apple']],
                ['value' => 'banana', 'text' => ['default' => 'Banana']],
            ]],
            ['type' => 'checkbox', 'name' => 'favourite', 'title' => ['default' => 'Favourite of those'], 'choicesFromQuestion' => 'fruits', 'choicesFromQuestionMode' => 'selected'],
        ]]]],
    ]);

    visit("/forms/{$schema->slug}")
        ->assertSee('Pick fruits')
        ->assertSee('Favourite of those')
        ->assertNoJavaScriptErrors();
});
