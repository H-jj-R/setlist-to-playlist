/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import HeaderBar from "@components/Shared/HeaderBar";
import Head from "next/head";
import { ReactNode } from "react";

/**
 * Props for the `Layout` component.
 *
 * @property {ReactNode} children - All child components to be displayed inside the layout.
 */
interface LayoutProps {
    children: ReactNode;
}

/**
 * **Layout component**
 *
 * Provides a consistent layout structure for all pages, including a header bar and dynamic content.
 *
 * @param LayoutProps - The component props.
 *
 * @returns {JSX.Element} The rendered `Layout` component.
 */
const Layout: React.FC<LayoutProps> = ({ children }): JSX.Element => {
    return (
        <div id="main-container" className="flex h-screen flex-col">
            <Head>
                <title>Setlist to Playlist</title>
            </Head>
            <HeaderBar />
            <main id="main-content" className="flex grow flex-col overflow-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
