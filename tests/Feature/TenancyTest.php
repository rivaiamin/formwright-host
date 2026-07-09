<?php

use Rivaiamin\Formwright\Models\FormSchema;
use Rivaiamin\Formwright\Models\FormSubmission;
use Rivaiamin\Formwright\Support\Tenancy;

afterEach(function () {
    Tenancy::forgetResolver();
});

/** Enable tenancy and pin the "current" tenant to a given id. */
function actingAsTenant(?int $id): void
{
    config()->set('formbuilder.tenancy.enabled', true);
    Tenancy::resolveUsing(fn () => $id);
}

it('does not scope anything while tenancy is disabled', function () {
    FormSchema::factory()->create();
    FormSchema::factory()->create();

    // Default config has tenancy disabled.
    expect(FormSchema::count())->toBe(2);
});

it('stamps new records with the current tenant id', function () {
    actingAsTenant(7);

    $schema = FormSchema::factory()->create();

    expect($schema->tenant_id)->toBe(7);
});

it('scopes reads to the current tenant', function () {
    actingAsTenant(1);
    FormSchema::factory()->create(['name' => 'Tenant 1 form']);

    actingAsTenant(2);
    FormSchema::factory()->create(['name' => 'Tenant 2 form']);

    // As tenant 2, only tenant 2's schema is visible.
    expect(FormSchema::count())->toBe(1)
        ->and(FormSchema::first()->name)->toBe('Tenant 2 form');

    // Switch back to tenant 1.
    actingAsTenant(1);
    expect(FormSchema::count())->toBe(1)
        ->and(FormSchema::first()->name)->toBe('Tenant 1 form');
});

it('isolates submissions per tenant', function () {
    actingAsTenant(1);
    $s1 = FormSchema::factory()->create();
    FormSubmission::factory()->for($s1, 'schema')->create();

    actingAsTenant(2);
    $s2 = FormSchema::factory()->create();
    FormSubmission::factory()->for($s2, 'schema')->create();
    FormSubmission::factory()->for($s2, 'schema')->create();

    expect(FormSubmission::count())->toBe(2);          // tenant 2 sees its two
    expect($s2->tenant_id)->toBe(2);

    actingAsTenant(1);
    expect(FormSubmission::count())->toBe(1);          // tenant 1 sees its one
});

it('can reach across tenants when the scope is removed', function () {
    actingAsTenant(1);
    FormSchema::factory()->create();
    actingAsTenant(2);
    FormSchema::factory()->create();

    // withoutGlobalScope('tenant') is the escape hatch for admin/cross-tenant work.
    expect(FormSchema::withoutGlobalScope('tenant')->count())->toBe(2);
});
