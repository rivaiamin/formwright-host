<?php

use App\Filament\Pages\DesignerPage;
use App\Models\FormSchema;
use App\Models\User;
use Livewire\Livewire;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('creates a blank schema on first mount', function () {
    expect(FormSchema::count())->toBe(0);

    Livewire::test(DesignerPage::class)
        ->assertSet('recordId', fn ($id) => $id !== null)
        ->assertSet('schema', fn ($schema) => isset($schema['pages']));

    expect(FormSchema::count())->toBe(1);
});

it('persists a valid schema through saveSchema (JS -> Livewire -> DB)', function () {
    $component = Livewire::test(DesignerPage::class);
    $id = $component->get('recordId');

    $newSchema = [
        'title' => ['default' => 'Edited'],
        'pages' => [[
            'name' => 'page1',
            'elements' => [
                ['type' => 'text', 'name' => 'email', 'inputType' => 'email'],
            ],
        ]],
    ];

    $component->call('saveSchema', $newSchema);

    expect(FormSchema::find($id)->json)->toBe($newSchema);
});

it('rejects an invalid schema and leaves the stored schema untouched', function () {
    $component = Livewire::test(DesignerPage::class);
    $id = $component->get('recordId');
    $original = FormSchema::find($id)->json;

    // Duplicate names -> invalid.
    $component->call('saveSchema', [
        'pages' => [[
            'name' => 'page1',
            'elements' => [
                ['type' => 'text', 'name' => 'dupe'],
                ['type' => 'text', 'name' => 'dupe'],
            ],
        ]],
    ]);

    expect(FormSchema::find($id)->json)->toBe($original);
});

it('returns the stored schema from loadSchema', function () {
    $component = Livewire::test(DesignerPage::class);
    $id = $component->get('recordId');

    $component->call('loadSchema')
        ->assertReturned(fn ($schema) => is_array($schema) && isset($schema['pages']));

    expect(FormSchema::find($id))->not->toBeNull();
});
