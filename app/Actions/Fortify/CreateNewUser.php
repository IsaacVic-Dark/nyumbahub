<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user (Fortify's POST /register).
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $input['phone'] = self::normalizePhone($input['phone'] ?? '');

        Validator::make($input, [
            ...$this->profileRules(),
            'phone' => ['required', 'string', 'regex:/^254[17]\d{8}$/', Rule::unique(User::class, 'phone')],
            'password' => $this->passwordRules(),
        ], [
            'phone.regex' => 'Enter a valid Kenyan mobile number, e.g. 0712 345 678.',
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => Str::lower($input['email']),
            'phone' => $input['phone'],
            'password' => $input['password'], // hashed by the model cast
        ]);
    }

    /** 0712345678 / +254712345678 / 712345678 -> 254712345678 */
    public static function normalizePhone(string $raw): string
    {
        $digits = preg_replace('/\D+/', '', $raw) ?? '';

        return match (true) {
            str_starts_with($digits, '254') => $digits,
            str_starts_with($digits, '0') => '254'.substr($digits, 1),
            default => '254'.$digits,
        };
    }
}
