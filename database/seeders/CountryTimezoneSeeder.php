<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\Timezone;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CountryTimezoneSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * A few countries, each with real IANA timezones, so a "Timezone" dropdown
     * can be filtered by the chosen "Country" (the cascading-dropdown demo).
     *
     * @var array<string, array{code: string, zones: array<int, array{0: string, 1: string}>}>
     */
    protected array $data = [
        'Indonesia' => ['code' => 'ID', 'zones' => [
            ['Asia/Jakarta', '+07:00'],
            ['Asia/Makassar', '+08:00'],
            ['Asia/Jayapura', '+09:00'],
        ]],
        'United States' => ['code' => 'US', 'zones' => [
            ['America/New_York', '-05:00'],
            ['America/Chicago', '-06:00'],
            ['America/Denver', '-07:00'],
            ['America/Los_Angeles', '-08:00'],
        ]],
        'Australia' => ['code' => 'AU', 'zones' => [
            ['Australia/Sydney', '+10:00'],
            ['Australia/Adelaide', '+09:30'],
            ['Australia/Perth', '+08:00'],
        ]],
        'United Kingdom' => ['code' => 'GB', 'zones' => [
            ['Europe/London', '+00:00'],
        ]],
        'Brazil' => ['code' => 'BR', 'zones' => [
            ['America/Sao_Paulo', '-03:00'],
            ['America/Manaus', '-04:00'],
        ]],
    ];

    public function run(): void
    {
        foreach ($this->data as $name => $meta) {
            $country = Country::updateOrCreate(
                ['code' => $meta['code']],
                ['name' => $name],
            );

            foreach ($meta['zones'] as [$zone, $offset]) {
                Timezone::updateOrCreate(
                    ['country_id' => $country->id, 'name' => $zone],
                    ['gmt_offset' => $offset],
                );
            }
        }
    }
}
