<?php

use App\Models\FormSchema;

it('persists and round-trips a SurveyJS schema through the json column', function () {
    $json = FormSchema::blankSchema('Round trip');

    $schema = FormSchema::create([
        'name' => 'Round trip',
        'json' => $json,
        'available_locales' => ['default', 'ar'],
        'scoring_enabled' => true,
    ]);

    $fresh = $schema->fresh();

    expect($fresh->json)->toBe($json)
        ->and($fresh->available_locales)->toBe(['default', 'ar'])
        ->and($fresh->scoring_enabled)->toBeTrue();
});

it('auto-generates a unique slug when none is given', function () {
    $a = FormSchema::create(['name' => 'Customer Survey', 'json' => FormSchema::blankSchema()]);
    $b = FormSchema::create(['name' => 'Customer Survey', 'json' => FormSchema::blankSchema()]);

    expect($a->slug)->toBe('customer-survey')
        ->and($b->slug)->toBe('customer-survey-2')
        ->and($b->slug)->not->toBe($a->slug);
});

it('uses the configured table name', function () {
    expect((new FormSchema)->getTable())->toBe(config('formbuilder.tables.form_schemas'));
});

it('builds a valid blank schema', function () {
    $blank = FormSchema::blankSchema('Hi');

    expect($blank)->toHaveKeys(['title', 'pages'])
        ->and($blank['pages'])->toHaveCount(1)
        ->and($blank['pages'][0]['elements'])->toBe([]);
});
