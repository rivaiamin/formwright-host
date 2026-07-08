<?php

use App\Filament\Resources\FormSchemas\Pages\CreateFormSchema;
use App\Filament\Resources\FormSchemas\Pages\ListFormSchemas;
use App\Models\FormSchema;
use App\Models\User;
use Filament\Actions\Testing\TestAction;
use Livewire\Livewire;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('lists existing forms', function () {
    $forms = FormSchema::factory()->count(3)->create();

    Livewire::test(ListFormSchemas::class)
        ->assertCanSeeTableRecords($forms);
});

it('duplicates a form into a brand-new record with the same JSON', function () {
    $form = FormSchema::factory()->withQuestions()->create(['name' => 'Original']);

    Livewire::test(ListFormSchemas::class)
        ->callAction(TestAction::make('replicate')->table($form));

    expect(FormSchema::count())->toBe(2);

    $copy = FormSchema::query()->where('id', '!=', $form->getKey())->firstOrFail();

    expect($copy->name)->toBe('Original (copy)')
        ->and($copy->slug)->not->toBe($form->slug)
        ->and($copy->json)->toBe($form->json);
});

it('gives the duplicate a fresh revision history (none copied)', function () {
    $form = FormSchema::factory()->withQuestions()->create();
    $form->revisions()->create(['user_id' => auth()->id(), 'json' => $form->json]);

    Livewire::test(ListFormSchemas::class)
        ->callAction(TestAction::make('replicate')->table($form));

    $copy = FormSchema::query()->where('id', '!=', $form->getKey())->firstOrFail();

    expect($copy->revisions()->count())->toBe(0)
        ->and($form->revisions()->count())->toBe(1);
});

it('seeds a valid blank schema when creating a form from the resource', function () {
    Livewire::test(CreateFormSchema::class)
        ->fillForm(['name' => 'Fresh'])
        ->call('create')
        ->assertHasNoFormErrors();

    $form = FormSchema::query()->where('name', 'Fresh')->firstOrFail();

    expect($form->json)->toHaveKey('pages')
        ->and($form->default_locale)->not->toBeEmpty();
});
