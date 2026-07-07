<?php

use App\Models\FormSchema;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('mounts the Svelte builder on the Filament page without JavaScript errors', function () {
    $page = visit('/admin/designer-page');

    $page->assertNoJavaScriptErrors()
        ->assertSee('Formwright Designer')   // the bundle rendered its shell
        ->assertSee('Short answer')        // the palette rendered from the type-registry
        ->assertSee('Signature');
});

it('saves an edited schema from the browser through to the database', function () {
    $edited = json_encode([
        'title' => ['default' => 'Edited in browser'],
        'locale' => 'default',
        'pages' => [[
            'name' => 'page1',
            'elements' => [
                ['type' => 'text', 'name' => 'browser_test_field', 'title' => ['default' => 'Typed in a real browser']],
            ],
        ]],
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    $page = visit('/admin/designer-page');

    $page->assertSee('Formwright Designer')
        ->click('JSON')
        ->fill('.json__area', $edited)
        ->click('Apply to builder')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    // The JS -> Livewire -> validator -> DB path really persisted the edit.
    $stored = FormSchema::query()->latest('id')->first();

    expect($stored)->not->toBeNull()
        ->and($stored->json['pages'][0]['elements'][0]['name'])->toBe('browser_test_field');
});
