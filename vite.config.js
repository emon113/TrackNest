import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import colors from 'tailwindcss/colors';

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

            // --- WE REMOVED outDir and filename ---
            // Let the Laravel plugin handle the build path.

            manifest: {
                name: 'TrackNest',
                short_name: 'TrackNest',
                description: 'Your unified command center for tasks, notes, and research.',
                theme_color: colors.zinc[900],
                background_color: colors.zinc[900],
                display: 'standalone',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        // --- THIS IS THE FIX ---
                        src: '/pwa-192x192.png', // Added leading "/"
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        // --- THIS IS THE FIX ---
                        src: '/pwa-512x512.png', // Added leading "/"
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
});
