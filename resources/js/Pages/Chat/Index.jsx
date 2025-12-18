import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { PaperAirplaneIcon, MagnifyingGlassIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import TextInput from '@/Components/TextInput';
import { format, isToday, isYesterday } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';

const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
};

export default function ChatIndex() {
    const { auth, conversations, activeConversation, messages: initialMessages } = usePage().props;
    const [messages, setMessages] = useState(initialMessages || []);
    const messagesEndRef = useRef(null);

    // State for Emoji Picker
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        body: '',
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (activeConversation) {
            setMessages(initialMessages);
            const channel = window.Echo.private(`chat.${activeConversation.id}`);
            channel.listen('MessageSent', (e) => {
                setMessages((prevMessages) => [...prevMessages, e]);
            });
            return () => {
                window.Echo.leave(`chat.${activeConversation.id}`);
            };
        }
    }, [activeConversation, initialMessages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!data.body.trim()) return;

        setShowEmojiPicker(false); // Close picker on send

        post(route('chat.store', activeConversation.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const onEmojiClick = (emojiObject) => {
        // Append emoji to current message text
        setData('body', data.body + emojiObject.emoji);
    };

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Chat" />

            <div className="flex-1 flex overflow-hidden bg-white dark:bg-zinc-900">

                {/* --- LEFT SIDEBAR --- */}
                <div className={`${activeConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50`}>
                    <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900">
                        <h3 className="font-bold text-xl text-gray-800 dark:text-white">Chats</h3>
                        <Link href={route('contacts.index')} className="p-1.5 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 hover:bg-primary-200 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        </Link>
                    </div>

                    <div className="p-3">
                        <div className="relative">
                            <TextInput
                                placeholder="Search..."
                                className="w-full pl-9 py-2 text-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-full focus:ring-primary-500"
                            />
                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((convo) => (
                            <Link
                                key={convo.id}
                                href={route('chat.show', convo.id)}
                                className={`relative flex items-center gap-3 p-4 hover:bg-white dark:hover:bg-zinc-800 transition border-l-4 ${
                                    activeConversation && activeConversation.id === convo.id
                                        ? 'border-primary-500 bg-white dark:bg-zinc-800 shadow-sm'
                                        : 'border-transparent'
                                }`}
                            >
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-lg font-bold text-gray-500 dark:text-gray-300 overflow-hidden">
                                        {convo.avatar ? (
                                            <img src={`/storage/${convo.avatar}`} alt={convo.name} className="h-full w-full object-cover" />
                                        ) : (
                                            convo.name.charAt(0)
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h4 className={`text-sm truncate ${convo.is_unread ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-200'}`}>
                                            {convo.name}
                                        </h4>
                                        <span className="text-xs text-gray-400">{formatMessageTime(convo.last_message_date)}</span>
                                    </div>
                                    <p className={`text-sm truncate ${convo.is_unread ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {convo.last_message}
                                    </p>
                                </div>
                                {convo.is_unread && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 bg-primary-500 rounded-full ring-2 ring-white dark:ring-zinc-900"></div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* --- RIGHT AREA (Active Chat) --- */}
                {activeConversation ? (
                    <div className={`${activeConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white dark:bg-zinc-950 relative`}>

                        {/* Chat Header */}
                        <div className="px-6 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md z-10">
                            <Link href={route('chat.index')} className="md:hidden mr-4 text-gray-500 hover:text-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            </Link>
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 overflow-hidden">
                                {activeConversation.avatar ? (
                                    <img src={`/storage/${activeConversation.avatar}`} alt={activeConversation.name} className="h-full w-full object-cover" />
                                ) : (
                                    activeConversation.name.charAt(0)
                                )}
                            </div>
                            <div className="ml-3">
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{activeConversation.name}</h3>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-zinc-950/50 scroll-smooth">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-zinc-700">
                                    <FaceSmileIcon className="h-16 w-16 mb-4" />
                                    <p className="text-lg font-medium">Start a conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = msg.user_id === auth.user.id;
                                    const showAvatar = index === 0 || messages[index - 1].user_id !== msg.user_id;

                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 group`}>
                                            {!isMe && (
                                                <div className="w-8 h-8 flex-shrink-0 mb-1">
                                                    {showAvatar && (
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold overflow-hidden">
                                                             {msg.sender?.avatar ? (
                                                                <img src={`/storage/${msg.sender.avatar}`} className="w-full h-full object-cover" />
                                                             ) : (
                                                                msg.sender?.name[0]
                                                             )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className={`max-w-[75%] md:max-w-[60%] px-5 py-2.5 rounded-2xl shadow-sm text-sm relative ${
                                                isMe
                                                    ? 'bg-primary-600 text-white rounded-br-none'
                                                    : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-zinc-700'
                                            }`}>
                                                <p className="whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                                                <p className={`text-[10px] mt-1 text-right opacity-70 ${isMe ? 'text-primary-100' : 'text-gray-500'}`}>
                                                    {format(new Date(msg.created_at), 'h:mm a')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* --- INPUT AREA WITH EMOJI PICKER --- */}
                        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 relative">

                            {/* Emoji Picker Popup */}
                            {showEmojiPicker && (
                                <div className="absolute bottom-20 left-4 z-50 shadow-2xl rounded-xl">
                                    <EmojiPicker
                                        onEmojiClick={onEmojiClick}
                                        theme="auto" // Auto dark/light mode
                                        searchDisabled={false}
                                        width={300}
                                        height={400}
                                    />
                                </div>
                            )}

                            <form onSubmit={sendMessage} className="flex items-center gap-3 max-w-4xl mx-auto">

                                {/* Emoji Button (FIXED) */}
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
                                >
                                    <FaceSmileIcon className="h-7 w-7" />
                                </button>

                                <TextInput
                                    className="flex-1 rounded-full border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent px-5 py-3"
                                    placeholder="Type a message..."
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={processing || !data.body.trim()}
                                    className="p-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
                                >
                                    <PaperAirplaneIcon className="h-5 w-5 -rotate-45 translate-x-[-1px] translate-y-[1px]" />
                                </button>
                            </form>
                        </div>

                    </div>
                ) : (
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-400 bg-white dark:bg-zinc-950">
                        <div className="w-32 h-32 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                            <PaperAirplaneIcon className="h-12 w-12 text-gray-300 dark:text-zinc-700" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Select a conversation</h3>
                        <p className="text-gray-500 mt-2">Choose a contact from the left to start chatting.</p>
                    </div>
                )}
            </div>

            {/* Click outside handler to close emoji picker */}
            {showEmojiPicker && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowEmojiPicker(false)}
                ></div>
            )}
        </AuthenticatedLayout>
    );
}
