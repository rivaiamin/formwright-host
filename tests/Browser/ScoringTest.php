<?php

use App\Models\FormSchema;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

function scoredRadioSchema(array $overrides = []): array
{
    return array_merge([
        'pages' => [[
            'name' => 'page1',
            'elements' => [
                [
                    'type' => 'radiogroup',
                    'name' => 'q1',
                    'title' => ['default' => 'Pick one'],
                    'choices' => [
                        ['value' => 'a', 'text' => ['default' => 'Correct choice']],
                        ['value' => 'b', 'text' => ['default' => 'Wrong choice']],
                    ],
                ],
            ],
        ]],
    ], $overrides);
}

it('sets a correct answer and points, persisting scoring_enabled', function () {
    FormSchema::factory()->create(['json' => scoredRadioSchema()]);

    $page = visit('/admin/designer-page');

    $page->click('[data-element="q1"]')                 // select the radiogroup
        ->click('[data-testid="scoring-toggle"]')        // open Scoring section
        ->check('[data-testid="scored-toggle"]')
        ->select('[data-testid="correct-answer"]', 'a')
        ->fill('[data-testid="points"]', '5')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $record = FormSchema::query()->latest('id')->first();
    $el = $record->json['pages'][0]['elements'][0];

    expect($el['correctAnswer'])->toBe('a')
        ->and($el['points'])->toBe(5)
        ->and($record->scoring_enabled)->toBeTrue();
});

it('shows a live score tally in preview that credits a correct answer', function () {
    FormSchema::factory()->create([
        'json' => scoredRadioSchema([
            'pages' => [[
                'name' => 'page1',
                'elements' => [
                    [
                        'type' => 'radiogroup',
                        'name' => 'q1',
                        'title' => ['default' => 'Pick one'],
                        'choices' => [
                            ['value' => 'a', 'text' => ['default' => 'Correct choice']],
                            ['value' => 'b', 'text' => ['default' => 'Wrong choice']],
                        ],
                        'correctAnswer' => 'a',
                        'points' => 3,
                    ],
                ],
            ]],
        ]),
        'scoring_enabled' => true,
    ]);

    $page = visit('/admin/designer-page');

    $page->click('Preview')
        ->assertSee('Score: 0 / 3')          // total known before answering
        ->click('Correct choice')             // answer correctly in the rendered survey
        ->assertSee('Score: 3 / 3')
        ->assertNoJavaScriptErrors();
});
