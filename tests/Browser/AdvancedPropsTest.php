<?php

use App\Models\FormSchema;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('persists survey-wide advanced properties', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-testid="form-settings"]')
        ->click('[data-testid="survey-advanced-toggle"]')
        ->assertSee('Title pattern')
        ->select('[data-testid="survey-titlepattern"]', 'numTitle')
        ->select('[data-testid="survey-questionsorder"]', 'random')
        ->fill('[data-testid="survey-cookie"]', 'my_form_done')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $json = FormSchema::query()->latest('id')->first()->json;

    expect($json['questionTitlePattern'])->toBe('numTitle')
        ->and($json['questionsOrder'])->toBe('random')
        ->and($json['cookieName'])->toBe('my_form_done');
});

it('persists page-level advanced properties', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-testid="page-select"]')
        ->click('[data-testid="page-advanced-toggle"]')
        ->check('[data-testid="page-readonly"]')
        ->fill('#page-enableif', "{plan} = 'pro'")
        ->select('[data-testid="page-title-location"]', 'left')
        ->fill('#page-maxwidth', '720px')
        ->fill('#page-timelimit', '120')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $firstPage = FormSchema::query()->latest('id')->first()->json['pages'][0];

    expect($firstPage['readOnly'])->toBeTrue()
        ->and($firstPage['enableIf'])->toBe("{plan} = 'pro'")
        ->and($firstPage['questionTitleLocation'])->toBe('left')
        ->and($firstPage['maxWidth'])->toBe('720px')
        ->and($firstPage['maxTimeToFinish'])->toBe(120);
});
