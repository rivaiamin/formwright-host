<?php

use App\Models\FormSchema;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

function twoFieldForm(array $targetExtra = []): FormSchema
{
    return FormSchema::factory()->create(['json' => [
        'pages' => [['name' => 'page1', 'elements' => [
            ['type' => 'text', 'name' => 'q_a', 'title' => ['default' => 'A']],
            array_merge(['type' => 'text', 'name' => 'q_target', 'title' => ['default' => 'Target']], $targetExtra),
        ]]],
    ]]);
}

it('compiles a Hide action to a negated visibleIf', function () {
    twoFieldForm();

    $page = visit('/admin/designer-page');

    $page->click('[data-element="q_target"]')
        ->click('[data-testid="logic-toggle"]')
        ->select('[data-testid="logic-target"]', 'hide')
        ->click('[data-testid="logic-add-condition"]')
        ->fill('.logic__val', 'x')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = collect(FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'])
        ->firstWhere('name', 'q_target');

    // Hide when {q_a} = 'x'  →  visible when {q_a} != 'x'
    expect($el['visibleIf'])->toBe("{q_a} != 'x'")
        ->and($el)->not->toHaveKey('enableIf');
});

it('compiles a Disable action to enableIf and round-trips it', function () {
    twoFieldForm();

    $page = visit('/admin/designer-page');

    $page->click('[data-element="q_target"]')
        ->click('[data-testid="logic-toggle"]')
        ->select('[data-testid="logic-target"]', 'disable')
        ->click('[data-testid="logic-add-condition"]')
        ->fill('.logic__val', 'x')
        ->click('Save')
        ->assertSee('Saved');

    $el = collect(FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'])
        ->firstWhere('name', 'q_target');

    expect($el['enableIf'])->toBe("{q_a} != 'x'")
        ->and($el)->not->toHaveKey('visibleIf');

    // Reload a schema carrying that enableIf → the editor shows Disable + the rule.
    twoFieldForm(['enableIf' => "{q_a} != 'x'"]);

    visit('/admin/designer-page')
        ->click('[data-element="q_target"]')
        ->click('[data-testid="logic-toggle"]')
        ->assertValue('[data-testid="logic-target"]', 'disable')
        ->assertValue('.logic__val', 'x');
});

it('sets a required-field message and shows the rename warning', function () {
    twoFieldForm(['isRequired' => true]);

    $page = visit('/admin/designer-page');

    $page->click('[data-element="q_target"]')
        ->click('[data-testid="advanced-toggle"]')
        ->assertSee('Warning: renaming may break previously stored results.')
        ->fill('#prop-requiredErrorText', 'Please answer this question')
        ->click('Save')
        ->assertSee('Saved');

    $el = collect(FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'])
        ->firstWhere('name', 'q_target');

    expect($el['requiredErrorText'])->toMatchArray(['default' => 'Please answer this question']);
});
