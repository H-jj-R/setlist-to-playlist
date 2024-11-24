import React, { ReactNode } from "react";
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

    return (
        <div>
            <Head>
                <title>{i18nCommon("siteTitle")}</title>
            </Head>
            <HeaderBar />
            <div>{children}</div>
        </div>
    );
}

export default Layout;