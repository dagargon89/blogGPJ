<?php

namespace App\Support;

final class YoutubeVideoId
{
    /**
     * Extrae el ID de video de una URL de YouTube o devuelve el valor si ya es un ID de 11 caracteres.
     */
    public static function normalize(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim($value);

        if ($value === '') {
            return null;
        }

        if (preg_match('/^[a-zA-Z0-9_-]{11}$/', $value) === 1) {
            return $value;
        }

        $patterns = [
            '#youtu\.be/([a-zA-Z0-9_-]{11})#',
            '#[\?&]v=([a-zA-Z0-9_-]{11})#',
            '#youtube\.com/embed/([a-zA-Z0-9_-]{11})#',
            '#youtube-nocookie\.com/embed/([a-zA-Z0-9_-]{11})#',
            '#youtube\.com/shorts/([a-zA-Z0-9_-]{11})#',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $value, $matches) === 1) {
                return $matches[1];
            }
        }

        return $value;
    }
}
