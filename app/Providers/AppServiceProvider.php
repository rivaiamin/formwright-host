<?php

namespace App\Providers;

use App\Contracts\AccessPolicy;
use App\Contracts\AiAssistant;
use App\Contracts\RuntimeContext;
use App\Contracts\SubmissionStore;
use App\Contracts\UrlResolver;
use App\Http\Controllers\PublicFormController;
use App\Support\ClaudeAiAssistant;
use App\Support\DefaultAccessPolicy;
use App\Support\DefaultRuntimeContext;
use App\Support\DefaultUrlResolver;
use App\Support\EloquentSubmissionStore;
use App\Support\NullAiAssistant;
use Carbon\CarbonImmutable;
use Filament\Support\Assets\Css;
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Extensibility contracts, each bound to a sensible default a host app
        // may override in its own service provider.
        $this->app->bind(SubmissionStore::class, EloquentSubmissionStore::class);
        $this->app->bind(RuntimeContext::class, DefaultRuntimeContext::class);
        $this->app->bind(AccessPolicy::class, DefaultAccessPolicy::class);
        $this->app->bind(AiAssistant::class, function ($app) {
            $ai = config('formbuilder.ai');

            return ($ai['enabled'] ?? false) && filled($ai['api_key'] ?? null)
                ? $app->make(ClaudeAiAssistant::class)
                : $app->make(NullAiAssistant::class);
        });
        $this->app->bind(UrlResolver::class, DefaultUrlResolver::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerDesignerAssets();
        $this->registerPublicRoutes();
    }

    /**
     * Register the public fill-out routes, config-driven so a host can change
     * the prefix/middleware or disable them entirely.
     */
    protected function registerPublicRoutes(): void
    {
        if (! config('formbuilder.routes.enabled', true)) {
            return;
        }

        Route::middleware(config('formbuilder.routes.middleware', ['web']))
            ->prefix(config('formbuilder.routes.prefix', 'forms'))
            ->group(function (): void {
                Route::get('/{slug}', [PublicFormController::class, 'show'])->name('formbuilder.forms.show');
                Route::post('/{slug}', [PublicFormController::class, 'submit'])->name('formbuilder.forms.submit');
            });
    }

    /**
     * Register the compiled SurveyJS-compatible builder bundle with Filament's
     * asset manager. `php artisan filament:assets` publishes these into /public;
     * they are loaded on demand by the Designer page via `x-load-js`/`x-load-css`.
     */
    protected function registerDesignerAssets(): void
    {
        FilamentAsset::register([
            Js::make('formwright-designer', resource_path('js/builder/dist/formwright-designer.js'))
                ->loadedOnRequest(),
            Css::make('formwright-designer', resource_path('js/builder/dist/formwright-designer.css'))
                ->loadedOnRequest(),
        ]);
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
