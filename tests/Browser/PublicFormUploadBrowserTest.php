<?php

use Rivaiamin\Formwright\Models\FormSchema;
use Rivaiamin\Formwright\Models\FormSubmission;

/**
 * Verifies the public renderer's upload contract: a file / signature question
 * POSTs its bytes to the upload endpoint and stores the returned URL (not base64)
 * in the survey data, which then rides along into the submission.
 *
 * fetch() is intercepted in-browser so the assertion is deterministic and does
 * not depend on the test HTTP server (which cannot parse multipart uploads). The
 * real server-side storage path is covered by PublicFormUploadTest (feature).
 */
it('posts uploads to the endpoint and stores the returned url, not base64', function () {
    $schema = FormSchema::factory()->create([
        'json' => ['pages' => [[
            'name' => 'page1',
            'elements' => [
                ['type' => 'file', 'name' => 'attachment', 'title' => ['default' => 'Upload evidence']],
            ],
        ]]],
    ]);

    $page = visit("/forms/{$schema->slug}");
    $page->assertSee('Upload evidence');

    $page->script(<<<'JS'
        (() => {
            const survey = document.getElementById('formwright-form').survey;
            const original = window.fetch;
            window.__uploadCall = null;

            window.fetch = (url, options) => {
                if (typeof url === 'string' && url.includes('/uploads')) {
                    const body = options && options.body;
                    window.__uploadCall = {
                        url,
                        method: options && options.method,
                        fileCount: body instanceof FormData ? body.getAll('files[]').length : 0,
                    };

                    return Promise.resolve(new Response(
                        JSON.stringify([{ name: 'evidence.txt', url: 'https://cdn.example/formwright/evidence.txt' }]),
                        { status: 200, headers: { 'Content-Type': 'application/json' } },
                    ));
                }

                return original(url, options);
            };

            const file = new File(['hello formwright'], 'evidence.txt', { type: 'text/plain' });
            survey.getQuestionByName('attachment').loadFiles([file]);
            return true;
        })()
    JS);

    $page->assertSee('evidence.txt');

    $call = $page->script('(() => window.__uploadCall)()');

    expect($call['method'])->toBe('POST')
        ->and($call['url'])->toContain("/forms/{$schema->slug}/uploads")
        ->and($call['fileCount'])->toBe(1);

    $stored = $page->script(
        "(() => document.getElementById('formwright-form').survey.data.attachment[0].content)()",
    );

    expect($stored)->toBe('https://cdn.example/formwright/evidence.txt')
        ->not->toStartWith('data:');

    $page->click('Complete')
        ->assertSee('submitted')
        ->assertNoJavaScriptErrors();

    $submission = FormSubmission::query()->where('form_schema_id', $schema->id)->first();

    expect($submission)->not->toBeNull()
        ->and($submission->data['attachment'][0]['content'])
        ->toBe('https://cdn.example/formwright/evidence.txt');
});
