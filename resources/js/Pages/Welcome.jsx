import React from 'react';
import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth }) {

    return (
        <>
            <Head title="Welcome" />

            <div className="relative min-h-screen bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-200 selection:bg-primary-500 selection:text-white">

                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/2 w-[80rem] h-[80rem] bg-primary-600/20 dark:bg-primary-500/10 -translate-x-1/2 -translate-y-1/2 rounded-full filter blur-[120px] opacity-30" />
                </div>

                <header className="relative z-10">
                    <nav className="max-w-7xl mx-auto flex justify-between items-center p-6 lg:px-8">

                        <Link href="/" className="flex items-center gap-2">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                            {/* --- THIS IS THE CHANGE --- */}
                            <span className="font-semibold text-lg">TrackNest</span>
                        </Link>

                        <div className="flex gap-4 items-center">
                            {auth.canLogin ? (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
                                    >
                                        Log in
                                    </Link>

                                    {auth.canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-900 uppercase tracking-widest hover:bg-primary-700 active:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={route('dashboard')}
                                    className="font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="relative z-10">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                                    Your Unified
                                </span>
                                <br />
                                Command Center
                            </h1>

                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl">
                                All your notes, tasks, and research—all in one calm, aesthetic space. Stop switching tabs and start focusing on your work.
                            </p>

                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-primary-600 px-5 py-3 text-sm font-semibold text-white dark:text-gray-900 shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                                >
                                    Log in <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
