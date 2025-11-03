import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { BookOpenIcon, TagIcon } from '@heroicons/react/24/outline'; // <-- 1. IMPORT ICONS

export default function Show() {

    const { auth, note } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {note.title}
                    </h2>
                    <Link
                        href={route('notes.edit', note.id)}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 dark:bg-primary-500 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-900 uppercase tracking-widest hover:bg-primary-700 dark:hover:bg-primary-400 focus:bg-primary-700 dark:focus:bg-primary-400 active:bg-primary-900 dark:active:bg-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                    >
                        Edit This Note
                    </Link>
                </div>
            }
        >
            <Head title={note.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* --- 2. ADD METADATA HEADER --- */}
                    <div className="flex flex-wrap gap-4 items-center mb-4">
                        {note.notebook && (
                            <span className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                                <BookOpenIcon className="h-4 w-4" />
                                {note.notebook.name}
                            </span>
                        )}
                        {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {note.tags.map((tag) => (
                                    <span key={tag.id} className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                                        <TagIcon className="h-4 w-4" />
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- NOTE CONTENT --- */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div
                            className="prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: note.content }}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
