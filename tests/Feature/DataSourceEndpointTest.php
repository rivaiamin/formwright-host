<?php

use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Rivaiamin\Formwright\Contracts\AccessPolicy;
use Rivaiamin\Formwright\Contracts\DataSourceResolver;
use Rivaiamin\Formwright\Models\FormSchema;
use Rivaiamin\Formwright\Support\ConfigDataSourceResolver;

/** Register an allowlisted "people" source backed by the host User model. */
function configurePeopleSource(array $overrides = []): void
{
    config()->set('formbuilder.data_sources', [
        'people' => array_merge([
            'label' => 'People',
            'model' => User::class,
            'value' => 'id',
            'text' => 'name',
            'search_columns' => ['name', 'email'],
            'limit' => 50,
        ], $overrides),
    ]);
}

function dataSourceSchema(): FormSchema
{
    return FormSchema::factory()->create([
        'json' => ['pages' => [['name' => 'page1', 'elements' => [
            ['type' => 'dropdown', 'name' => 'person', 'dataSource' => 'people'],
        ]]]],
    ]);
}

it('binds the resolver contract to the config default', function () {
    expect(app(DataSourceResolver::class))->toBeInstanceOf(ConfigDataSourceResolver::class);
});

it('returns options for an allowlisted source', function () {
    configurePeopleSource();
    User::factory()->count(3)->create();
    $schema = dataSourceSchema();

    $this->getJson("/forms/{$schema->slug}/data-sources/people")
        ->assertOk()
        ->assertJsonCount(3, 'items')
        ->assertJsonPath('total', 3)
        ->assertJsonStructure(['items' => [['value', 'text']], 'total']);
});

it('narrows options by a search term', function () {
    configurePeopleSource();
    User::factory()->create(['name' => 'Alice Adams']);
    User::factory()->create(['name' => 'Bob Brown']);
    $schema = dataSourceSchema();

    $this->getJson("/forms/{$schema->slug}/data-sources/people?q=Alice")
        ->assertOk()
        ->assertJsonCount(1, 'items')
        ->assertJsonPath('items.0.text', 'Alice Adams');
});

it('narrows options by a cascade filter value', function () {
    configurePeopleSource(['filter_column' => 'name']);
    User::factory()->create(['name' => 'Keep Me']);
    User::factory()->create(['name' => 'Drop Me']);
    $schema = dataSourceSchema();

    $this->getJson("/forms/{$schema->slug}/data-sources/people?filter=Keep+Me")
        ->assertOk()
        ->assertJsonCount(1, 'items')
        ->assertJsonPath('items.0.text', 'Keep Me');
});

it('paginates with skip and take, keeping the full total', function () {
    configurePeopleSource();
    User::factory()->count(5)->create();
    $schema = dataSourceSchema();

    $this->getJson("/forms/{$schema->slug}/data-sources/people?skip=0&take=2")
        ->assertOk()
        ->assertJsonCount(2, 'items')
        ->assertJsonPath('total', 5);
});

it('resolves display labels for already-selected values', function () {
    configurePeopleSource();
    $user = User::factory()->create(['name' => 'Selected Person']);
    $schema = dataSourceSchema();

    $this->getJson("/forms/{$schema->slug}/data-sources/people?values={$user->id}")
        ->assertOk()
        ->assertJsonPath('0.text', 'Selected Person')
        ->assertJsonPath('0.value', $user->id);
});

it('404s for a key that is not in the allowlist', function () {
    configurePeopleSource();
    $schema = dataSourceSchema();

    // Even a real model name is unreachable unless it is a configured key.
    $this->getJson("/forms/{$schema->slug}/data-sources/users")->assertNotFound();
    $this->getJson("/forms/{$schema->slug}/data-sources/people")->assertOk();
});

it('403s when the access policy denies viewing', function () {
    configurePeopleSource();
    $schema = dataSourceSchema();

    $this->app->bind(AccessPolicy::class, fn () => new class implements AccessPolicy
    {
        public function canView(FormSchema $schema, ?Authenticatable $user): bool
        {
            return false;
        }

        public function canEdit(FormSchema $schema, ?Authenticatable $user): bool
        {
            return false;
        }

        public function canSubmit(FormSchema $schema, ?Authenticatable $user): bool
        {
            return true;
        }
    });

    $this->getJson("/forms/{$schema->slug}/data-sources/people")->assertForbidden();
});

it('exposes the configured sources through the resolver catalog', function () {
    configurePeopleSource();

    expect(app(DataSourceResolver::class)->catalog())
        ->toBe([['key' => 'people', 'label' => 'People']]);
});
