/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                'brandGreen': '#31d04fe6', // Single custom color
                'brandGreen': {      // Custom color with shades
                    light: '#31d04f0f',
                    default: '#17cf3a2b',
                    dark: '#00c046',
                },
                'brandGray': {
                    light: '#989595'
                }
            },
        },
    },
    plugins: [],
}