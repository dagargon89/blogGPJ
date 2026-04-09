<?php

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;

test('firebase disk resolves the custom gcs driver without InvalidArgumentException', function () {
    $fixturePath = base_path('tests/fixtures/gcs-service-account.test.json');

    if (! is_readable($fixturePath)) {
        test()->markTestSkipped('Missing tests/fixtures/gcs-service-account.test.json');
    }

    Config::set('filesystems.disks.firebase', [
        'driver' => 'gcs',
        'key_file_path' => $fixturePath,
        'key_file' => [],
        'project_id' => 'test-project-fixture',
        'bucket' => 'test-bucket-fixture',
        'path_prefix' => '',
        'storage_api_uri' => null,
        'visibility' => 'public',
        'throw' => false,
        'report' => false,
    ]);

    Storage::forgetDisk('firebase');

    $disk = Storage::disk('firebase');

    expect($disk)->toBeInstanceOf(FilesystemAdapter::class);
});
