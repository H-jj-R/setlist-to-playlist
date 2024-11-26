import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import "../lib/i18n";

/**
 * Custom App component for Next.js.
 * It initialises and wraps every page with a theme provider and props.
 *
 * @param {AppProps} props - Props passed to the App component, including:
 *  - Component: The page being rendered
 *  - pageProps: Props passed to that page
 */
export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}
