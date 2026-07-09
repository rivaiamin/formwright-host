<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

function savedElements(): array
{
    return FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'];
}

it('undoes adding a field', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')
        ->click('[data-testid="undo"]')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    expect(savedElements())->toBe([]);
});

it('redoes an undone field', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')
        ->click('[data-testid="undo"]')
        ->click('[data-testid="redo"]')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $elements = savedElements();

    expect($elements)->toHaveCount(1)
        ->and($elements[0]['type'])->toBe('text');
});

it('keeps a structural add and a property edit as separate history entries', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')      // entry 1: the add
        ->fill('#prop-title', 'Your full name')        // entry 2: the label edit
        ->click('[data-testid="undo"]')                // undo only the label edit
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $elements = savedElements();

    // The field survives; only its title was rolled back.
    expect($elements)->toHaveCount(1)
        ->and($elements[0]['name'])->toBe('short_text_1')
        ->and($elements[0])->not->toHaveKey('title');
});

it('undoes a drag reorder as one step', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')
        ->click('[data-block-id="rating"]')
        ->keys('[data-element="rating_1"]', ['Space', 'ArrowUp', 'Space'])   // move rating above
        ->click('[data-testid="undo"]')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $names = collect(savedElements())->pluck('name')->all();

    expect($names)->toBe(['short_text_1', 'rating_1']);   // original order restored
});
