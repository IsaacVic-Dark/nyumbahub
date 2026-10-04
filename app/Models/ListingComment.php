<?php

namespace App\Models;

use App\Enums\CommentRelationshipTag;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ListingComment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['listing_id', 'user_id', 'parent_comment_id', 'body', 'relationship_tag'];

    protected function casts(): array
    {
        return [
            'relationship_tag' => CommentRelationshipTag::class,
        ];
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ListingComment::class, 'parent_comment_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ListingComment::class, 'parent_comment_id');
    }
}
