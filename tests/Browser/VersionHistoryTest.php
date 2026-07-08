<?php

use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('shows an empty history before anything is saved', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-testid="history-toggle"]')
        ->assertPresent('[data-testid="history-panel"]')
        ->assertPresent('[data-testid="history-empty"]')
        ->assertNoJavaScriptErrors();
});

it('records versions on save and restores an earlier one into the builder', function () {
    $page = visit('/admin/designer-page');

    // Version 1: a single short-text field.
    $page->click('[data-block-id="short_text"]')
        ->fill('#prop-title', 'Original field')
        ->click('Save')
        ->assertSee('Saved');

    // Version 2: add a rating on top.
    $page->click('[data-block-id="rating"]')
        ->fill('#prop-title', 'Added later')
        ->click('Save')
        ->assertSee('Saved');

    // Two versions exist; the newest is flagged as current (Restore disabled).
    $page->click('[data-testid="history-toggle"]')
        ->assertPresent('[data-testid="history-panel"]')
        ->assertSee('Current')
        ->assertCount('[data-revision]', 2)
        ->assertNoJavaScriptErrors();

    // Restore the OLDER version (revision 1): the rating should disappear.
    $page->click('[data-testid="restore-1"]')
        ->assertPresent('[data-element="short_text_1"]')
        ->assertMissing('[data-element="rating_1"]')
        ->assertNoJavaScriptErrors();

    // A restore is a normal, undoable replacement — Undo brings version 2 back.
    $page->click('[data-testid="undo"]')
        ->assertPresent('[data-element="rating_1"]')
        ->assertNoJavaScriptErrors();
});
