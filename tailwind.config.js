/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./index.tsx",
        "./App.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./hooks/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['"JetBrains Mono"', 'monospace'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                // Using CSS variables for dynamic theming
                'ugt-red': 'var(--ugt-red)',
                'ugt-green': 'var(--ugt-green)',
                'cyber-violet': 'var(--cyber-violet)',

                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",

                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
            },
            borderRadius: {
                lg: "0.5rem",
                md: "calc(0.5rem - 2px)",
                sm: "calc(0.5rem - 4px)",
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'heartbeat': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                },
                'marquee': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' }
                },
                'border-beam': {
                    '100%': { transform: 'rotate(1turn)' }
                }
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-out',
                'heartbeat': 'heartbeat 3s linear infinite',
                'marquee': 'marquee 25s linear infinite',
                'border-beam': 'border-beam 8s linear infinite',
            },
        }
    },
    plugins: [],
}
