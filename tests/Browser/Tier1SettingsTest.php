<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('persists survey branding, redirect and validation-behavior settings', function () {
    $page = visit('/admin/designer-page');

    $page->assertSee('Formwright Designer')
        ->assertNoJavaScriptErrors()
        ->click('[data-testid="form-settings"]')
        ->assertSee('Header & branding')
        ->fill('[data-testid="survey-logo"]', 'https://example.test/logo.png')
        ->fill('[data-testid="survey-redirect"]', 'https://example.test/thanks')
        ->click('[data-testid="behavior-toggle"]')
        ->select('[data-testid="survey-checkerrors"]', 'onComplete')
        ->click('Save')
        ->assertSee('Saved');

    $json = FormSchema::query()->latest('id')->first()->json;

    expect($json['logo'])->toBe('https://example.test/logo.png')
        ->and($json['navigateToUrl'])->toBe('https://example.test/thanks')
        ->and($json['checkErrorsMode'])->toBe('onComplete');
});

it('adds a field validator and an appearance setting', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')      // add + auto-select
        ->assertSee('Validation')
        ->click('[data-testid="validation-toggle"]')
        ->select('[data-testid="validator-type"]', 'regex')
        ->click('[data-testid="validator-add"]')
        ->click('[data-testid="appearance-toggle"]')
        ->select('[data-testid="title-location"]', 'left')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($el['validators'][0]['type'])->toBe('regex')
        ->and($el['titleLocation'])->toBe('left');
});

it('sets a page navigation-buttons visibility', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-testid="page-select"]')
        ->assertSee('Navigation')
        ->select('[data-testid="page-nav"]', 'hide')
        ->click('Save')
        ->assertSee('Saved');

    $firstPage = FormSchema::query()->latest('id')->first()->json['pages'][0];

    expect($firstPage['navigationButtonsVisibility'])->toBe('hide');
});
