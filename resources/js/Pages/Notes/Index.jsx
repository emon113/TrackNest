import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { BookOpenIcon, InboxIcon, TagIcon } from '@heroicons/react/24/outline'; // 1. IMPORT TagIcon

export default function Index() {

    // 2. GET TAGS AND CURRENT TAG FILTER
    const { auth, notes, notebooks, tags, currentNotebook, currentTag } = usePage().props;

    // Helper for active/inactive links
    const activeLinkClass = "flex items-center gap-3 px-3 py-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-lg";
    const inactiveLinkClass = "flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg";

    // 3. GET THE NAME OF THE CURRENT FILTER
    const currentNotebookName = notebooks.find(nb => nb.id == currentNotebook)?.name;
    const currentTagName = tags.find(tag => tag.id == currentTag)?.name;

    // 4. DETERMINE THE HEADER TITLE
    let headerTitle = "All Notes";
    if (currentNotebookName) {
        headerTitle = `Notes in: ${currentNotebookName}`;
    } else if (currentTagName) {
        headerTitle = `Notes tagged: ${currentTagName}`;
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {headerTitle}
                    </h2>
                    <Link href={route('notes.create')}>
                        <PrimaryButton>Create New Note</PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title={headerTitle} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">

                    {/* --- SIDEBAR --- */}
                    <div className="md:col-span-1 space-y-4">
                        {/* NOTEBOOKS SECTION */}
                        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Notebooks</h3>
                            <nav className="space-y-1">
                                <Link
                                    href={route('notes.index')}
                                    className={!currentNotebook && !currentTag ? activeLinkClass : inactiveLinkClass}
                                >
                                    <InboxIcon className="h-5 w-5" />
                                    <span>All Notes</span>
                                </Link>
                                {notebooks.map((notebook) => (
                                    <Link
                                        key={notebook.id}
                                        href={route('notes.index', { notebook: notebook.id })}
                                        className={currentNotebook == notebook.id ? activeLinkClass : inactiveLinkClass}
                                    >
                                        <BookOpenIcon className="h-5 w-5" />
                                        <span className="flex-1 truncate">{notebook.name}</span>
                                        <span className="text-xs text-gray-500">{notebook.notes_count}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* --- 5. TAGS SECTION --- */}
                        {tags.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Tags</h3>
                                <nav className="space-y-1">
                                    {tags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={route('notes.index', { tag: tag.id })}
                                            className={currentTag == tag.id ? activeLinkClass : inactiveLinkClass}
                                        >
                                            <TagIcon className="h-5 w-5" />
                                            <span className="flex-1 truncate">{tag.name}</span>
                                            <span className="text-xs text-gray-500">{tag.notes_count}</span>
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </div>

                    {/* --- CONTENT (NOTE GRID) --- */}
                    <div className="md:col-span-3">
                        {notes.length === 0 ? (
                            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                                <p className="dark:text-gray-400 text-center">
                                    No notes match your filters.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                                {notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col justify-between overflow-hidden"
                                    >
                                        <div className={`p-6 relative`}>
                                            <Link
                                                href={route('notes.togglePin', note.id)}
                                                method="patch"
                                                as="button"
                                                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                                title={note.is_pinned ? 'Unpin' : 'Pin'}
                                            >
                                                {note.is_pinned
                                                    ? <StarSolid className="h-5 w-5 text-primary-500" />
                                                    : <StarOutline className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                                                }
                                            </Link>

                                            {note.is_pinned && <div className="absolute top-0 left-0 h-full w-1.5 bg-primary-500"></div>}

                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-8">
                                                {note.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                                {note.content.replace(/<[^>]+>/g, '')}...
                                            </p>

                                            {note.notebook && (
                                                <div className="mt-4">
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                                                        <BookOpenIcon className="h-3 w-3" />
                                                        {note.notebook.name}
                                                    </span>
                                                </div>
                                            )}

                                            {/* --- 6. DISPLAY TAGS ON CARD --- */}
                                            {note.tags.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {note.tags.map((tag) => (
                                                        <Link
                                                            key={tag.id}
                                                            href={route('notes.index', { tag: tag.id })}
                                                            className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800"
                                                        >
                                                            #{tag.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center space-x-3">
                                            <Link
                                                href={route('notes.show', note.id)}
                                                className="font-medium text-primary-600 dark:text-primary-400 hover:underline text-sm"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={route('notes.edit', note.id)}
                                                className="font-medium text-primary-600 dark:text-primary-400 hover:underline text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                href={route('notes.destroy', note.id)}
                                                method="delete"
                                                as="button"
                                                className="font-medium text-red-600 dark:text-red-400 hover:underline text-sm"
                                                onBefore={() => confirm('Are you sure you want to delete this note?')}
                                            >
                                                Delete
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
