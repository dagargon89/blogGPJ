<?php

namespace App\Providers;

use App\Filesystem\GoogleCloudFilesystemAdapter;
use App\Models\Category;
use App\Models\Post;
use App\Policies\CategoryPolicy;
use App\Policies\PostPolicy;
use Carbon\CarbonImmutable;
use Google\Cloud\Storage\StorageClient;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use League\Flysystem\Filesystem as Flysystem;
use League\Flysystem\GoogleCloudStorage\GoogleCloudStorageAdapter;
use League\Flysystem\Visibility;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerPolicies();
        $this->registerGoogleCloudStorageDriver();
    }

    /**
     * Register Flysystem driver for Google Cloud Storage (Firebase Storage bucket).
     */
    protected function registerGoogleCloudStorageDriver(): void
    {
        Storage::extend('gcs', function ($app, array $config) {
            $clientConfig = [];

            if (! empty($config['project_id'])) {
                $clientConfig['projectId'] = $config['project_id'];
            }

            if (! empty($config['key_file_path'])) {
                $clientConfig['keyFilePath'] = $config['key_file_path'];
            }

            if (! empty($config['storage_api_uri'])) {
                $clientConfig['apiEndpoint'] = $config['storage_api_uri'];
            }

            $storageClient = new StorageClient($clientConfig);
            $bucket = $storageClient->bucket($config['bucket']);

            $defaultVisibility = (($config['visibility'] ?? Visibility::PRIVATE) === 'public')
                ? Visibility::PUBLIC
                : Visibility::PRIVATE;

            $adapter = new GoogleCloudStorageAdapter(
                $bucket,
                $config['path_prefix'] ?? '',
                null,
                $defaultVisibility,
            );

            $flysystem = new Flysystem($adapter, Arr::only($config, [
                'directory_visibility',
                'disable_asserts',
                'retain_visibility',
                'temporary_url',
                'url',
                'visibility',
            ]));

            return new GoogleCloudFilesystemAdapter($flysystem, $adapter, $config);
        });
    }

    protected function registerPolicies(): void
    {
        Gate::policy(Post::class, PostPolicy::class);
        Gate::policy(Category::class, CategoryPolicy::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
