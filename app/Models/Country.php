<?php

namespace App\Models;

use Database\Factories\CountryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
{
    /** @use HasFactory<CountryFactory> */
    use HasFactory;

    protected $fillable = ['name', 'code'];

    /** @return HasMany<Timezone, $this> */
    public function timezones(): HasMany
    {
        return $this->hasMany(Timezone::class);
    }
}
