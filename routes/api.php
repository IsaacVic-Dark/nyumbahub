<?php

use App\Http\Controllers\Api\BuildingController;
use App\Http\Controllers\Api\CommunityConfirmationController;
use App\Http\Controllers\Api\CountyController;
use App\Http\Controllers\Api\DuplicateFlagController;
use App\Http\Controllers\Api\EstateController;
use App\Http\Controllers\Api\FlaggedContentController;
use App\Http\Controllers\Api\ListingCommentController;
use App\Http\Controllers\Api\ListingConditionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\ListingEvidenceController;
use App\Http\Controllers\Api\ListingMediaController;
use App\Http\Controllers\Api\ListingReviewController;
use App\Http\Controllers\Api\ListingStatusHistoryController;
use App\Http\Controllers\Api\PhoneOtpController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SubEstateController;
use App\Http\Controllers\Api\SubEstateRatingController;
use App\Http\Controllers\Api\TownController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Nyumba Hub API routes
|--------------------------------------------------------------------------
| Public: every index/show below. Auth (Sanctum) required for anything
| that creates/edits/deletes — role/ownership checks happen in the
| Policies + FormRequests, not here.
|
| Shallow nesting: a resource's index/store lives under its parent in the
| URL; show/update/destroy/actions address the resource directly.
*/

// --- Auth (token-issuing; for Postman / mobile) --------------------------
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:6,1');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:login');
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::get('/me', fn() => auth()->user())->middleware('auth:sanctum');

// --- Location hierarchy -----------------------------------------------
Route::apiResource('counties', CountyController::class)->except(['store', 'update', 'destroy']);
Route::apiResource('towns', TownController::class)->except(['index', 'store', 'update', 'destroy']);
Route::apiResource('estates', EstateController::class)->except(['index', 'store', 'update', 'destroy']);
Route::apiResource('buildings', BuildingController::class)->except(['index', 'store', 'update', 'destroy']);
// Not using apiResource() for sub-estates: Laravel's resource registrar
// would auto-name the route parameter {sub_estate} (dashes become
// underscores), which wouldn't match the $subEstate argument used
// consistently across every controller/policy/request below.
Route::get('sub-estates/{subEstate}', [SubEstateController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('counties', [CountyController::class, 'store']);
    Route::put('counties/{county}', [CountyController::class, 'update']);
    Route::delete('counties/{county}', [CountyController::class, 'destroy']);
    Route::post('counties/{county}/restore', [CountyController::class, 'restore'])->withTrashed();

    Route::get('counties/{county}/towns', [TownController::class, 'index'])->withoutMiddleware('auth:sanctum');
    Route::post('counties/{county}/towns', [TownController::class, 'store']);
    Route::put('towns/{town}', [TownController::class, 'update']);
    Route::delete('towns/{town}', [TownController::class, 'destroy']);

    Route::get('towns/{town}/estates', [EstateController::class, 'index'])->withoutMiddleware('auth:sanctum');
    Route::post('towns/{town}/estates', [EstateController::class, 'store']);
    Route::put('estates/{estate}', [EstateController::class, 'update']);
    Route::delete('estates/{estate}', [EstateController::class, 'destroy']);

    Route::get('estates/{estate}/sub-estates', [SubEstateController::class, 'index'])->withoutMiddleware('auth:sanctum');
    Route::post('estates/{estate}/sub-estates', [SubEstateController::class, 'store']);
    Route::put('sub-estates/{subEstate}', [SubEstateController::class, 'update']);
    Route::delete('sub-estates/{subEstate}', [SubEstateController::class, 'destroy']);

    Route::get('sub-estates/{subEstate}/buildings', [BuildingController::class, 'index'])->withoutMiddleware('auth:sanctum');
    Route::post('sub-estates/{subEstate}/buildings', [BuildingController::class, 'store']);
    Route::put('buildings/{building}', [BuildingController::class, 'update']);
    Route::delete('buildings/{building}', [BuildingController::class, 'destroy']);
});

