import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';

export default function Index() {
    const { auth, boards } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('boards.store'), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Task Boards
                    </h2>
                    <PrimaryButton onClick={openModal}>Create New Board</PrimaryButton>
                </div>
            }
        >
            <Head title="Task Boards" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {boards.length === 0 ? (
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <p className="dark:text-gray-400 text-center">
                                You don't have any task boards yet. Create one to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {boards.map((board) => (
                                <div
                                    key={board.id}
                                    className="bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col justify-between overflow-hidden"
                                >
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                            {board.name}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {board.description || 'No description'}
                                        </p>
                                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                            {board.tasks_count} {board.tasks_count === 1 ? 'task' : 'tasks'}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center space-x-3">
                                        <Link
                                            href={route('tasks.index', { board: board.id })}
                                            className="font-semibold text-primary-600 dark:text-primary-400 hover:underline text-sm"
                                        >
                                            Open Board
                                        </Link>
                                        <Link
                                            href={route('boards.edit', board.id)}
                                            className="font-medium text-gray-600 dark:text-gray-400 hover:underline text-sm"
                                        >
                                            Settings
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- Create Board Modal --- */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Create New Board
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Give your new task board a name and description.
                    </p>
                    <div className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Board Name" />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                isFocused
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Description (Optional)" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button type="button" onClick={closeModal} className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 ...">
                            Cancel
                        </button>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Create Board
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
