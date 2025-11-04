import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

// --- A. Helper: Pagination ---
// This component renders the "Next" and "Previous" links
const Pagination = ({ links }) => {
    return (
        <div className="mt-6 flex justify-between">
            {links.prev ? (
                <Link
                    href={links.prev}
                    preserveScroll
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                    &larr; Previous
                </Link>
            ) : <div />}
            {links.next ? (
                <Link
                    href={links.next}
                    preserveScroll
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                    Next &rarr;
                </Link>
            ) : <div />}
        </div>
    );
};

// --- B. Helper: Activity Item Icon ---
// This shows a different icon based on the action (created, updated, deleted)
const ActivityIcon = ({ eventName }) => {
    let iconClass = "h-5 w-5";
    let bgClass = "";
    let icon;

    switch (eventName) {
        case 'created':
            icon = <PlusIcon className={iconClass} />;
            bgClass = 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300';
            break;
        case 'updated':
            icon = <PencilIcon className={iconClass} />;
            bgClass = 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300';
            break;
        case 'deleted':
            icon = <TrashIcon className={iconClass} />;
            bgClass = 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300';
            break;
        default:
            icon = <PencilIcon className={iconClass} />;
            bgClass = 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }

    return (
        <div className={`p-2 rounded-full ${bgClass}`}>
            {icon}
        </div>
    );
};

// --- C. The Main Page Component ---
export default function Index() {
    const { auth, activities } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Activity Log</h2>}
        >
            <Head title="Activity Log" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-zinc-800 shadow-lg sm:rounded-lg">
                        <div className="p-4 sm:p-6 lg:p-8">

                            {/* --- This is the timeline feed --- */}
                            <ul className="space-y-6">
                                {activities.data.length > 0 ? (
                                    activities.data.map((activity, index) => (
                                        <li key={activity.id} className="flex gap-4">
                                            {/* Icon */}
                                            <ActivityIcon eventName={activity.event} />

                                            {/* Content */}
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                                    {activity.description}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {format(parseISO(activity.created_at), "MMM d, yyyy 'at' h:mm a")}
                                                </p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center">
                                        You don't have any activity yet. Go create a note or task!
                                    </p>
                                )}
                            </ul>

                            {/* --- Pagination Links --- */}
                            <Pagination links={activities.links} />

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
