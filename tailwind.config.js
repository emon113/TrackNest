import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import colors from 'tailwindcss/colors'; // <-- 1. IMPORT TAILWIND'S FULL COLOR PALETTE

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            // --- 2. ADD OUR NEW COLORS HERE ---
            colors: {
                // By replacing 'gray', all of Breeze's dark mode components
                // (like dark:bg-gray-800) will NOW use 'zinc'.
                // 'zinc' is a beautiful, modern, neutral gray.
                gray: colors.zinc,

                // We'll define a 'primary' color. 'teal' is very pleasing
                // and great for productivity apps.
                primary: colors.teal,
            },
            // --- END OF NEW COLORS ---
        },
    },

    plugins: [
        forms,
        typography,
    ],
};
