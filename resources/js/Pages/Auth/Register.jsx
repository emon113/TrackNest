import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />

            <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-200 selection:bg-primary-500 selection:text-white overflow-hidden py-12">

                {/* Abstract Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-primary-600/20 dark:bg-primary-500/10 rounded-full filter blur-[100px] opacity-40 pointer-events-none" />

                <div className="relative z-10 w-full sm:max-w-md px-6 py-8 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl shadow-xl sm:rounded-xl border border-white/20 dark:border-zinc-700/50">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <Link href="/" className="inline-block">
                            <ApplicationLogo className="w-12 h-12 fill-current text-primary-600 dark:text-primary-500" />
                        </Link>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Create an account</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Start organizing your life today
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Full Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="username" value="Username" />
                            <div className="flex items-center mt-1">
                                <span className="inline-flex items-center px-3 h-10 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-gray-400 text-sm">
                                    @
                                </span>
                                <TextInput
                                    id="username"
                                    name="username"
                                    value={data.username}
                                    className="block w-full rounded-l-none"
                                    autoComplete="username"
                                    onChange={(e) => setData('username', e.target.value)}
                                    required
                                    placeholder="johndoe"
                                />
                            </div>
                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <PrimaryButton className="w-full justify-center py-3 mt-4" disabled={processing}>
                            Register
                        </PrimaryButton>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-700 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
