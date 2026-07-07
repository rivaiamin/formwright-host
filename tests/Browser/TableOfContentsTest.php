<?php

use App\Models\FormSchema;
use App\Models\User;

it('enables the table of contents and sets a page menu title', function () {
    $this->actingAs(User::factory()->create());

    $page = visit('/admin/designer-page');

    $page->assertSee('Formwright Designer')
        ->click('[data-testid="form-settings"]')
        ->check('[data-testid="survey-toc"]')
        ->select('#survey-tocloc', 'right')
        ->click('[data-testid="page-select"]')        // switch to page settings
        ->assertSee('Menu title')
        ->fill('#prop-navigationTitle', 'Overview')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $json = FormSchema::query()->latest('id')->first()->json;

    expect($json['showTOC'])->toBeTrue()
        ->and($json['tocLocation'])->toBe('right')
        ->and($json['pages'][0]['navigationTitle']['default'])->toBe('Overview');
});

it('renders the table of contents on the public form', function () {
    $schema = FormSchema::factory()->create([
        'json' => [
            'showTOC' => true,
            'pages' => [
                ['name' => 'p1', 'navigationTitle' => ['default' => 'Section one'], 'elements' => [
                    ['type' => 'text', 'name' => 'a', 'title' => ['default' => 'Field A']],
                ]],
                ['name' => 'p2', 'navigationTitle' => ['default' => 'Section two'], 'elements' => [
                    ['type' => 'text', 'name' => 'b', 'title' => ['default' => 'Field B']],
                ]],
            ],
        ],
    ]);

    visit("/forms/{$schema->slug}")
        ->assertSee('Section one')                    // TOC entry rendered by survey-core
        ->assertSee('Section two')
        ->assertNoJavaScriptErrors();
});
