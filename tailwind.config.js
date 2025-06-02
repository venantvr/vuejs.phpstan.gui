/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './public/index.html',
        './src/**/*.{vue,js,ts}',
        './src/components/*.vue',
        './src/views/*.vue',
        './src/views/phpstan/*.vue'
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [],
};