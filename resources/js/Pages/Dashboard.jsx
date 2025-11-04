import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { StarIcon, BookOpenIcon, TagIcon, PencilIcon, ArrowRightIcon, CalendarIcon, ViewColumnsIcon, CheckCircleIcon, FireIcon } from '@heroicons/react/24/outline';

// --- THIS IS THE CRITICAL IMPORT LINE ---
import { format, parseISO, isPast, isToday, isTomorrow } from 'date-fns';

// --- Reusable StatCard Component (No changes) ---
const StatCard = ({ icon, label, value }) => (
    <div className="bg-gray-100 dark:bg-zinc-800/50 p-4 rounded-lg flex items-center gap-4">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 rounded-full">
            {icon}
        </div>
        <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</dd>
        </div>
    </div>
);

// --- Reusable ListItem Component (No changes) ---
const ListItem = ({ href, icon, title, subtitle, tag, tagColor }) => (
    <Link
        href={href}
        className="block p-3 -mx-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
    >
        <div className="flex items-center gap-3">
            <div className="p-1 text-gray-500 dark:text-gray-400">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">{title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
            </div>
            {tag && (
                <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${tagColor}`}>
                    {tag}
                </span>
            )}
            <ArrowRightIcon className="h-4 w-4 text-gray-400" />
        </div>
    </Link>
);

// --- The Main Dashboard Component ---
export default function Dashboard() {

    const { auth, stats, pinnedNotes, upcomingDeadlines, myTodos } = usePage().props;

    // --- Helper for Deadline Colors ---
    // This function will now work because `isPast`, `isToday`, etc. are imported
    const getDeadlineInfo = (deadline) => {
        if (!deadline) return null;
        const deadLineDate = parseISO(deadline);

        if (isPast(deadLineDate) && !isToday(deadLineDate)) {
            return { label: format(deadLineDate, 'MMM d'), color: 'text-red-500', title: 'Overdue' };
        }
        if (isToday(deadLineDate) || isTomorrow(deadLineDate)) {
            return { label: isToday(deadLineDate) ? 'Today' : 'Tomorrow', color: 'text-amber-600 dark:text-amber-500', title: 'Due Soon' };
        }
        return { label: format(deadLineDate, 'MMM d'), color: 'text-gray-500 dark:text-gray-400', title: 'Upcoming' };
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Welcome back, {auth.user.name}.
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">Here's your summary for today.</p>
                    </div>

                    {/* --- 2x2 WIDGET GRID LAYOUT --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* --- WIDGET 1: AT A GLANCE --- */}
                        <div className="bg-white dark:bg-zinc-800 overflow-hidden shadow-lg sm:rounded-lg">
                            <div className="p-6">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">At a Glance</h4>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <StatCard icon={<PencilIcon className="h-6 w-6" />} label="Total Notes" value={stats.notes} />
                                    <StatCard icon={<CheckCircleIcon className="h-6 w-6" />} label="Open Tasks" value={stats.tasks} />
                                    <StatCard icon={<BookOpenIcon className="h-6 w-6" />} label="Notebooks" value={stats.notebooks} />
                                    <StatCard icon={<ViewColumnsIcon className="h-6 w-6" />} label="Task Boards" value={stats.boards} />
                                </dl>
                            </div>
                        </div>

                        {/* --- WIDGET 2: UPCOMING DEADLINES --- */}
                        <div className="bg-white dark:bg-zinc-800 overflow-hidden shadow-lg sm:rounded-lg">
                            <div className="p-6">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Deadlines</h4>
                                <div className="space-y-2">
                                    {upcomingDeadlines.length > 0 ? (
                                        upcomingDeadlines.map((task) => {
                                            const deadline = getDeadlineInfo(task.deadline);
                                            return (
                                                <ListItem
                                                    key={task.id}
                                                    href={route('tasks.index', { board: task.board_id })}
                                                    icon={<CalendarIcon className={`h-5 w-5 ${deadline.color}`} />}
                                                    title={task.title}
                                                    subtitle={`in ${task.board.name}`}
                                                    tag={deadline.label}
                                                    tagColor={deadline.color}
                                                />
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming deadlines. Looks clear!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* --- WIDGET 3: PINNED NOTES --- */}
                        <div className="bg-white dark:bg-zinc-800 overflow-hidden shadow-lg sm:rounded-lg">
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

                        {/* --- WIDGET 4: MY TO-DOS --- */}
                        <div className="bg-white dark:bg-zinc-800 overflow-hidden shadow-lg sm:rounded-lg">
                            <div className="p-6">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My To-Do List</h4>
                                <div className="space-y-2">
                                    {myTodos.length > 0 ? (
                                        myTodos.map((task) => (
                                            <ListItem
                                                key={task.id}
                                                href={route('tasks.index', { board: task.board_id })}
                                                icon={<CheckCircleIcon className="h-5 w-5" />}
                                                title={task.title}
                                                subtitle={`in ${task.board.name}`}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Your "To-Do" list is empty. Great job!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
