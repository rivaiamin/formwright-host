<?php

namespace App\Models;

use Database\Factories\TimezoneFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Timezone extends Model
{
    /** @use HasFactory<TimezoneFactory> */
    use HasFactory;

    protected $fillable = ['country_id', 'name', 'gmt_offset'];

    /** @return BelongsTo<Country, $this> */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}
