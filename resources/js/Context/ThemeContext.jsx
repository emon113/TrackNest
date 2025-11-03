import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ThemeContext = createContext();

// Create the provider component
export function ThemeProvider({ children }) {
    // We default to 'system' to check localStorage or OS preference
    const [theme, setTheme] = useState(() => {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        return 'system'; // 'system', 'light', or 'dark'
    });

    // This effect runs when the 'theme' state changes
    useEffect(() => {
        const root = window.document.documentElement;

        let activeTheme = theme;

        // If theme is 'system', check the OS preference
        if (theme === 'system') {
            activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        }

        // Apply the 'dark' or 'light' class to the <html> tag
        root.classList.remove(activeTheme === 'dark' ? 'light' : 'dark');
        root.classList.add(activeTheme);

        // Save the *user's choice* (not the resolved theme) to localStorage
        localStorage.setItem('theme', theme);

    }, [theme]); // Re-run this effect when 'theme' changes

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Create a custom hook to use the context
export const useTheme = () => useContext(ThemeContext);
