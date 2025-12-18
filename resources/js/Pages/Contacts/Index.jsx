import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { MagnifyingGlassIcon, UserPlusIcon, CheckIcon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

// --- A. Helper Component: UserCard ---
const UserCard = ({ user, children }) => (
    <div className="p-4 bg-gray-100 dark:bg-zinc-900 rounded-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold overflow-hidden">
                {/* Show Avatar if exists, else Initials */}
                {user.avatar ? (
                    <img src={`/storage/${user.avatar}`} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                    user.name.charAt(0)
                )}
            </div>
            <div>
                <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                {/* Display username with @ prefix */}
                <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>
        </div>
        <div className="flex-shrink-0 flex gap-2">
            {children}
        </div>
    </div>
);

// --- B. Helper Component: Action Buttons ---

// 1. Button to Add a user (from Search)
const AddButton = ({ user }) => (
    <Link
        href={route('contacts.add', { user: user.id })}
        method="post" as="button"
        className="inline-flex items-center justify-center p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
        title="Send contact request"
    >
        <UserPlusIcon className="h-5 w-5" />
    </Link>
);

// 2. Button to Accept a request
const AcceptButton = ({ user }) => (
    <Link
        href={route('contacts.accept', { user: user.id })}
        method="patch" as="button"
        className="inline-flex items-center justify-center p-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
        title="Accept request"
    >
        <CheckIcon className="h-5 w-5" />
    </Link>
);

// 3. Button to Remove/Decline/Cancel
const RemoveButton = ({ user, title }) => (
    <Link
        href={route('contacts.remove', { user: user.id })}
        method="delete" as="button"
        className="inline-flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
        title={title}
    >
        <XMarkIcon className="h-5 w-5" />
    </Link>
);

// 4. Button to Start Chat (NEW)
const MessageButton = ({ user }) => (
    <Link
        href={route('chat.start', { user: user.id })}
        method="post" as="button"
        className="inline-flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
        title="Message"
    >
        <ChatBubbleLeftIcon className="h-5 w-5" />
    </Link>
);


// --- C. The Main Page Component ---
export default function Index() {
    const { auth, myContacts, pendingSent, pendingReceived } = usePage().props;
    const [searchResults, setSearchResults] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        search: '',
    });

    const searchUsers = (e) => {
        e.preventDefault();
        axios.post(route('contacts.search'), data)
            .then(response => {
                setSearchResults(response.data);
            })
            .catch(error => {
                console.error("Error searching users:", error);
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Contacts & People</h2>}
        >
            <Head title="Contacts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* --- COLUMN 1: SEARCH --- */}
                        <div className="space-y-4">
                            <div className="p-4 sm:p-6 bg-white dark:bg-zinc-800 shadow sm:rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Find People</h3>
                                <form onSubmit={searchUsers} className="flex gap-2">
                                    <div className="relative flex-1">
                                        <TextInput
                                            id="search"
                                            name="search"
                                            value={data.search}
                                            className="block w-full pl-10"
                                            placeholder="Search by @username..."
                                            onChange={(e) => setData('search', e.target.value)}
                                        />
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                                    </div>
                                    <PrimaryButton disabled={processing}>Search</PrimaryButton>
                                </form>
                                <InputError message={errors.search} className="mt-2" />
                            </div>

                            {searchResults.length > 0 && (
                                <div className="p-4 sm:p-6 bg-white dark:bg-zinc-800 shadow sm:rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search Results</h3>
                                    <div className="space-y-3">
                                        {searchResults.map(user => (
                                            <UserCard key={user.id} user={user}>
                                                <AddButton user={user} />
                                            </UserCard>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* --- COLUMN 2: MY CONTACTS --- */}
                        <div className="p-4 sm:p-6 bg-white dark:bg-zinc-800 shadow sm:rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Contacts ({myContacts.length})</h3>
                            <div className="space-y-3">
                                {myContacts.length > 0 ? (
                                    myContacts.map(user => (
                                        <UserCard key={user.id} user={user}>
                                            {/* Added Message Button here */}
                                            <MessageButton user={user} />
                                            <RemoveButton user={user} title="Remove contact" />
                                        </UserCard>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Search for people to add to your contacts.</p>
                                )}
                            </div>
                        </div>

                        {/* --- COLUMN 3: PENDING REQUESTS --- */}
                        <div className="space-y-4">
                            {/* Received */}
                            <div className="p-4 sm:p-6 bg-white dark:bg-zinc-800 shadow sm:rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Requests ({pendingReceived.length})</h3>
                                <div className="space-y-3">
                                    {pendingReceived.length > 0 ? (
                                        pendingReceived.map(user => (
                                            <UserCard key={user.id} user={user}>
                                                <AcceptButton user={user} />
                                                <RemoveButton user={user} title="Decline request" />
                                            </UserCard>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">No new contact requests.</p>
                                    )}
                                </div>
                            </div>

                            {/* Sent */}
                            <div className="p-4 sm:p-6 bg-white dark:bg-zinc-800 shadow sm:rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sent Requests ({pendingSent.length})</h3>
                                <div className="space-y-3">
                                    {pendingSent.length > 0 ? (
                                        pendingSent.map(user => (
                                            <UserCard key={user.id} user={user}>
                                                <RemoveButton user={user} title="Cancel request" />
                                            </UserCard>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">No pending sent requests.</p>
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
