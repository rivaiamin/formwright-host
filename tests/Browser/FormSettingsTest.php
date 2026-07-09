<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('edits form-wide settings and persists them onto the survey root', function () {
    $page = visit('/admin/designer-page');

    $page->assertSee('Formwright Designer')
        ->assertNoJavaScriptErrors()
        ->click('[data-testid="form-settings"]')       // open the survey scope
        ->assertSee('Form settings')
        ->fill('#prop-title', 'Customer satisfaction')
        ->select('[data-testid="survey-progress"]', 'top')
        ->click('Save')
        ->assertSee('Saved');

    $stored = FormSchema::query()->latest('id')->first();

    expect($stored->json['title']['default'])->toBe('Customer satisfaction')
        ->and($stored->json['showProgressBar'])->toBe('top');
});

it('edits page attributes and persists them onto the page', function () {
    $page = visit('/admin/designer-page');

    $page->assertSee('Formwright Designer')
        ->click('[data-testid="page-select"]')          // open the page scope
        ->assertSee('Page settings')
        ->fill('#prop-title', 'Getting started')
        ->fill('[data-testid="page-visibleif"]', "{role} = 'admin'")
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $stored = FormSchema::query()->latest('id')->first();
    $firstPage = $stored->json['pages'][0];

    expect($firstPage['title']['default'])->toBe('Getting started')
        ->and($firstPage['visibleIf'])->toBe("{role} = 'admin'");
});
