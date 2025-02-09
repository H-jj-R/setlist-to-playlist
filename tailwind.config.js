/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    darkMode: "class",
    plugins: [],
    theme: {
        extend: {
            animation: {
                fadeIn: "fadeIn 0.5s ease-in-out"
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" }
                }
            }
        }
    }
};
