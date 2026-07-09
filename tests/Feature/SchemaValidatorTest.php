<?php

use Rivaiamin\Formwright\Support\SchemaValidationException;
use Rivaiamin\Formwright\Support\SchemaValidator;

beforeEach(function () {
    $this->validator = new SchemaValidator;
});

function validSurvey(): array
{
    return [
        'title' => ['default' => 'Test'],
        'pages' => [[
            'name' => 'page1',
            'elements' => [
                ['type' => 'text', 'name' => 'full_name'],
                ['type' => 'rating', 'name' => 'satisfaction', 'rateMax' => 5],
            ],
        ]],
    ];
}

it('accepts a well-formed survey', function () {
    expect($this->validator->passes(validSurvey()))->toBeTrue();
    expect($this->validator->validate(validSurvey()))->toBe(validSurvey());
});

it('accepts an empty-page survey', function () {
    expect($this->validator->passes([
        'pages' => [['name' => 'page1', 'elements' => []]],
    ]))->toBeTrue();
});

it('preserves and accepts unknown (advanced) element types', function () {
    $schema = [
        'pages' => [[
            'name' => 'p1',
            'elements' => [
                ['type' => 'matrixdynamic', 'name' => 'grid', 'columns' => [['name' => 'c1']]],
            ],
        ]],
    ];

    expect($this->validator->passes($schema))->toBeTrue();
});

it('rejects a schema with no pages array', function () {
    $this->validator->validate(['title' => 'x']);
})->throws(SchemaValidationException::class);

it('rejects a non-array schema', function () {
    $this->validator->validate('not a survey');
})->throws(SchemaValidationException::class);

it('rejects an element missing a type', function () {
    expect($this->validator->passes([
        'pages' => [['name' => 'p1', 'elements' => [['name' => 'orphan']]]],
    ]))->toBeFalse();
});

it('rejects an element missing a name', function () {
    expect($this->validator->passes([
        'pages' => [['name' => 'p1', 'elements' => [['type' => 'text']]]],
    ]))->toBeFalse();
});

it('rejects duplicate element names, including nested ones', function () {
    $schema = [
        'pages' => [[
            'name' => 'p1',
            'elements' => [
                ['type' => 'text', 'name' => 'dupe'],
                ['type' => 'panel', 'name' => 'wrap', 'elements' => [
                    ['type' => 'text', 'name' => 'dupe'],
                ]],
            ],
        ]],
    ];

    try {
        $this->validator->validate($schema);
        $this->fail('Expected duplicate names to be rejected.');
    } catch (SchemaValidationException $e) {
        expect(implode(' ', $e->errors))->toContain('dupe');
    }
});
