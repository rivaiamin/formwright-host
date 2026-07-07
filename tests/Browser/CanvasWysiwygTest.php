<?php

use App\Models\FormSchema;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

function sampleForm(): FormSchema
{
    return FormSchema::factory()->create(['json' => [
        'title' => ['default' => 'Product Experience Survey'],
        'pages' => [['name' => 'page1', 'elements' => [
            ['type' => 'text', 'name' => 'your_name', 'title' => ['default' => 'Your name'], 'isRequired' => true],
            ['type' => 'rating', 'name' => 'satisfaction', 'title' => ['default' => 'How satisfied are you?'], 'rateMax' => 5],
            ['type' => 'radiogroup', 'name' => 'plan', 'title' => ['default' => 'Which plan are you on?'], 'choices' => [
                ['value' => 'free', 'text' => ['default' => 'Free']],
                ['value' => 'pro', 'text' => ['default' => 'Pro']],
                ['value' => 'enterprise', 'text' => ['default' => 'Enterprise']],
            ]],
            ['type' => 'comment', 'name' => 'anything', 'title' => ['default' => "Anything else you'd like to share?"]],
        ]]],
    ]]);
}

it('renders WYSIWYG previews for each question type', function () {
    sampleForm();

    $page = visit('/admin/designer-page');

    $page->assertSee('Your name')
        ->assertSee('How satisfied are you?')
        ->assertSee('Free')            // single-choice options rendered on the card
        ->assertSee('Pro')
        ->assertSee('Enterprise')
        ->assertSee('★')               // rating stars rendered
        ->assertNoJavaScriptErrors()
        ->screenshot();
});

it('duplicates a question in place', function () {
    sampleForm();

    $page = visit('/admin/designer-page');

    $page->click('[data-element="plan"] [data-action="duplicate"]')
        ->assertPresent('[data-element="plan_copy"]')   // the copy appears
        ->click('Save')
        ->assertSee('Saved');

    $elements = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'];
    $names = collect($elements)->pluck('name');

    expect($names)->toContain('plan')->toContain('plan_copy')
        ->and($elements)->toHaveCount(5);
});
