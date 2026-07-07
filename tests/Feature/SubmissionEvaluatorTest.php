<?php

use App\Support\SubmissionEvaluator;

beforeEach(function () {
    $this->evaluator = new SubmissionEvaluator;
});

function schemaWith(array $elements): array
{
    return ['pages' => [['name' => 'page1', 'elements' => $elements]]];
}

it('flags an unconditionally required field that is missing or empty', function () {
    $schema = schemaWith([['type' => 'text', 'name' => 'email', 'isRequired' => true]]);

    expect($this->evaluator->validateRequired($schema, []))->toHaveKey('email');
    expect($this->evaluator->validateRequired($schema, ['email' => '']))->toHaveKey('email');
    expect($this->evaluator->validateRequired($schema, ['email' => 'a@b.co']))->toBe([]);
});

it('does not enforce a conditionally-required (visibleIf) field', function () {
    $schema = schemaWith([
        ['type' => 'text', 'name' => 'x', 'isRequired' => true, 'visibleIf' => "{y} = 'z'"],
    ]);

    expect($this->evaluator->validateRequired($schema, []))->toBe([]);
});

it('returns null score when nothing is scored', function () {
    $schema = schemaWith([['type' => 'text', 'name' => 'q']]);

    expect($this->evaluator->score($schema, ['q' => 'anything']))->toBeNull();
});

it('sums points for correct answers, including multi-answer sets', function () {
    $schema = schemaWith([
        ['type' => 'radiogroup', 'name' => 'q1', 'correctAnswer' => 'a', 'points' => 2],
        ['type' => 'checkbox', 'name' => 'q2', 'correctAnswer' => ['x', 'y'], 'points' => 3],
        ['type' => 'text', 'name' => 'q3', 'correctAnswer' => 'hi'],
    ]);

    // q1 right (2) + q2 right regardless of order (3) + q3 wrong (0) = 5
    $score = $this->evaluator->score($schema, ['q1' => 'a', 'q2' => ['y', 'x'], 'q3' => 'bye']);

    expect($score)->toBe(5);
});
