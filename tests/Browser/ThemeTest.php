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

it('sets page and question background colours with their derived shades', function () {
    $this->actingAs(User::factory()->create());

    $page = visit('/admin/designer-page');

    $page->click('[data-testid="form-settings"]')
        ->click('[data-testid="theme-toggle"]')
        ->assertSee('Page background')
        ->fill('[data-testid="theme-page-bg"]', '#101820')
        ->fill('[data-testid="theme-surface-bg"]', '#1c2630')
        ->click('Preview')                                  // theme applies without error
        ->assertNoJavaScriptErrors()
        ->click('Save')
        ->assertSee('Saved');

    $vars = FormSchema::query()->latest('id')->first()->json['theme']['cssVariables'];

    // The dim companions move with the page background, or panels stop separating.
    expect($vars['--sjs-general-backcolor-dim'])->toBe('#101820')
        ->and($vars['--sjs-general-backcolor-dim-light'])->toBe('#101820')
        ->and($vars['--sjs-general-backcolor-dim-dark'])->toBe('#101820')
        ->and($vars['--sjs-general-backcolor'])->toBe('#1c2630')
        ->and($vars['--sjs-general-backcolor-dark'])->toBe('#1c2630');
});

it('clears background overrides back to the palette defaults', function () {
    $this->actingAs(User::factory()->create());

    $page = visit('/admin/designer-page');

    $page->click('[data-testid="form-settings"]')
        ->click('[data-testid="theme-toggle"]')
        ->fill('[data-testid="theme-page-bg"]', '#101820')
        ->click('[data-testid="theme-clear-bg"]')
        ->click('[data-testid="theme-preset-blue"]')        // a preset also clears them
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $vars = FormSchema::query()->latest('id')->first()->json['theme']['cssVariables'];

    expect($vars)->not->toHaveKey('--sjs-general-backcolor-dim')
        ->and($vars)->not->toHaveKey('--sjs-general-backcolor')
        ->and($vars['--sjs-primary-backcolor'])->toBe('#2563eb');
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
