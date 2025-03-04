/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import AccountInfoSection from "@components/LandingPage/AccountInfoSection";
import GenerateSetlistSection from "@components/LandingPage/GenerateSetlistSection";
import SetlistSearchSection from "@components/LandingPage/SetlistSearchSection";
import Layout from "@components/Shared/Layout";
import { useEffect, useState } from "react";

/**
 * The landing page of the site.
 *
 * @returns The rendered index page.
 */
export default function Home() {
    const [mounted, setMounted] = useState(false); // Tracks if the component has mounted

    /**
     * Sets the component as mounted when first rendered.
     */
    useEffect((): void => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Don't render until hook is mounted

    return (
        <div id="index-container" className="flex min-h-screen flex-col">
            <Layout>
                <div id="index-contents-container" className="grow">
                    <SetlistSearchSection />
                    <GenerateSetlistSection />
                    <AccountInfoSection />
                </div>
            </Layout>
        </div>
    );
}
