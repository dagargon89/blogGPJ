<?php

test('brand logo file exists in public directory', function (): void {
    $path = public_path('images/brand-logo.png');

    expect(file_exists($path))->toBeTrue()
        ->and(filesize($path))->toBeGreaterThan(100);
});
