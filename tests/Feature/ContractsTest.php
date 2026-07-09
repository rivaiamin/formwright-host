<?php

use App\Models\User;
use Rivaiamin\Formwright\Contracts\AccessPolicy;
use Rivaiamin\Formwright\Contracts\AiAssistant;
use Rivaiamin\Formwright\Contracts\RuntimeContext;
use Rivaiamin\Formwright\Contracts\SubmissionStore;
use Rivaiamin\Formwright\Contracts\UrlResolver;
use Rivaiamin\Formwright\Models\FormSchema;
use Rivaiamin\Formwright\Models\FormSubmission;
use Rivaiamin\Formwright\Support\AiAssistantNotConfiguredException;
use Rivaiamin\Formwright\Support\DefaultAccessPolicy;
use Rivaiamin\Formwright\Support\DefaultRuntimeContext;
use Rivaiamin\Formwright\Support\DefaultUrlResolver;
use Rivaiamin\Formwright\Support\EloquentSubmissionStore;
use Rivaiamin\Formwright\Support\NullAiAssistant;

it('binds every contract to its default implementation', function () {
    expect(app(SubmissionStore::class))->toBeInstanceOf(EloquentSubmissionStore::class)
        ->and(app(RuntimeContext::class))->toBeInstanceOf(DefaultRuntimeContext::class)
        ->and(app(AccessPolicy::class))->toBeInstanceOf(DefaultAccessPolicy::class)
        ->and(app(AiAssistant::class))->toBeInstanceOf(NullAiAssistant::class)
        ->and(app(UrlResolver::class))->toBeInstanceOf(DefaultUrlResolver::class);
});

it('has sensible default access rules', function () {
    $schema = FormSchema::factory()->create();
    $policy = app(AccessPolicy::class);
    $user = User::factory()->create();

    expect($policy->canView($schema, null))->toBeTrue()
        ->and($policy->canSubmit($schema, null))->toBeTrue()
        ->and($policy->canEdit($schema, null))->toBeFalse()
        ->and($policy->canEdit($schema, $user))->toBeTrue();
});

it('resolves the runtime locale', function () {
    app()->setLocale('fr');

    expect(app(RuntimeContext::class)->locale())->toBe('fr');
});

it('builds a public form url, with and without a locale', function () {
    $schema = FormSchema::factory()->create();
    $resolver = app(UrlResolver::class);

    expect($resolver->publicFormUrl($schema))->toContain("/forms/{$schema->slug}")
        ->and($resolver->publicFormUrl($schema, 'ar'))->toContain('locale=ar');
});

it('throws until an AI assistant is configured', function () {
    app(AiAssistant::class)->draftForm('a contact form');
})->throws(AiAssistantNotConfiguredException::class);

it('lets a host rebind the AccessPolicy to deny submissions (403)', function () {
    $schema = FormSchema::factory()->create([
        'json' => ['pages' => [['name' => 'page1', 'elements' => [['type' => 'text', 'name' => 'q']]]]],
    ]);

    app()->bind(AccessPolicy::class, function () {
        return new class extends DefaultAccessPolicy
        {
            public function canSubmit(FormSchema $schema, $user): bool
            {
                return false;
            }
        };
    });

    $this->postJson("/forms/{$schema->slug}", ['data' => ['q' => 'x']])->assertForbidden();

    expect(FormSubmission::count())->toBe(0);
});
