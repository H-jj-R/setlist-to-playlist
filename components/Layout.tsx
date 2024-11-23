import React, { ReactNode } from "react";
import Head from "next/head";
import { SITE_TITLE } from "../pages/_app";
import HeaderBar from "./HeaderBar";

interface LayoutProps {
    children: ReactNode; // All child components for the page
}

/**
 * Layout for all pages - for any common components
 */
const Layout = ({ children }: LayoutProps) => {
    return (
        <div>
            <Head>
                <title>{SITE_TITLE}</title>
            </Head>
            <HeaderBar />
            <div>{children}</div>
        </div>
    );
}

export default Layout;