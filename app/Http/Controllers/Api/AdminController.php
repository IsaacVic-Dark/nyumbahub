<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

// SuperAdmin-only (enforced in UserPolicy).
class AdminController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('createAdmin', User::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $admin = new User($data);
        $admin->role = UserRole::Admin; // role isn't fillable, so it's set explicitly
        $admin->save();

        return response()->json($admin, 201);
    }

    public function destroy(User $user)
    {
        $this->authorize('removeAdmin', $user);

        $user->tokens()->delete(); // revoke Sanctum tokens so access ends immediately
        $user->delete();

        return response()->noContent();
    }
}