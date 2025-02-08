import React, { ReactNode } from "react";
import Head from "next/head";
import HeaderBar from "@components/Shared/HeaderBar";

interface LayoutProps {
    children: ReactNode; // All child components for the page
}

/**
 * Layout for all pages - for common components.
 */
const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
    return (
        <div id="main-container" className="h-screen flex flex-col">
            <Head>
                <title>Setlist to Playlist</title>
            </Head>
            <HeaderBar />
            <main id="main-content" className="flex-grow overflow-auto flex flex-col">
                {children}
            </main>
        </div>
    );
};

export default Layout;
