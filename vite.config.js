import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import colors from 'tailwindcss/colors'; // <-- Make sure this is still here

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                // --- UPDATE THESE ---
                name: 'TrackNest',
                short_name: 'TrackNest',
                description: 'Your unified command center for tasks, notes, and research.',
                // --- END OF UPDATES ---
                theme_color: colors.zinc[900], // Matches your dark mode
                background_color: colors.zinc[900],
                display: 'standalone',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
});
