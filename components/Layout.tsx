import React, { ReactNode, useEffect } from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import HeaderBar from "./HeaderBar";

interface LayoutProps {
    children: ReactNode; // All child components for the page
}

/**
 * Layout for all pages - for common components.
 */
const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
    const { t: i18nCommon } = useTranslation("common");

    return (
        <div id="main-container" className="h-screen flex flex-col">
            <Head>
                <title>{i18nCommon("siteTitle")}</title>
            </Head>
            <HeaderBar />
            {/* Main content container */}
            <main id="main-content" className="flex-grow overflow-auto flex flex-col">
                {children}
            </main>
        </div>
    );
};

export default Layout;
