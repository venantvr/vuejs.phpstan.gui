/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './public/index.html',
        './src/**/*.{vue,js,ts}',
        './src/components/PresetManager.vue'
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [],
};