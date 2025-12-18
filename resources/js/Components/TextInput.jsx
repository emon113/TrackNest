import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                // --- FIXES HERE ---
                // 1. Added 'bg-white' explicitly for Light Mode
                // 2. Verified 'dark:bg-zinc-900' for Dark Mode
                // 3. Added 'text-gray-900' for Light Mode text color
                'border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm ' +
                className
            }
            ref={input}
        />
    );
});
