/**
 * 
 */
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

export const SITE_TITLE: string = "Setlist to Playlist";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider attribute="class">
            <Component {...pageProps} />
        </ThemeProvider>
    );
}
