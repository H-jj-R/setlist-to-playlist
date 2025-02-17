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
 */
export default function Home(): JSX.Element {
    const [mounted, setMounted] = useState(false);

    useEffect((): void => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div id="index-container" className="flex min-h-screen flex-col">
            <Layout>
                <div id="index-contents-container" className="flex-grow">
                    <SetlistSearchSection />
                    <GenerateSetlistSection />
                    <AccountInfoSection />
                </div>
            </Layout>
        </div>
    );
}
