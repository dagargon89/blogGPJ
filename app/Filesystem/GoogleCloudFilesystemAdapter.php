<?php

namespace App\Filesystem;

use Illuminate\Filesystem\FilesystemAdapter;
use League\Flysystem\Config;
use League\Flysystem\UrlGeneration\PublicUrlGenerator;

/**
 * Bridges Laravel's {@see FilesystemAdapter::url()} to Flysystem v3's
 * {@see PublicUrlGenerator::publicUrl()} used by the GCS adapter.
 */
class GoogleCloudFilesystemAdapter extends FilesystemAdapter
{
    /**
     * {@inheritdoc}
     */
    public function url($path): string
    {
        if (isset($this->config['prefix'])) {
            $path = $this->concatPathToUrl($this->config['prefix'], $path);
        }

        $adapter = $this->adapter;

        if ($adapter instanceof PublicUrlGenerator) {
            return $adapter->publicUrl($path, new Config([]));
        }

        return parent::url($path);
    }
}
