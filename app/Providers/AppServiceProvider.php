<?php

namespace App\Providers;

use App\Models\Country;
use App\Models\Timezone;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

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
        $this->configureFormwrightDataSources();
    }

    /**
     * Demo model-backed choice sources for exercising Formwright's "A Laravel
     * model" fields: a global "Countries" list and a "Timezones" list that
     * cascades off the selected country (`filter_column` = `country_id`).
     */
    protected function configureFormwrightDataSources(): void
    {
        config()->set('formbuilder.data_sources', [
            'countries' => [
                'label' => 'Countries',
                'model' => Country::class,
                'value' => 'id',
                'text' => 'name',
                'search_columns' => ['name', 'code'],
            ],
            'timezones' => [
                'label' => 'Timezones',
                'model' => Timezone::class,
                'value' => 'id',
                'text' => 'name',
                'filter_column' => 'country_id',
                'search_columns' => ['name'],
            ],
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
