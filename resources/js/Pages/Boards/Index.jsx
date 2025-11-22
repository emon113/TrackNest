import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { UsersIcon } from '@heroicons/react/24/outline';

export default function Index() {
    const { auth, boards, myContacts } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        collaborators: [], // Array of user IDs
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => { setIsModalOpen(false); reset(); };

    const submit = (e) => {
        e.preventDefault();
        post(route('boards.store'), { onSuccess: () => closeModal() });
    };

    const toggleCollaborator = (userId) => {
        if (data.collaborators.includes(userId)) {
            setData('collaborators', data.collaborators.filter(id => id !== userId));
        } else {
            setData('collaborators', [...data.collaborators, userId]);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Task Boards</h2>
                    <PrimaryButton onClick={openModal}>Create New Board</PrimaryButton>
                </div>
            }
        >
            <Head title="Task Boards" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {boards.length === 0 ? (
                        <div className="p-8 bg-white dark:bg-zinc-800 shadow sm:rounded-lg text-center">
                            <p className="text-gray-500 dark:text-gray-400">No boards yet. Start your first project!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {boards.map((board) => (
                                <div key={board.id} className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg flex flex-col overflow-hidden border border-gray-100 dark:border-zinc-700">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{board.name}</h3>
                                            {/* Show "Shared" icon if current user is not owner */}
                                            {board.user_id !== auth.user.id && (
                                                <span className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                    <UsersIcon className="h-3 w-3" /> Shared
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{board.description || 'No description'}</p>
                                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">{board.tasks_count} tasks</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-200 dark:border-zinc-700 flex justify-end items-center space-x-3">
                                        <Link href={route('tasks.index', { board: board.id })} className="font-semibold text-primary-600 dark:text-primary-400 hover:underline text-sm">Open Board</Link>
                                        {board.user_id === auth.user.id && (
                                            <Link href={route('boards.edit', board.id)} className="font-medium text-gray-600 dark:text-gray-400 hover:underline text-sm">Settings</Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Board Modal */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Create New Board</h2>
                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Board Name" />
                            <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full" isFocused />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <TextInput id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="mt-1 block w-full" />
                        </div>

                        {/* Collaborators Selection */}
                        {myContacts.length > 0 && (
                            <div>
                                <InputLabel value="Invite Collaborators (Optional)" />
                                <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-zinc-700 rounded-md p-2">
                                    {myContacts.map(contact => (
                                        <label key={contact.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-primary-600 shadow-sm focus:ring-primary-500"
                                                checked={data.collaborators.includes(contact.id)}
                                                onChange={() => toggleCollaborator(contact.id)}
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{contact.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-300">Cancel</button>
                        <PrimaryButton disabled={processing}>Create Board</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
