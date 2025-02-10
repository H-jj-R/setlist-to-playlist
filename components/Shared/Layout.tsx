/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import HeaderBar from "@components/Shared/HeaderBar";
import Head from "next/head";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode; // All child components for the page
}

/**
 * Layout for all pages - for common components.
 */
const Layout: React.FC<LayoutProps> = ({ children }): JSX.Element => {
    return (
        <div id="main-container" className="flex h-screen flex-col">
            <Head>
                <title>Setlist to Playlist</title>
            </Head>
            <HeaderBar />
            <main id="main-content" className="flex flex-grow flex-col overflow-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
