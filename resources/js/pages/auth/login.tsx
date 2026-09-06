import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <Head title="Log in" />

            {/* FORM PANEL */}
            <div className="flex items-center justify-center bg-background px-6 py-12">
                <div className="w-full max-w-sm">
                    <Link
                        href={home()}
                        className="mb-8 flex items-center gap-2 font-bold text-stone-900"
                    >
                        <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-700 text-sm font-black text-white">
                            N
                        </span>
                        NyumbaHub
                    </Link>

                    <h1 className="text-2xl font-extrabold text-stone-900">
                        Log in to your account
                    </h1>
                    <p className="mt-1 text-sm text-stone-500">
                        Enter your email and password below to log in
                    </p>

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="mt-6 flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Email address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="ml-auto text-sm"
                                                    tabIndex={5}
                                                >
                                                    Forgot your password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                        />
                                        <Label htmlFor="remember">
                                            Remember me
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-4 w-full"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner />}
                                        Log in
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="mt-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <p className="mt-6 text-center text-xs text-stone-400">
                        🛡️ NyumbaHub never asks for payment in chat or to
                        unlock a vacancy report.
                    </p>
                </div>
            </div>

            {/* ILLUSTRATION PANEL */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-emerald-950 p-10 text-emerald-50 lg:flex">
                <div className="relative z-10">
                    <span className="text-3xl">&ldquo;</span>
                    <p className="mt-2 max-w-sm text-xl leading-snug font-semibold">
                        I found my Ruaka apartment through someone who
                        actually lived there. Knew the real rent and the
                        water situation before I even visited.
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-800 text-sm font-bold">
                            AM
                        </div>
                        <div>
                            <div className="text-sm font-bold">Amina M.</div>
                            <div className="text-xs text-emerald-200/70">
                                Nairobi
                            </div>
                        </div>
                    </div>
                </div>

                {/* Original abstract skyline illustration */}
                <svg
                    viewBox="0 0 400 220"
                    className="relative z-10 w-full"
                    aria-hidden="true"
                >
                    <rect x="10" y="90" width="55" height="130" rx="4" fill="#0d6049" />
                    <rect x="75" y="60" width="45" height="160" rx="4" fill="#12805f" />
                    <rect x="130" y="110" width="60" height="110" rx="4" fill="#0a4a3a" />
                    <rect x="200" y="40" width="50" height="180" rx="4" fill="#169170" />
                    <rect x="260" y="85" width="55" height="135" rx="4" fill="#0d6049" />
                    <rect
                        x="325"
                        y="120"
                        width="65"
                        height="100"
                        rx="4"
                        fill="#12805f"
                    />
                    {Array.from({ length: 24 }).map((_, i) => (
                        <rect
                            key={i}
                            x={20 + (i % 6) * 60}
                            y={70 + Math.floor(i / 6) * 30}
                            width="8"
                            height="10"
                            fill="#fbbf24"
                            opacity={(i * 37) % 5 === 0 ? 0.9 : 0.35}
                        />
                    ))}
                </svg>

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
            </div>
        </div>
    );
}