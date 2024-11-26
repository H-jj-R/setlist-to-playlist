import React, { ReactNode, useEffect } from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import HeaderBar from "./HeaderBar";

interface LayoutProps {
    children: ReactNode; // All child components for the page
}

/**
 * Layout for all pages - for any common components
 */
const Layout = ({ children }: LayoutProps) => {
    const { t: i18nCommon } = useTranslation("common");

    useEffect(() => {
        // Prevent scrolling on the body
        document.body.style.overflow = "hidden";

        // Cleanup to restore scrolling on component unmount
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="h-screen flex flex-col">
            <Head>
                <title>{i18nCommon("siteTitle")}</title>
            </Head>
            <HeaderBar />
            {/* Main content container */}
            <main className="flex-grow overflow-auto">{children}</main>
        </div>
    );
};

export default Layout;
