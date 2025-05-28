import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    publicDir: 'public', // Spécifie le dossier public
    server: {
        port: 3000, // Port par défaut
        open: true, // Ouvre le navigateur automatiquement
    },
});