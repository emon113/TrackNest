import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

// Import highlight.js for syntax highlighting
import { createLowlight } from 'lowlight'; // <-- 1. CHANGE THIS LINE
import 'highlight.js/styles/atom-one-dark.css';

// Load the languages you want to support
import javascript from 'highlight.js/lib/languages/javascript';
import php from 'highlight.js/lib/languages/php';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml'; // for HTML/XML

// --- 2. ADD THIS LINE ---
// Create the lowlight instance from the factory function
const lowlight = createLowlight();

// --- 3. CHANGE 'registerLanguage' to 'register' ---
lowlight.register('javascript', javascript);
lowlight.register('php', php);
lowlight.register('css', css);
lowlight.register('html', html);


// This is the toolbar with buttons (Bold, Italic, etc.)
const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    // --- We'll define our button styles here for re-use ---
    const buttonClass = "p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors";
    const activeClass = "bg-gray-300 dark:bg-gray-700 text-black dark:text-white";

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border border-gray-300 dark:border-gray-700 rounded-t-lg">

            {/* === UNDO / REDO GROUP === */}
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className={`${buttonClass} disabled:opacity-50`}
                title="Undo"
            >
                Undo
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className={`${buttonClass} disabled:opacity-50`}
                title="Redo"
            >
                Redo
            </button>

            {/* A small divider */}
            <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

            {/* === HEADING / FONT GROUP === */}
             <button
                type="button"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`${buttonClass} ${editor.isActive('paragraph') ? activeClass : ''}`}
                title="Paragraph"
            >
                Para
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`${buttonClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''}`}
                title="Heading 1"
            >
                <span className="font-bold">H1</span>
            </button>
             <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}
                title="Heading 2"
            >
                <span className="font-bold">H2</span>
            </button>
             <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`${buttonClass} ${editor.isActive('heading', { level: 3 }) ? activeClass : ''}`}
                title="Heading 3"
            >
                <span className="font-bold">H3</span>
            </button>

            {/* A small divider */}
            <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

            {/* === STYLE GROUP === */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`${buttonClass} ${editor.isActive('bold') ? activeClass : ''}`}
                title="Bold"
            >
                <span className="font-bold">B</span>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`${buttonClass} ${editor.isActive('italic') ? activeClass : ''}`}
                title="Italic"
            >
                <span className="italic">I</span>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`${buttonClass} ${editor.isActive('strike') ? activeClass : ''}`}
                title="Strikethrough"
            >
                <span className="line-through">S</span>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={`${buttonClass} ${editor.isActive('code') ? activeClass : ''}`}
                title="Inline Code"
            >
                <span className="font-mono">{`<>`}</span>
            </button>

            {/* A small divider */}
            <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

            {/* === BLOCK GROUP === */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`${buttonClass} ${editor.isActive('bulletList') ? activeClass : ''}`}
                title="Bullet List"
            >
                List
            </button>
             <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`${buttonClass} ${editor.isActive('orderedList') ? activeClass : ''}`}
                title="Ordered List"
            >
                1. List
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`${buttonClass} ${editor.isActive('blockquote') ? activeClass : ''}`}
                title="Blockquote"
            >
                Quote
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`${buttonClass} ${editor.isActive('codeBlock') ? activeClass : ''}`}
                title="Code Block"
            >
                Code Block
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={buttonClass}
                title="Divider"
            >
                ---
            </button>

        </div>
    );
};

// This is the main Editor component
export default function Editor({ content, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            CodeBlockLowlight.configure({
                lowlight, // <-- This part is now correct, passing our new instance
            }),
        ],
        // ... (rest of the component stays the same) ...
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'min-h-[450px] p-4 border border-gray-300 dark:border-gray-700 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-indigo-500',
            },
        },
    });

    return (
        <div className="text-gray-900 dark:text-gray-100">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