// --- Sub-estate ratings -------------------------------------------------
Route::get('sub-estates/{subEstate}/ratings', [SubEstateRatingController::class, 'index']);
Route::get('ratings/{rating}', [SubEstateRatingController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('sub-estates/{subEstate}/ratings', [SubEstateRatingController::class, 'store']);
    Route::put('ratings/{rating}', [SubEstateRatingController::class, 'update']);
    Route::delete('ratings/{rating}', [SubEstateRatingController::class, 'destroy']);
});

// --- Listings + everything nested under a listing -----------------------
Route::get('buildings/{building}/listings', [ListingController::class, 'index']);
Route::get('listings/{listing}', [ListingController::class, 'show']);
Route::get('listings/{listing}/condition', [ListingConditionController::class, 'show']);
Route::get('listings/{listing}/review', [ListingReviewController::class, 'show']);
Route::get('listings/{listing}/comments', [ListingCommentController::class, 'index']);
Route::get('listings/{listing}/media', [ListingMediaController::class, 'index']);
Route::get('listings/{listing}/confirmations', [CommunityConfirmationController::class, 'index']);
Route::get('listings/{listing}/status-histories', [ListingStatusHistoryController::class, 'index']);
Route::get('listings/{listing}/duplicate-flags', [DuplicateFlagController::class, 'index']);
Route::get('duplicate-flags/{duplicateFlag}', [DuplicateFlagController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('buildings/{building}/listings', [ListingController::class, 'store']);
    Route::put('listings/{listing}', [ListingController::class, 'update']);
    Route::delete('listings/{listing}', [ListingController::class, 'destroy']);

    Route::put('listings/{listing}/condition', [ListingConditionController::class, 'store']);
    Route::put('listings/{listing}/review', [ListingReviewController::class, 'store']);

    Route::post('listings/{listing}/comments', [ListingCommentController::class, 'store']);
    Route::put('comments/{comment}', [ListingCommentController::class, 'update']);
    Route::delete('comments/{comment}', [ListingCommentController::class, 'destroy']);

    Route::post('listings/{listing}/media', [ListingMediaController::class, 'store']);
    Route::delete('media/{media}', [ListingMediaController::class, 'destroy']);

    Route::get('listings/{listing}/evidence', [ListingEvidenceController::class, 'index']);
    Route::post('listings/{listing}/evidence', [ListingEvidenceController::class, 'store']);
    Route::get('evidence/{evidence}', [ListingEvidenceController::class, 'show']);
    Route::delete('evidence/{evidence}', [ListingEvidenceController::class, 'destroy']);
    Route::post('evidence/{evidence}/verify', [ListingEvidenceController::class, 'verify']);
    Route::post('evidence/{evidence}/reject', [ListingEvidenceController::class, 'reject']);

    Route::post('listings/{listing}/confirmations', [CommunityConfirmationController::class, 'store']);

    Route::post('listings/{listing}/duplicate-flags', [DuplicateFlagController::class, 'store']);
    Route::post('duplicate-flags/{duplicateFlag}/resolve', [DuplicateFlagController::class, 'resolve']);
});

// --- Moderation (admin-only, enforced in policies) -----------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::get('flagged-contents', [FlaggedContentController::class, 'index']);
    Route::post('flagged-contents', [FlaggedContentController::class, 'store']);
    Route::get('flagged-contents/{flaggedContent}', [FlaggedContentController::class, 'show']);
    Route::post('flagged-contents/{flaggedContent}/resolve', [FlaggedContentController::class, 'resolve']);

    Route::get('settings', [SettingController::class, 'index']);
    Route::put('settings/{key}', [SettingController::class, 'update']);

    Route::get('phone-otps', [PhoneOtpController::class, 'index']);
    Route::get('phone-otps/{phoneOtp}', [PhoneOtpController::class, 'show']);
});
