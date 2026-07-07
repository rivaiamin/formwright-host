<?php

use App\Models\FormSchema;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('renders grouped settings sections and edits BASICS fields', function () {
    FormSchema::factory()->create(['json' => [
        'pages' => [['name' => 'page1', 'elements' => [
            ['type' => 'text', 'name' => 'email', 'title' => ['default' => 'Email']],
        ]]],
    ]]);

    $page = visit('/admin/designer-page');

    $page->click('[data-element="email"]')          // select the field
        ->assertSee('Settings')
        ->assertSee('Basics')
        ->assertSee('Advanced')
        ->fill('[data-testid="default-value"]', 'me@example.com')
        ->check('[data-testid="hidden-toggle"]')
        ->check('[data-testid="readonly-toggle"]')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors()
        ->screenshot();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($el['defaultValue'])->toBe('me@example.com')
        ->and($el['visible'])->toBeFalse()
        ->and($el['readOnly'])->toBeTrue();
});
