import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { UsersIcon, DocumentTextIcon, ClipboardDocumentListIcon, NoSymbolIcon, CheckCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

// --- Helper: Stat Card ---
const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white dark:bg-zinc-800 overflow-hidden shadow-lg rounded-xl border border-gray-100 dark:border-zinc-700">
        <div className="p-5">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${color} text-white shadow-md`}>{icon}</div>
            </div>
        </div>
    </div>
);

// --- Main Component ---
export default function AdminDashboard({ auth, stats, charts, users }) {

    const toggleBan = (user) => {
        if (confirm(`Are you sure you want to ${user.is_banned ? 'unban' : 'ban'} ${user.name}?`)) {
            router.patch(route('admin.users.ban', user.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">System Overview</h2>}
        >
            <Head title="Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* 1. KEY STATS GRID */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Total Users" value={stats.total_users} icon={<UsersIcon className="h-6 w-6"/>} color="bg-blue-500" />
                        <StatCard title="Active Today" value={stats.active_today} icon={<CheckCircleIcon className="h-6 w-6"/>} color="bg-green-500" />
                        <StatCard title="Total Notes" value={stats.total_notes} icon={<DocumentTextIcon className="h-6 w-6"/>} color="bg-amber-500" />
                        <StatCard title="Total Tasks" value={stats.total_tasks} icon={<ClipboardDocumentListIcon className="h-6 w-6"/>} color="bg-purple-500" />
                    </div>

                    {/* 2. CHARTS ROW 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* User Growth Chart (Area) */}
                        <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">User Growth (30 Days)</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={charts.userGrowth}>
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Content Distribution (Pie) */}
                        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">System Content</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={charts.contentDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {charts.contentDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* 3. CHARTS ROW 2 & TABLE */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Activity Volume (Bar) */}
                        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Activity Volume (7 Days)</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={charts.activityVolume}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                        <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                        <Bar dataKey="actions" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* User Management Table */}
                        <div className="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Users</h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Manage access</span>
                            </div>
                            <ul role="list" className="divide-y divide-gray-200 dark:divide-zinc-700 max-h-[400px] overflow-y-auto">
                                {users.data.map((user) => (
                                    <li key={user.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center min-w-0 gap-4">
                                                {/* Avatar */}
                                                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0 overflow-hidden text-primary-700 dark:text-primary-300 font-bold">
                                                    {user.avatar ? (
                                                        <img src={`/storage/${user.avatar}`} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        user.name[0]
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user.username} • {user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-3 py-1 rounded-full">
                                                    <span>{user.notes_count} Notes</span>
                                                    <span className="h-3 w-px bg-gray-300 dark:bg-gray-600"></span>
                                                    <span>{user.tasks_count} Tasks</span>
                                                </div>
                                                <button
                                                    onClick={() => toggleBan(user)}
                                                    className={`p-2 rounded-full border transition ${user.is_banned
                                                        ? 'border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                        : 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                                                    title={user.is_banned ? "Unban User" : "Ban User"}
                                                >
                                                    {user.is_banned ? <CheckCircleIcon className="h-5 w-5"/> : <NoSymbolIcon className="h-5 w-5"/>}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
