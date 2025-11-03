import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal'; // We'll use the one from Breeze

export default function Index() {
    const { auth, notebooks } = usePage().props;

    // --- State for the "Create New" form ---
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    // --- State for the "Edit" modal ---
    const [isEditing, setIsEditing] = useState(false);
    const [currentNotebook, setCurrentNotebook] = useState(null);
    const { data: editData, setData: setEditData, patch: update, processing: updateProcessing, errors: updateErrors, reset: resetEdit } = useForm({
        id: '',
        name: '',
    });

    // Handle form submission for creating a new notebook
    const submitCreate = (e) => {
        e.preventDefault();
        post(route('notebooks.store'), {
            onSuccess: () => reset(),
        });
    };

    // Open the "Edit" modal
    const openEditModal = (notebook) => {
        setCurrentNotebook(notebook);
        setEditData({ id: notebook.id, name: notebook.name });
        setIsEditing(true);
    };

    // Close the "Edit" modal
    const closeEditModal = () => {
        setIsEditing(false);
        setCurrentNotebook(null);
        resetEdit();
    };

    // Handle form submission for updating a notebook
    const submitUpdate = (e) => {
        e.preventDefault();
        update(route('notebooks.update', editData.id), {
            onSuccess: () => closeEditModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Manage Notebooks</h2>}
        >
            <Head title="Manage Notebooks" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* --- 1. CREATE NEW NOTEBOOK FORM --- */}
                    <div className="md:col-span-1">
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Notebook</h3>
                            <form onSubmit={submitCreate} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="name" value="Notebook Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Creating...' : 'Create'}
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>

                    {/* --- 2. LIST OF EXISTING NOTEBOOKS --- */}
                    <div className="md:col-span-2">
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Notebooks</h3>
                            <div className="space-y-3">
                                {notebooks.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400">You don't have any notebooks yet.</p>
                                ) : (
                                    notebooks.map((notebook) => (
                                        <div key={notebook.id} className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg flex justify-between items-center">
                                            <div>
                                                <span className="font-medium text-gray-900 dark:text-white">{notebook.name}</span>
                                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                                    ({notebook.notes_count} {notebook.notes_count === 1 ? 'note' : 'notes'})
                                                </span>
                                            </div>
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() => openEditModal(notebook)}
                                                    className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
                                                >
                                                    Rename
                                                </button>
                                                <Link
                                                    href={route('notebooks.destroy', notebook.id)}
                                                    method="delete"
                                                    as="button"
                                                    className="font-medium text-red-600 dark:text-red-400 hover:underline"
                                                    onBefore={() => confirm('Are you sure you want to delete this notebook? Notes inside will NOT be deleted.')}
                                                >
                                                    Delete
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3. EDIT NOTEBOOK MODAL --- */}
            <Modal show={isEditing} onClose={closeEditModal}>
                <form onSubmit={submitUpdate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Rename Notebook
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Enter a new name for your notebook.
                    </p>
                    <div className="mt-6">
                        <InputLabel htmlFor="edit_name" value="Notebook Name" className="sr-only" />
                        <TextInput
                            id="edit_name"
                            name="name"
                            value={editData.name}
                            className="mt-1 block w-full"
                            onChange={(e) => setEditData('name', e.target.value)}
                        />
                        <InputError message={updateErrors.name} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={closeEditModal}
                            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            Cancel
                        </button>
                        <PrimaryButton className="ms-3" disabled={updateProcessing}>
                            {updateProcessing ? 'Saving...' : 'Save'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
