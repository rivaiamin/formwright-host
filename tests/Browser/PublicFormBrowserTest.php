<?php

use Rivaiamin\Formwright\Models\FormSchema;
use Rivaiamin\Formwright\Models\FormSubmission;

it('renders the public form and stores a submission when completed', function () {
    $schema = FormSchema::factory()->create([
        'json' => ['pages' => [[
            'name' => 'page1',
            'elements' => [
                ['type' => 'text', 'name' => 'full_name', 'title' => ['default' => 'Your name']],
            ],
        ]]],
    ]);

    $page = visit("/forms/{$schema->slug}");

    $page->assertSee('Your name')                 // survey-core rendered the question
        ->fill('input[type=text]', 'Alice')
        ->click('Complete')                        // survey-core completion button
        ->assertSee('submitted')                   // our onComplete POST succeeded
        ->assertNoJavaScriptErrors();

    $submission = FormSubmission::query()->where('form_schema_id', $schema->id)->first();

    expect($submission)->not->toBeNull()
        ->and($submission->data)->toBe(['full_name' => 'Alice']);
});
