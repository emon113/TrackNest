import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head, usePage } from '@inertiajs/react';
import Editor from '@/Components/Editor';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import CreatableSelect from 'react-select/creatable'; // <-- 1. IMPORT REACT-SELECT
import { selectStyles } from '@/Components/SelectStyles'; // <-- 2. IMPORT OUR STYLES

export default function Edit() {

    const { auth, note, notebooks, allTags } = usePage().props; // 3. GET 'allTags'

    // 4. Format all tags for options
    const tagOptions = allTags.map(tag => ({ value: tag.id, label: tag.name }));

    // 5. Format this note's current tags for the default value
    const currentTagOptions = note.tags.map(tag => ({ value: tag.id, label: tag.name }));

    const { data, setData, put, processing, errors } = useForm({
        title: note.title,
        content: note.content,
        is_pinned: note.is_pinned,
        notebook_id: note.notebook_id || '',
        tags: currentTagOptions, // 6. SET DEFAULT VALUE
    });

    // 7. Handle tag input change
    const handleTagChange = (selectedOptions) => {
        setData('tags', selectedOptions);
    };

    const submit = (e) => {
        e.preventDefault();
        // Use PUT for updates, but React Select sends data, so we use 'data' object
        put(route('notes.update', note.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Note</h2>}
        >
            <Head title="Edit Note" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-4">

                            <div>
                                <InputLabel htmlFor="notebook_id" value="Notebook (Optional)" />
                                <select
                                    id="notebook_id"
                                    name="notebook_id"
                                    value={data.notebook_id}
                                    onChange={(e) => setData('notebook_id', e.target.value)}
                                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                                >
                                    <option value="">(No Notebook)</option>
                                    {notebooks.map((notebook) => (
                                        <option key={notebook.id} value={notebook.id}>
                                            {notebook.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.notebook_id} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="title" value="Title" />
                                <input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            {/* --- 8. ADD THE TAGS INPUT --- */}
                            <div>
                                <InputLabel htmlFor="tags" value="Tags (Optional)" />
                                <CreatableSelect
                                    id="tags"
                                    isMulti
                                    options={tagOptions}
                                    value={data.tags}
                                    onChange={handleTagChange}
                                    styles={selectStyles}
                                    className="mt-1"
                                    placeholder="Type to search or create new tags..."
                                />
                                <InputError message={errors.tags} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="content" value="Content" />
                                <Editor
                                    content={data.content}
                                    onChange={(newContent) => setData('content', newContent)}
                                />
                                <InputError message={errors.content} className="mt-2" />
                            </div>

                            <div className="block">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="is_pinned"
                                        checked={data.is_pinned}
                                        onChange={(e) => setData('is_pinned', e.target.checked)}
                                    />
                                    <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Pin this note to the top</span>
                                </label>
                            </div>

                            <PrimaryButton disabled={processing}>
                                {processing ? 'Updating...' : 'Update Note'}
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
