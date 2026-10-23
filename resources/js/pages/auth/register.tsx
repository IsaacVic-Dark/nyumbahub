import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function Register() {
    return (
        <div className="flex min-h-svh items-center justify-center bg-background px-6 py-12">
            <Head title="Create account" />
            <div className="w-full max-w-sm">
                <Link href="/" className="mb-8 flex items-center gap-2 font-bold text-stone-900">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-700 text-sm font-black text-white">
                        N
                    </span>
                    NyumbaHub
                </Link>

                <h1 className="text-2xl font-extrabold text-stone-900">Create your account</h1>
                <p className="mt-1 text-sm text-stone-500">Join to save homes, confirm vacancies and post reports.</p>

                <Form
                    action="/register"
                    method="post"
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="mt-6 flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full name</Label>
                                <Input id="name" name="name" required autoFocus autoComplete="name" placeholder="Full name" />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input id="email" type="email" name="email" required autoComplete="email" placeholder="email@example.com" />
                                <InputError message={errors.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone number</Label>
                                <Input id="phone" name="phone" required inputMode="tel" autoComplete="tel" placeholder="0712 345 678" />
                                <InputError message={errors.phone} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput id="password" name="password" required autoComplete="new-password" placeholder="Password" />
                                <InputError message={errors.password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <PasswordInput id="password_confirmation" name="password_confirmation" required autoComplete="new-password" placeholder="Confirm password" />
                                <InputError message={errors.password_confirmation} />
                            </div>
                            <Button type="submit" className="mt-2 w-full" disabled={processing}>
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </>
                    )}
                </Form>

                <p className="mt-6 text-center text-sm text-stone-500">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-emerald-700 underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}
