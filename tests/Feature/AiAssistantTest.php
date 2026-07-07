<?php

use App\Contracts\AiAssistant;
use App\Filament\Pages\DesignerPage;
use App\Models\User;
use App\Support\AiAssistantNotConfiguredException;
use App\Support\ClaudeAiAssistant;
use Illuminate\Support\Facades\Http;
use Livewire\Livewire;

beforeEach(function () {
    config()->set('formbuilder.ai.enabled', true);
    config()->set('formbuilder.ai.api_key', 'test-key');
    config()->set('formbuilder.ai.base_url', 'https://api.anthropic.com');
    config()->set('formbuilder.ai.model', 'claude-opus-4-8');
    config()->set('formbuilder.ai.max_tokens', 8000);
});

/** Fake the Anthropic Messages endpoint returning a text content block. */
function fakeClaude(string $text): void
{
    Http::fake([
        'api.anthropic.com/*' => Http::response([
            'content' => [
                ['type' => 'thinking', 'thinking' => '...'],
                ['type' => 'text', 'text' => $text],
            ],
        ]),
    ]);
}

it('binds the Claude assistant when AI is enabled with a key', function () {
    expect(app(AiAssistant::class))->toBeInstanceOf(ClaudeAiAssistant::class);
});

it('drafts a valid survey from a prompt', function () {
    fakeClaude(json_encode([
        'title' => ['default' => 'Feedback'],
        'pages' => [['name' => 'page1', 'elements' => [
            ['type' => 'text', 'name' => 'full_name', 'title' => ['default' => 'Name']],
        ]]],
    ]));

    $schema = app(ClaudeAiAssistant::class)->draftForm('a feedback form');

    expect($schema['pages'][0]['elements'][0]['name'])->toBe('full_name');

    Http::assertSent(fn ($request) => $request->url() === 'https://api.anthropic.com/v1/messages'
        && $request->hasHeader('x-api-key', 'test-key')
        && $request['model'] === 'claude-opus-4-8');
});

it('strips markdown fences before parsing', function () {
    fakeClaude("```json\n".json_encode([
        'pages' => [['name' => 'p1', 'elements' => [['type' => 'text', 'name' => 'q1']]]],
    ])."\n```");

    $schema = app(ClaudeAiAssistant::class)->draftForm('x');

    expect($schema['pages'][0]['elements'][0]['name'])->toBe('q1');
});

it('throws when the model returns non-JSON', function () {
    fakeClaude('Sorry, I could not build that.');
    app(ClaudeAiAssistant::class)->draftForm('x');
})->throws(RuntimeException::class);

it('rewrites a single element', function () {
    fakeClaude(json_encode(['type' => 'comment', 'name' => 'feedback', 'title' => ['default' => 'Your feedback']]));

    $element = app(ClaudeAiAssistant::class)->rewriteField(
        ['type' => 'text', 'name' => 'feedback'],
        'make it a long answer',
    );

    expect($element['type'])->toBe('comment');
});

it('throws not-configured when no api key is set', function () {
    config()->set('formbuilder.ai.api_key', null);
    app(ClaudeAiAssistant::class)->draftForm('x');
})->throws(AiAssistantNotConfiguredException::class);

it('returns an AI-drafted schema through the DesignerPage', function () {
    $this->actingAs(User::factory()->create());

    app()->bind(AiAssistant::class, fn () => new class implements AiAssistant
    {
        public function draftForm(string $prompt, array $context = []): array
        {
            return ['pages' => [['name' => 'page1', 'elements' => [['type' => 'rating', 'name' => 'nps']]]]];
        }

        public function rewriteField(array $element, string $prompt, array $context = []): array
        {
            return $element;
        }
    });

    Livewire::test(DesignerPage::class)
        ->call('aiDraft', 'an nps survey')
        ->assertReturned(fn ($r) => $r['ok'] === true
            && $r['schema']['pages'][0]['elements'][0]['name'] === 'nps');
});

it('reports not-configured through the DesignerPage when AI is off', function () {
    config()->set('formbuilder.ai.enabled', false);
    config()->set('formbuilder.ai.api_key', null);
    $this->actingAs(User::factory()->create());

    Livewire::test(DesignerPage::class)
        ->call('aiDraft', 'x')
        ->assertReturned(fn ($r) => $r['ok'] === false && str_contains($r['error'], 'not configured'));
});
