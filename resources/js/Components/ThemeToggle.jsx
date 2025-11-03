import React from 'react';
import { useTheme } from '@/Context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    // We'll also check the resolved theme for the icon state
    const isDarkMode = theme === 'dark' ||
                       (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const toggleTheme = () => {
        // Simple binary toggle: light -> dark, dark -> light
        setTheme(isDarkMode ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle dark mode"
        >
            {isDarkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-500" />
            ) : (
                <MoonIcon className="h-6 w-6 text-gray-700" />
            )}
        </button>
    );
}
