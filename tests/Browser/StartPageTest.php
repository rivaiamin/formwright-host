<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;

it('turns the first page into a welcome screen and shows the badge', function () {
    $this->actingAs(User::factory()->create());

    $page = visit('/admin/designer-page');

    $page->assertSee('Formwright Designer')
        ->click('[data-testid="form-settings"]')
        ->assertSee('Start page')
        ->check('[data-testid="first-page-started"]')
        ->fill('#prop-startSurveyText', 'Begin now')
        ->assertSee('Start page')                    // canvas badge on page 1
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $json = FormSchema::query()->latest('id')->first()->json;

    expect($json['firstPageIsStarted'])->toBeTrue()
        ->and($json['startSurveyText']['default'])->toBe('Begin now');
});

it('renders the start button on the public form', function () {
    $schema = FormSchema::factory()->create([
        'json' => [
            'firstPageIsStarted' => true,
            'startSurveyText' => ['default' => 'Begin now'],
            'pages' => [
                ['name' => 'intro', 'elements' => [
                    ['type' => 'html', 'name' => 'welcome', 'html' => ['default' => 'Welcome to the survey']],
                ]],
                ['name' => 'page1', 'elements' => [
                    ['type' => 'text', 'name' => 'full_name', 'title' => ['default' => 'Your name']],
                ]],
            ],
        ],
    ]);

    visit("/forms/{$schema->slug}")
        ->assertSee('Begin now')                     // survey-core rendered the Start button
        ->assertNoJavaScriptErrors();
});
