<?php

use App\Models\User;
use Livewire\Livewire;
use Rivaiamin\Formwright\Filament\Pages\DesignerPage;
use Rivaiamin\Formwright\Models\FormSchema;
use Rivaiamin\Formwright\Models\FormSchemaRevision;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

function revisionSchema(string $fieldName): array
{
    return ['pages' => [['name' => 'page1', 'elements' => [
        ['type' => 'text', 'name' => $fieldName, 'title' => ['default' => 'A field']],
    ]]]];
}

it('records a revision on every distinct save', function () {
    FormSchema::factory()->create();

    Livewire::test(DesignerPage::class)->call('saveSchema', revisionSchema('first'));
    Livewire::test(DesignerPage::class)->call('saveSchema', revisionSchema('second'));

    expect(FormSchemaRevision::count())->toBe(2)
        ->and(FormSchemaRevision::query()->latest('id')->first()->json['pages'][0]['elements'][0]['name'])->toBe('second');
});

it('does not record a revision when the schema is unchanged', function () {
    FormSchema::factory()->create();

    Livewire::test(DesignerPage::class)->call('saveSchema', revisionSchema('same'));
    Livewire::test(DesignerPage::class)->call('saveSchema', revisionSchema('same'));

    expect(FormSchemaRevision::count())->toBe(1);
});

it('attributes a revision to the signed-in user', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    FormSchema::factory()->create();

    Livewire::test(DesignerPage::class)->call('saveSchema', revisionSchema('mine'));

    expect(FormSchemaRevision::query()->first()->user_id)->toBe($user->id);
});

it('lists revisions newest first and flags the current one', function () {
    FormSchema::factory()->create();

    Livewire::test(DesignerPage::class)->call('saveSchema', revisionSchema('older'));
    Livewire::test(DesignerPage::class)->call('saveSchema', revisionSchema('newer'));

    $rows = Livewire::test(DesignerPage::class)->instance()->revisions();

    expect($rows)->toHaveCount(2)
        ->and($rows[0]['fields'])->toBe(1)
        ->and($rows[0]['current'])->toBeTrue()    // newest matches the stored schema
        ->and($rows[1]['current'])->toBeFalse();
});

it('restores a revision without writing to the database', function () {
    FormSchema::factory()->create();

    Livewire::test(DesignerPage::class)->call('saveSchema', revisionSchema('older'));
    Livewire::test(DesignerPage::class)->call('saveSchema', revisionSchema('newer'));

    $oldest = FormSchemaRevision::query()->oldest('id')->first();
    $result = Livewire::test(DesignerPage::class)->instance()->restoreRevision($oldest->id);

    expect($result['ok'])->toBeTrue()
        ->and($result['schema']['pages'][0]['elements'][0]['name'])->toBe('older')
        // Restoring only hands the JSON back to the builder; the record is untouched.
        ->and(FormSchema::query()->first()->json['pages'][0]['elements'][0]['name'])->toBe('newer');
});

it('rejects restoring an unknown revision', function () {
    FormSchema::factory()->create();

    $result = Livewire::test(DesignerPage::class)->instance()->restoreRevision(999);

    expect($result['ok'])->toBeFalse()
        ->and($result['error'])->toContain('no longer exists');
});

it('cascades revisions when the form is deleted', function () {
    $schema = FormSchema::factory()->create();
    FormSchemaRevision::factory()->count(3)->create(['form_schema_id' => $schema->id]);

    $schema->delete();

    expect(FormSchemaRevision::count())->toBe(0);
});
