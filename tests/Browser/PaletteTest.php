<?php

use App\Models\FormSchema;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('shows the grouped palette and still adds fields on click', function () {
    $page = visit('/admin/designer-page');

    $page->assertSee('Essentials')
        ->assertSee('Choices')
        ->assertSee('Content')
        ->assertSee('Uploads')
        ->assertSee('Click to add or drag onto the form')
        ->assertNoJavaScriptErrors()
        ->screenshot();

    // Click-to-add still works with the grouped, per-section drag zones.
    $page->click('[data-block-id="rating"]')
        ->click('Save')
        ->assertSee('Saved');

    $elements = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'];
    expect($elements)->toHaveCount(1)
        ->and($elements[0]['type'])->toBe('rating');
});
