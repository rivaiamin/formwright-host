<?php

use App\Models\User;
use Rivaiamin\Formwright\Models\FormSchema;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('adds the newly supported types from the palette', function () {
    $page = visit('/admin/designer-page');

    $page->assertSee('Formwright Designer')
        ->click('[data-block-id="button_group"]')
        ->click('[data-block-id="image_picker"]')
        ->click('[data-block-id="matrix_dropdown"]')
        ->click('[data-block-id="matrix_dynamic"]')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $types = collect(FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'])
        ->pluck('type')->all();

    expect($types)->toBe(['buttongroup', 'imagepicker', 'matrixdropdown', 'matrixdynamic']);
});

it('edits an image picker choice image URL', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="image_picker"]')
        ->assertSee('Images')
        ->fill('[data-image-choice="option_1"] .imgc__url', 'https://example.test/a.png')
        ->click('[data-testid="image-choice-add"]')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($el['type'])->toBe('imagepicker')
        ->and($el['choices'])->toHaveCount(2)
        ->and($el['choices'][0]['imageLink'])->toBe('https://example.test/a.png');
});

it('edits matrix-dropdown columns with a cell type', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="matrix_dropdown"]')
        ->assertSee('Columns')
        ->assertSee('Cell options')
        ->click('[data-testid="matrix-column-add"]')
        ->select('[data-column="column2"] .mcol__type', 'rating')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($el['columns'])->toHaveCount(2)
        ->and($el['columns'][1]['cellType'])->toBe('rating')
        ->and($el['rows'])->toHaveCount(2)
        ->and($el['choices'])->toHaveCount(2);   // shared cell options
});

it('nests a field inside a panel and keeps it nested in the JSON', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="panel"]')            // adds + selects the panel
        ->assertPresent('[data-panel-zone="panel_1"]')
        ->click('[data-block-id="short_text"]')         // selection is the panel → lands inside
        ->assertPresent('[data-panel-zone="panel_1"] [data-element="short_text_1"]')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $elements = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'];

    expect($elements)->toHaveCount(1)                   // the field is NOT at page level
        ->and($elements[0]['type'])->toBe('panel')
        ->and($elements[0]['elements'])->toHaveCount(1)
        ->and($elements[0]['elements'][0]['name'])->toBe('short_text_1');
});

it('puts repeating-group children under templateElements', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="panel_dynamic"]')
        ->assertPresent('[data-element="panel_dynamic_1"][data-container="templateElements"]')
        ->click('[data-block-id="number"]')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($el['type'])->toBe('paneldynamic')
        ->and($el)->not->toHaveKey('elements')
        ->and($el['templateElements'])->toHaveCount(1)
        ->and($el['templateElements'][0]['name'])->toBe('number_1');
});

it('deletes and duplicates a nested field through the recursive locator', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="panel"]')
        ->click('[data-block-id="short_text"]')                  // inside the panel
        ->click('[data-panel-zone="panel_1"] [data-element="short_text_1"] [data-action="duplicate"]')
        ->assertPresent('[data-panel-zone="panel_1"] [data-element="short_text_1_copy"]')
        ->click('[data-panel-zone="panel_1"] [data-element="short_text_1"] [data-action="delete"]')
        ->assertMissing('[data-element="short_text_1"]')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $panel = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($panel['elements'])->toHaveCount(1)
        ->and($panel['elements'][0]['name'])->toBe('short_text_1_copy');
});

it('duplicating a panel uniquifies its children names', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="panel"]')
        ->click('[data-block-id="short_text"]')
        ->click('[data-element="panel_1"] > .panelcard__head [data-action="duplicate"]')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $elements = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'];

    expect($elements)->toHaveCount(2)
        ->and($elements[1]['name'])->toBe('panel_1_copy')
        // The copied child must NOT reuse the original's name.
        ->and($elements[1]['elements'][0]['name'])->toBe('short_text_1_2');
});

it('renders every newly supported type on the public form', function () {
    $schema = FormSchema::factory()->create([
        'json' => ['pages' => [['name' => 'page1', 'elements' => [
            ['type' => 'buttongroup', 'name' => 'bg', 'title' => ['default' => 'Button group here'], 'choices' => [['value' => 'x', 'text' => ['default' => 'Ex']]]],
            ['type' => 'imagepicker', 'name' => 'ip', 'title' => ['default' => 'Image picker here'], 'choices' => [['value' => 'a', 'imageLink' => 'https://example.test/a.png']]],
            ['type' => 'matrixdropdown', 'name' => 'md', 'title' => ['default' => 'Matrix cells here'],
                'columns' => [['name' => 'c1', 'title' => 'Col one', 'cellType' => 'dropdown']],
                'rows' => [['value' => 'r1', 'text' => ['default' => 'Row one']]],
                'choices' => [['value' => 'one', 'text' => ['default' => 'One']]]],
            ['type' => 'matrixdynamic', 'name' => 'mdy', 'title' => ['default' => 'Matrix rows here'],
                'columns' => [['name' => 'c1', 'title' => 'Dyn col', 'cellType' => 'text']], 'rowCount' => 2],
            ['type' => 'panel', 'name' => 'pnl', 'title' => ['default' => 'Panel here'], 'elements' => [
                ['type' => 'text', 'name' => 'inner', 'title' => ['default' => 'Inner field']],
            ]],
            ['type' => 'paneldynamic', 'name' => 'pdyn', 'title' => ['default' => 'Repeating here'],
                'templateElements' => [['type' => 'text', 'name' => 'tmpl', 'title' => ['default' => 'Template field']]],
                'panelCount' => 1],
        ]]]],
    ]);

    visit("/forms/{$schema->slug}")
        ->assertSee('Button group here')
        ->assertSee('Image picker here')
        ->assertSee('Matrix cells here')
        ->assertSee('Matrix rows here')
        ->assertSee('Panel here')
        ->assertSee('Inner field')
        ->assertSee('Repeating here')
        ->assertSee('Template field')
        ->assertNoJavaScriptErrors();
});

it('adds a colour field as text with inputType colour', function () {
    $page = visit('/admin/designer-page');

    $page->assertSee('Formwright Designer')
        ->click('[data-block-id="color"]')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($el['type'])->toBe('text')
        ->and($el['inputType'])->toBe('color');
});

it('sets help-text position and min/max width on a field', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')
        ->click('[data-testid="appearance-toggle"]')
        ->select('[data-testid="description-location"]', 'underTitle')
        ->fill('[data-testid="field-min-width"]', '200px')
        ->fill('[data-testid="field-max-width"]', '480px')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $el = FormSchema::query()->latest('id')->first()->json['pages'][0]['elements'][0];

    expect($el['descriptionLocation'])->toBe('underTitle')
        ->and($el['minWidth'])->toBe('200px')
        ->and($el['maxWidth'])->toBe('480px');
});

it('sets survey-wide completion props (auto-submit, already-submitted & loading HTML)', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-block-id="short_text"]')          // give the preview content
        ->click('[data-testid="form-settings"]')
        ->uncheck('[data-testid="survey-autocomplete"]')   // default true -> store false
        ->fill('#prop-completedBeforeHtml', 'You already responded.')
        ->fill('#prop-loadingHtml', 'Loading…')
        ->click('Save')
        ->assertSee('Saved')
        ->assertNoJavaScriptErrors();

    $schema = FormSchema::query()->latest('id')->first()->json;

    expect($schema['allowCompleteSurveyAutomatic'])->toBeFalse()
        ->and(data_get($schema, 'completedBeforeHtml.default'))->toBe('You already responded.')
        ->and(data_get($schema, 'loadingHtml.default'))->toBe('Loading…');
});
