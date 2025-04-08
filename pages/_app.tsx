/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import type { AppProps } from "next/app";

import { AuthProvider } from "@context/AuthContext";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import "@constants/i18n";
import { useEffect } from "react";

/**
 * Custom App component for Next.js.
 * Initialises and wraps every page with a theme and authentication providers.
 *
 * @param {AppProps} props - Props passed to the App component, including:
 *  - Component: The page being rendered
 *  - pageProps: Props passed to that page
 *
 * @returns The rendered `App` component.
 */
export default function App({ Component, pageProps }: AppProps) {
    /**
     * Registers the PWA service worker once the app is loaded.
     */
    useEffect((): void => {
        if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
            window.addEventListener("load", (): void => {
                navigator.serviceWorker.register("/sw.js");
            });
        }
    }, []);

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </ThemeProvider>
    );
}
