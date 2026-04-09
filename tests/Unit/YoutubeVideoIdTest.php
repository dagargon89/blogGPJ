<?php

use App\Support\YoutubeVideoId;

test('normaliza URL de watch con parámetros extra', function () {
    $url = 'https://www.youtube.com/watch?v=G9rCpwYeho0&pp=ygUNY2xhdWRlIIGNvd29yaw%3D%3D';

    expect(YoutubeVideoId::normalize($url))->toBe('G9rCpwYeho0');
});

test('acepta ID de 11 caracteres sin cambios', function () {
    expect(YoutubeVideoId::normalize('G9rCpwYeho0'))->toBe('G9rCpwYeho0');
});

test('extrae ID de youtu.be', function () {
    expect(YoutubeVideoId::normalize('https://youtu.be/dQw4w9WgXcQ'))->toBe('dQw4w9WgXcQ');
});

test('extrae ID de shorts', function () {
    expect(YoutubeVideoId::normalize('https://www.youtube.com/shorts/abcDeFGhIj0'))->toBe('abcDeFGhIj0');
});

test('devuelve null para vacío o null', function () {
    expect(YoutubeVideoId::normalize(null))->toBeNull();
    expect(YoutubeVideoId::normalize(''))->toBeNull();
    expect(YoutubeVideoId::normalize('   '))->toBeNull();
});
