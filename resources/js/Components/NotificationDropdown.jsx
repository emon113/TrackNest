import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { UserPlusIcon, ViewColumnsIcon, ClipboardDocumentCheckIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import Dropdown from '@/Components/Dropdown';

export default function NotificationDropdown() {
    const { auth } = usePage().props;
    const notifications = auth.notifications;

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['auth'] });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const markAllAsRead = () => {
        if (notifications.length > 0) {
            router.post(route('notifications.read_all'), {}, { preserveScroll: true });
        }
    };

    const handleNotificationClick = (e, note) => {
        e.preventDefault();
        router.patch(route('notifications.read_one', note.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.get(note.data.link);
            }
        });
    };

    const getIcon = (type) => {
        switch(type) {
            case 'UserPlusIcon': return <UserPlusIcon className="h-5 w-5 text-blue-500" />;
            case 'ViewColumnsIcon': return <ViewColumnsIcon className="h-5 w-5 text-purple-500" />;
            case 'ClipboardDocumentCheckIcon': return <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-500" />;
            case 'ArrowPathIcon': return <ArrowPathIcon className="h-5 w-5 text-orange-500" />;
            default: return <BellIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none">
                    <BellIcon className="h-6 w-6" />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full border-2 border-white dark:border-gray-800">
                            {notifications.length > 9 ? '9+' : notifications.length}
                        </span>
                    )}
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content width="w-96">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700 flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                        Notifications
                        {notifications.length > 0 && (
                            <span className="ml-2 text-xs font-normal text-gray-500">({notifications.length} unread)</span>
                        )}
                    </span>
                    {notifications.length > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 hover:underline"
                        >
                            Mark all read
                        </button>
                    )}
                </div>

                <div className="max-h-[24rem] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <BellIcon className="h-8 w-8 mx-auto text-gray-300 dark:text-zinc-600 mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                You're all caught up!
                            </p>
                        </div>
                    ) : (
                        notifications.map((note) => (
                            <a
                                key={note.id}
                                href={note.data.link}
                                onClick={(e) => handleNotificationClick(e, note)}
                                className="block px-4 py-4 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition border-b border-gray-100 dark:border-zinc-700/50"
                            >
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
                                            {getIcon(note.data.icon)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                                            {note.data.message}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                                            <span className="mx-1">•</span>
                                            {new Date(note.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 self-center">
                                        <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                                    </div>
                                </div>
                            </a>
                        ))
                    )}
                </div>

                {/* --- NEW FOOTER LINK --- */}
                <Link
                    href={route('notifications.index')}
                    className="block w-full px-4 py-2 text-center text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                >
                    View all history &rarr;
                </Link>
            </Dropdown.Content>
        </Dropdown>
    );
}
