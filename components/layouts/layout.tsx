/**
 * Layout for all pages - for any common components
 */
import React, { ReactNode } from "react";
import Head from "next/head";
import { SITE_TITLE } from "../../pages/_app";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div>
            <Head>
                <title>{SITE_TITLE}</title>
            </Head>
            <div className="">{children}</div>
        </div>
    );
}
