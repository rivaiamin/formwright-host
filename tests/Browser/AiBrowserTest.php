<?php

use App\Contracts\AiAssistant;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());

    // Deterministic fake so the browser flow doesn't hit a real LLM.
    app()->bind(AiAssistant::class, fn () => new class implements AiAssistant
    {
        public function draftForm(string $prompt, array $context = []): array
        {
            return [
                'title' => ['default' => 'AI drafted'],
                'pages' => [['name' => 'page1', 'elements' => [
                    ['type' => 'text', 'name' => 'ai_question', 'title' => ['default' => 'AI Question']],
                ]]],
            ];
        }

        public function rewriteField(array $element, string $prompt, array $context = []): array
        {
            return $element;
        }
    });
});

it('drafts a form with AI, applies it, and can undo', function () {
    $page = visit('/admin/designer-page');

    $page->click('[data-testid="ai-fab"]')             // open the AI assistant
        ->assertPresent('[data-testid="ai-panel"]')
        ->fill('[data-testid="ai-prompt"]', 'a one-question survey')
        ->click('[data-testid="ai-draft"]')
        ->assertSee('Proposed form')                 // proposal preview shown, not auto-applied
        ->click('[data-testid="ai-apply"]')
        ->assertSee('AI Question')                    // the drafted field is now on the canvas
        ->assertNoJavaScriptErrors();

    // Undo restores the previous (empty) schema.
    $page->click('[data-testid="ai-undo"]')
        ->assertDontSee('AI Question');
});
