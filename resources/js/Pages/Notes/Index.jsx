import React, { useEffect, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { BookOpenIcon, InboxIcon, TagIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal'; // <-- Import Modal
import { debounce } from 'lodash';

export default function Index() {

    const { auth, notes, notebooks, tags, currentNotebook, currentTag, currentSearch, flash } = usePage().props;

    const [search, setSearch] = useState(currentSearch || '');
    const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false); // <-- State for Modal

    // --- 1. Form for Creating Notebook ---
    const {
        data: nbData,
        setData: setNbData,
        post: postNb,
        processing: nbProcessing,
        errors: nbErrors,
        reset: resetNb
    } = useForm({
        name: '',
    });

    // --- 2. Submit Notebook Handler ---
    const submitNotebook = (e) => {
        e.preventDefault();
        postNb(route('notebooks.store'), {
            onSuccess: () => {
                setIsNotebookModalOpen(false);
                resetNb();
            }
        });
    };

    // Debounced Search Logic
    const debouncedSearch = useRef(
        debounce((newSearch) => {
            const queryParams = { ...route().params };
            if (newSearch) {
                queryParams.search = newSearch;
            } else {
                delete queryParams.search;
            }
            router.get(route('notes.index'), queryParams, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300)
    ).current;

    useEffect(() => {
        debouncedSearch(search);
    }, [search]);

    const activeLinkClass = "flex items-center gap-3 px-3 py-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-lg";
    const inactiveLinkClass = "flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg";

    // Header Title Logic
    const currentNotebookName = notebooks.find(nb => nb.id == currentNotebook)?.name;
    const currentTagName = tags.find(tag => tag.id == currentTag)?.name;

    let headerTitle = "All Notes";
    if (currentNotebookName) {
        headerTitle = `Notes in: ${currentNotebookName}`;
    } else if (currentTagName) {
        headerTitle = `Notes tagged: ${currentTagName}`;
    } else if (currentSearch) {
        headerTitle = `Search results for: "${currentSearch}"`;
    }

    const clearFilters = () => {
        setSearch('');
        router.get(route('notes.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center gap-4">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight truncate">
                        {headerTitle}
                    </h2>
                    <Link href={route('notes.create')} className="flex-shrink-0">
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

                        {/* Search Bar */}
                        <div className="relative">
                            <TextInput
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search notes..."
                                className="w-full pl-10"
                            />
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                        </div>

                        {(currentNotebook || currentTag || currentSearch) && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                Clear all filters
                            </button>
                        )}

                        {/* NOTEBOOKS SECTION */}
                        <div className="bg-white dark:bg-zinc-800 shadow sm:rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2 px-3">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notebooks</h3>
                                {/* --- 3. ADD NOTEBOOK BUTTON --- */}
                                <button
                                    onClick={() => setIsNotebookModalOpen(true)}
                                    className="text-gray-400 hover:text-primary-500 transition-colors"
                                    title="Create New Notebook"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <nav className="space-y-1">
                                <Link
                                    href={route('notes.index')}
                                    data={{ search: currentSearch || undefined }}
                                    className={!currentNotebook && !currentTag ? activeLinkClass : inactiveLinkClass}
                                >
                                    <InboxIcon className="h-5 w-5" />
                                    <span>All Notes</span>
                                </Link>
                                {notebooks.map((notebook) => (
                                    <Link
                                        key={notebook.id}
                                        href={route('notes.index', { notebook: notebook.id, search: currentSearch || undefined })}
                                        className={currentNotebook == notebook.id ? activeLinkClass : inactiveLinkClass}
                                    >
                                        <BookOpenIcon className="h-5 w-5" />
                                        <span className="flex-1 truncate">{notebook.name}</span>
                                        <span className="text-xs text-gray-500">{notebook.notes_count}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* TAGS SECTION */}
                        {tags.length > 0 && (
                            <div className="bg-white dark:bg-zinc-800 shadow sm:rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">Tags</h3>
                                <nav className="space-y-1">
                                    {tags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={route('notes.index', { tag: tag.id, search: currentSearch || undefined })}
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
                            <div className="p-4 sm:p-8 bg-white dark:bg-zinc-800 shadow sm:rounded-lg">
                                <p className="dark:text-gray-400 text-center">
                                    No notes match your filters.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                                {notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg flex flex-col justify-between overflow-hidden"
                                    >
                                        <div className={`p-6 relative ${note.is_pinned ? 'border-l-4 border-primary-500' : ''}`}>
                                            <Link
                                                href={route('notes.togglePin', note.id)}
                                                method="patch"
                                                as="button"
                                                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
                                                title={note.is_pinned ? 'Unpin' : 'Pin'}
                                            >
                                                {note.is_pinned
                                                    ? <StarSolid className="h-5 w-5 text-primary-500" />
                                                    : <StarOutline className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                                                }
                                            </Link>

                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-8">
                                                {note.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                                {note.content.replace(/<[^>]+>/g, '')}...
                                            </p>

                                            {note.notebook && (
                                                <div className="mt-4">
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300">
                                                        <BookOpenIcon className="h-3 w-3" />
                                                        {note.notebook.name}
                                                    </span>
                                                </div>
                                            )}

                                            {note.tags.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {note.tags.map((tag) => (
                                                        <Link
                                                            key={tag.id}
                                                            href={route('notes.index', { tag: tag.id, search: currentSearch || undefined })}
                                                            className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800"
                                                        >
                                                            #{tag.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-200 dark:border-zinc-700 flex justify-end items-center space-x-3">
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

            {/* --- 4. CREATE NOTEBOOK MODAL --- */}
            <Modal show={isNotebookModalOpen} onClose={() => setIsNotebookModalOpen(false)}>
                <form onSubmit={submitNotebook} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Create New Notebook
                    </h2>

                    <div className="mt-6">
                        <InputLabel htmlFor="nb_name" value="Notebook Name" />
                        <TextInput
                            id="nb_name"
                            type="text"
                            className="mt-1 block w-full"
                            value={nbData.name}
                            onChange={(e) => setNbData('name', e.target.value)}
                            isFocused
                        />
                        <InputError message={nbErrors.name} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsNotebookModalOpen(false)}
                            className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                        >
                            Cancel
                        </button>
                        <PrimaryButton disabled={nbProcessing}>
                            Create
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
