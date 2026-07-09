<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Rivaiamin\Formwright\Models\FormSchema;

function uploadSchema(): FormSchema
{
    return FormSchema::factory()->create([
        'json' => ['pages' => [['name' => 'page1', 'elements' => [
            ['type' => 'file', 'name' => 'attachment', 'title' => ['default' => 'Attachment']],
        ]]]],
    ]);
}

beforeEach(function () {
    Storage::fake('public');
    config()->set('formbuilder.uploads.disk', 'public');
    config()->set('formbuilder.uploads.path_prefix', 'formwright');
});

it('stores an uploaded file on the disk and returns its url', function () {
    $schema = uploadSchema();
    $file = UploadedFile::fake()->create('résumé final.pdf', 12, 'application/pdf');

    $response = $this->post("/forms/{$schema->slug}/uploads", ['files' => [$file]])
        ->assertOk();

    $stored = $response->json();

    expect($stored)->toHaveCount(1)
        ->and($stored[0]['name'])->toBe('resume-final.pdf')
        ->and($stored[0]['path'])->toStartWith("formwright/{$schema->slug}/")
        ->and($stored[0]['url'])->toContain($stored[0]['path']);

    Storage::disk('public')->assertExists($stored[0]['path']);
});

it('nests uploads under the tenant id when the schema carries one', function () {
    $schema = uploadSchema();
    $schema->forceFill(['tenant_id' => 42])->save();

    $response = $this->post("/forms/{$schema->slug}/uploads", [
        'files' => [UploadedFile::fake()->create('a.pdf', 4)],
    ])->assertOk();

    expect($response->json('0.path'))->toStartWith("formwright/tenant-42/{$schema->slug}/");
});

it('rejects an upload over the configured max size', function () {
    config()->set('formbuilder.uploads.max_size_kb', 100);
    $schema = uploadSchema();

    $this->postJson("/forms/{$schema->slug}/uploads", [
        'files' => [UploadedFile::fake()->create('big.pdf', 200)],
    ])->assertStatus(422)->assertJsonValidationErrorFor('files.0');

    expect(Storage::disk('public')->allFiles())->toBeEmpty();
});

it('requires at least one file', function () {
    $schema = uploadSchema();

    $this->postJson("/forms/{$schema->slug}/uploads", [])
        ->assertStatus(422)
        ->assertJsonValidationErrorFor('files');
});

it('returns 404 uploading to an unknown slug', function () {
    $this->post('/forms/does-not-exist/uploads', [
        'files' => [UploadedFile::fake()->create('a.pdf', 1)],
    ])->assertNotFound();
});
