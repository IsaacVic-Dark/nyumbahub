<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PhoneOtpResource;
use App\Models\PhoneOtp;

// Read-only audit log, admin-only. Requesting/verifying an OTP is an auth
// concern with its own dedicated endpoints, not part of this CRUD set —
// see NOTES.md.
class PhoneOtpController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', PhoneOtp::class);

        return PhoneOtpResource::collection(PhoneOtp::latest()->paginate());
    }

    public function show(PhoneOtp $phoneOtp)
    {
        $this->authorize('viewAny', PhoneOtp::class);

        return new PhoneOtpResource($phoneOtp);
    }
}
