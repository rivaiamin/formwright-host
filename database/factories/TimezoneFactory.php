<?php

namespace Database\Factories;

use App\Models\Country;
use App\Models\Timezone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Timezone>
 */
class TimezoneFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'country_id' => Country::factory(),
            'name' => fake()->timezone(),
            'gmt_offset' => fake()->randomElement(['+00:00', '+07:00', '-05:00', '+10:00']),
        ];
    }
}
