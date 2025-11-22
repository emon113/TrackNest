import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { UserPlusIcon, ViewColumnsIcon, ClipboardDocumentCheckIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

// --- Helper: Icon Logic (Same as Dropdown) ---
const getIcon = (type) => {
    switch(type) {
        case 'UserPlusIcon': return <UserPlusIcon className="h-5 w-5 text-blue-500" />;
        case 'ViewColumnsIcon': return <ViewColumnsIcon className="h-5 w-5 text-purple-500" />;
        case 'ClipboardDocumentCheckIcon': return <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-500" />;
        case 'ArrowPathIcon': return <ArrowPathIcon className="h-5 w-5 text-orange-500" />;
        default: return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
};

// --- Helper: Pagination ---
const Pagination = ({ links }) => {
    return (
        <div className="mt-6 flex justify-between">
            {links.prev ? (
                <Link href={links.prev} className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700">
                    &larr; Previous
                </Link>
            ) : <div />}
            {links.next ? (
                <Link href={links.next} className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700">
                    Next &rarr;
                </Link>
            ) : <div />}
        </div>
    );
};

export default function Index({ auth, notifications }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Notification History</h2>}
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-zinc-800 shadow sm:rounded-lg overflow-hidden">

                        {notifications.data.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                                <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-zinc-600" />
                                No notifications found.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-zinc-700">
                                {notifications.data.map((note) => (
                                    <div
                                        key={note.id}
                                        className={`p-4 sm:p-6 flex gap-4 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition ${!note.read_at ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                    >
                                        {/* Icon */}
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="p-2 bg-gray-100 dark:bg-zinc-900 rounded-full">
                                                {getIcon(note.data.icon)}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {note.data.message}
                                            </p>
                                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>{new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                {!note.read_at && (
                                                    <span className="px-1.5 py-0.5 rounded text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 font-bold">New</span>
                                                )}
                                            </div>

                                            {/* Action Link (if available) */}
                                            {note.data.link && (
                                                <Link
                                                    href={note.data.link}
                                                    className="inline-block mt-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                                                >
                                                    View details &rarr;
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                    {/* Pagination */}
                    <Pagination links={notifications.links} />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
