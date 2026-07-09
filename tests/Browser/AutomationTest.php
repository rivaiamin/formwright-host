<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;
use Rivaiamin\Formwright\Models\FormSubmission;

it('adds a calculated value and a trigger through the form settings', function () {
    $this->actingAs(User::factory()->create());

    $page = visit('/admin/designer-page');

    $page->assertSee('Formwright Designer')
        ->click('[data-testid="form-settings"]')
        ->click('[data-testid="automation-toggle"]')
        ->assertSee('Calculated values')
        ->click('[data-testid="calc-add"]')
        ->fill('.auto__chip', 'total')
        ->fill('.auto__expr', '{price} * {qty}')
        ->click('[data-testid="trigger-add"]')
        ->select('[data-testid="trigger-type"]', 'skip')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $json = FormSchema::query()->latest('id')->first()->json;

    expect($json['calculatedValues'][0]['name'])->toBe('total')
        ->and($json['calculatedValues'][0]['expression'])->toBe('{price} * {qty}')
        ->and($json['triggers'][0]['type'])->toBe('skip');
});

it('runs a setvalue trigger and a calculated value on the public form', function () {
    $schema = FormSchema::factory()->create([
        'json' => [
            'calculatedValues' => [
                ['name' => 'echo', 'expression' => '{q1}', 'includeIntoResult' => true],
            ],
            'triggers' => [
                ['type' => 'setvalue', 'expression' => "{q1} = 'vip'", 'setToName' => 'q2', 'setValue' => 'granted'],
            ],
            'pages' => [['name' => 'page1', 'elements' => [
                ['type' => 'text', 'name' => 'q1', 'title' => ['default' => 'Access code']],
                ['type' => 'text', 'name' => 'q2', 'title' => ['default' => 'Result']],
            ]]],
        ],
    ]);

    $page = visit("/forms/{$schema->slug}");

    $page->assertSee('Access code')
        ->fill('[data-name="q1"] input[type=text]', 'vip')   // q1 — flips the trigger condition true
        ->click('Complete')
        ->assertSee('submitted')
        ->assertNoJavaScriptErrors();

    $data = FormSubmission::query()->where('form_schema_id', $schema->id)->first()->data;

    // survey-core fired the setvalue trigger and computed the calculated value.
    expect($data['q1'])->toBe('vip')
        ->and($data['q2'])->toBe('granted')
        ->and($data['echo'])->toBe('vip');
});
