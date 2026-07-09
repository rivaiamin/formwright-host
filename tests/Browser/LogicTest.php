<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('compiles a visual rule into a SurveyJS visibleIf expression', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')       // short_text_1
        ->click('[data-block-id="single_choice"]')      // single_choice_1 (selected)
        ->click('[data-testid="logic-toggle"]')         // open Logic section
        ->click('[data-testid="logic-add-condition"]')
        ->fill('.logic__val', 'yes')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = collect(FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'])
        ->firstWhere('name', 'single_choice_1');

    expect($el['visibleIf'])->toBe("{short_text_1} = 'yes'");
});

it('locks the visual editor and preserves a hand-authored expression', function () {
    $complex = "{q_age} > 18 and ({q_country} = 'US' or {q_country} = 'CA')";

    FormSchema::factory()->create(['json' => [
        'pages' => [[
            'name' => 'page1',
            'elements' => [
                ['type' => 'text', 'name' => 'q_age', 'inputType' => 'number'],
                ['type' => 'text', 'name' => 'q_country'],
                ['type' => 'text', 'name' => 'q_target', 'title' => ['default' => 'Target'], 'visibleIf' => $complex],
            ],
        ]],
    ]]);

    $page = visit('/admin/designer-page');

    $page->click('[data-element="q_target"]')          // select the element with complex logic
        ->click('[data-testid="logic-toggle"]')
        ->assertSee('too advanced')                     // escape hatch engaged
        ->assertPresent('[data-testid="logic-raw"]')
        ->assertMissing('.logic__val')                  // visual clause editor is hidden
        ->click('Save')
        ->assertSee('Saved');

    // Byte-for-byte preservation of the expression we don't fully understand.
    $el = collect(FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'])
        ->firstWhere('name', 'q_target');

    expect($el['visibleIf'])->toBe($complex);
});

it('lists dependencies in the logic map', function () {
    FormSchema::factory()->create(['json' => [
        'pages' => [[
            'name' => 'page1',
            'elements' => [
                ['type' => 'text', 'name' => 'q1'],
                ['type' => 'text', 'name' => 'q2', 'title' => ['default' => 'Second'], 'visibleIf' => "{q1} = 'x'"],
            ],
        ]],
    ]]);

    $page = visit('/admin/designer-page');

    // Nothing selected on load -> the property panel shows the dependency map.
    $page->assertPresent('[data-testid="logic-map"]')
        ->assertSee('Second')
        ->assertSee('depends on q1')
        ->assertNoJavaScriptErrors();
});
