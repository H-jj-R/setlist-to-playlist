import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@context/AuthContext";
import "@/styles/globals.css";
import "@constants/i18n";

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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </ThemeProvider>
    );
}
