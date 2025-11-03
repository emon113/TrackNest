import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { StarIcon, BookOpenIcon, TagIcon, PencilIcon, ClockIcon, ArrowRightIcon, CalendarIcon } from '@heroicons/react/24/outline'; // Import icons

export default function Dashboard() {

    // 1. Get all the new props from our DashboardController
    const { auth, stats, recentNotes, pinnedNotes } = usePage().props;

    // A helper component for the "At a Glance" stats
    const StatCard = ({ icon, label, value }) => (
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg flex items-center gap-4">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full">
                {icon}
            </div>
            <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</dd>
            </div>
        </div>
    );

    // A helper component for list items
    const ListItem = ({ href, icon, title, subtitle }) => (
        <Link
            href={href}
            className="block p-3 -mx-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
            <div className="flex items-center gap-3">
                <div className="p-1 text-gray-500 dark:text-gray-400">{icon}</div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
            </div>
        </Link>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* --- WELCOME HEADER --- */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Good morning, {auth.user.name}.
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">Here's your summary for today.</p>
                    </div>

                    {/* --- NEW 3-COLUMN GRID LAYOUT --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* --- MAIN COLUMN (2/3 width) --- */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* --- WIDGET: PINNED NOTES --- */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-lg">
                                <div className="p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pinned Notes</h4>
                                    <div className="space-y-2">
                                        {pinnedNotes.length > 0 ? (
                                            pinnedNotes.map((note) => (
                                                <ListItem
                                                    key={note.id}
                                                    href={route('notes.show', note.id)}
                                                    icon={<StarIcon className="h-5 w-5 text-primary-500" />}
                                                    title={note.title}
                                                    subtitle={note.content.replace(/<[^>]+>/g, '').substring(0, 50) + '...'}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">You don't have any pinned notes yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* --- WIDGET: RECENTLY EDITED NOTES --- */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-lg">
                                <div className="p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h4>
                                    <div className="space-y-2">
                                        {recentNotes.length > 0 ? (
                                            recentNotes.map((note) => (
                                                <ListItem
                                                    key={note.id}
                                                    href={route('notes.edit', note.id)}
                                                    icon={<PencilIcon className="h-5 w-5" />}
                                                    title={note.title}
                                                    subtitle={`Edited ${new Date(note.updated_at).toLocaleDateString()}`}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">No notes have been edited recently.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* --- SIDEBAR COLUMN (1/3 width) --- */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* --- WIDGET: AT A GLANCE (STATS) --- */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-lg">
                                <div className="p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">At a Glance</h4>
                                    <dl className="space-y-3">
                                        <StatCard icon={<PencilIcon className="h-6 w-6" />} label="Total Notes" value={stats.notes} />
                                        <StatCard icon={<BookOpenIcon className="h-6 w-6" />} label="Notebooks" value={stats.notebooks} />
                                        <StatCard icon={<TagIcon className="h-6 w-6" />} label="Tags" value={stats.tags} />
                                    </dl>
                                </div>
                            </div>

                            {/* --- WIDGET: UPCOMING DEADLINES (PLACEHOLDER) --- */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-lg">
                                <div className="p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Deadlines</h4>
                                    <div className="text-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                        <CalendarIcon className="h-8 w-8 text-gray-400 mx-auto" />
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Your tasks with due dates will appear here once you build the To-Do module.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
