<?php

use Rivaiamin\Formwright\Contracts\SubmissionStore;
use Rivaiamin\Formwright\Models\FormSchema;
use Rivaiamin\Formwright\Models\FormSubmission;

function publicSchema(array $elements): FormSchema
{
    return FormSchema::factory()->create([
        'json' => ['pages' => [['name' => 'page1', 'elements' => $elements]]],
    ]);
}

it('renders the public form page by slug', function () {
    $schema = publicSchema([
        ['type' => 'text', 'name' => 'full_name', 'title' => ['default' => 'Full name'], 'isRequired' => true],
    ]);

    $this->get("/forms/{$schema->slug}")
        ->assertOk()
        ->assertSee('formwright-form')     // the mount node
        ->assertSee('full_name');        // the schema JSON is embedded
});

it('returns 404 for an unknown slug', function () {
    $this->get('/forms/does-not-exist')->assertNotFound();
});

it('stores a submission and returns 201', function () {
    $schema = publicSchema([
        ['type' => 'text', 'name' => 'full_name', 'title' => ['default' => 'Full name']],
    ]);

    $this->postJson("/forms/{$schema->slug}", ['data' => ['full_name' => 'Jane Doe']])
        ->assertCreated()
        ->assertJson(['ok' => true]);

    $submission = FormSubmission::query()->first();

    expect(FormSubmission::count())->toBe(1)
        ->and($submission->form_schema_id)->toBe($schema->id)
        ->and($submission->data)->toBe(['full_name' => 'Jane Doe']);
});

it('rejects a submission missing a required field', function () {
    $schema = publicSchema([
        ['type' => 'text', 'name' => 'full_name', 'title' => ['default' => 'Full name'], 'isRequired' => true],
    ]);

    $this->postJson("/forms/{$schema->slug}", ['data' => ['unrelated' => 'x']])
        ->assertStatus(422)
        ->assertJsonPath('ok', false)
        ->assertJsonPath('errors.full_name', 'The field "full_name" is required.');

    expect(FormSubmission::count())->toBe(0);
});

it('scores a quiz submission server-side', function () {
    $schema = publicSchema([
        [
            'type' => 'radiogroup', 'name' => 'q1',
            'choices' => [['value' => 'a'], ['value' => 'b']],
            'correctAnswer' => 'a', 'points' => 3,
        ],
    ]);

    $this->postJson("/forms/{$schema->slug}", ['data' => ['q1' => 'a']])
        ->assertCreated()
        ->assertJsonPath('score', 3);

    $this->postJson("/forms/{$schema->slug}", ['data' => ['q1' => 'b']])
        ->assertCreated()
        ->assertJsonPath('score', 0);
});

it('retrieves submissions through the SubmissionStore contract', function () {
    $schema = publicSchema([['type' => 'text', 'name' => 'q']]);
    $store = app(SubmissionStore::class);

    $store->store($schema, ['q' => 'one']);
    $store->store($schema, ['q' => 'two']);

    expect($store->forSchema($schema))->toHaveCount(2);
});
