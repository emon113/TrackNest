import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Log in" />

            <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-200 selection:bg-primary-500 selection:text-white overflow-hidden">

                {/* Abstract Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-primary-600/20 dark:bg-primary-500/10 rounded-full filter blur-[100px] opacity-40 pointer-events-none" />

                <div className="relative z-10 w-full sm:max-w-md px-6 py-8 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl shadow-xl sm:rounded-xl border border-white/20 dark:border-zinc-700/50">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <Link href="/" className="inline-block">
                            <ApplicationLogo className="w-16 h-16 fill-current text-primary-600 dark:text-primary-500" />
                        </Link>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Please sign in to your account
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400 text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center">
                                <InputLabel htmlFor="password" value="Password" />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="block">
                            <label className="flex items-center cursor-pointer">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                            </label>
                        </div>

                        <PrimaryButton className="w-full justify-center py-3" disabled={processing}>
                            Log in
                        </PrimaryButton>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-700 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link
                                href={route('register')}
                                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
