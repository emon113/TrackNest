import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function Edit() {
    const { auth, board, myContacts } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: board.name,
        description: board.description || '',
        // Pre-fill with existing collaborator IDs
        collaborators: board.collaborators ? board.collaborators.map(u => u.id) : [],
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('boards.update', board.id));
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
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Board Settings
                    </h2>
                    <Link href={route('boards.index')} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                        &larr; Back to all boards
                    </Link>
                </div>
            }
        >
            <Head title={`Settings for ${board.name}`} />

            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-4 sm:p-8 bg-white dark:bg-zinc-800 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">

                            {/* Name */}
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

                            {/* Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Description (Optional)" />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-zinc-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Collaborators */}
                            {myContacts.length > 0 && (
                                <div>
                                    <InputLabel value="Manage Collaborators" />
                                    <div className="mt-2 grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-zinc-700 rounded-md p-2">
                                        {myContacts.map(contact => (
                                            <label key={contact.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:ring-primary-500"
                                                    checked={data.collaborators.includes(contact.id)}
                                                    onChange={() => toggleCollaborator(contact.id)}
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{contact.name} (@{contact.username})</span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Checked users can view and edit this board.</p>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <PrimaryButton disabled={processing}>
                                    Save Changes
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
