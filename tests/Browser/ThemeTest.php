<?php

use App\Models\FormSchema;
use App\Models\User;

it('builds a theme and applies it in the live preview', function () {
    $this->actingAs(User::factory()->create());

    $page = visit('/admin/designer-page');

    $page->assertSee('Formwright Designer')
        ->click('[data-block-id="short_text"]')          // a field so the preview has content
        ->click('[data-testid="form-settings"]')
        ->click('[data-testid="theme-toggle"]')
        ->assertSee('Accent colour')
        ->click('[data-testid="theme-preset-blue"]')      // accent #2563eb, light
        ->click('[data-testid="theme-dark"]')             // switch to dark palette
        ->check('[data-testid="theme-panelless"]')
        ->click('Preview')                                 // applyStoredTheme runs in Preview
        ->assertNoJavaScriptErrors()
        ->click('Save')
        ->assertSee('Saved');

    $theme = FormSchema::query()->latest('id')->first()->json['theme'];

    expect($theme['cssVariables']['--sjs-primary-backcolor'])->toBe('#2563eb')
        ->and($theme['colorPalette'])->toBe('dark')
        ->and($theme['isPanelless'])->toBeTrue();
});

it('applies a stored theme on the public form without JS errors', function () {
    $schema = FormSchema::factory()->create([
        'json' => [
            'theme' => [
                'colorPalette' => 'dark',
                'isPanelless' => true,
                'cssVariables' => ['--sjs-primary-backcolor' => '#7c3aed', '--sjs-corner-radius' => '20px'],
            ],
            'pages' => [['name' => 'page1', 'elements' => [
                ['type' => 'text', 'name' => 'full_name', 'title' => ['default' => 'Your name']],
            ]]],
        ],
    ]);

    visit("/forms/{$schema->slug}")
        ->assertSee('Your name')
        ->assertNoJavaScriptErrors();
});
